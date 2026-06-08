const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');
const { sendOrderConfirmationEmail, sendOrderStatusEmail } = require('../services/emailService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

// ─── Create Order ─────────────────────────────────────────────────
const createOrder = async (req, res, next) => {
  try {
    const { items, shipping_address, notes } = req.body;

    if (!items || items.length === 0) {
      return sendError(res, 400, 'Order must have at least one item');
    }

    if (!shipping_address) {
      return sendError(res, 400, 'Shipping address is required');
    }

    // Validate products and build order items
    let total_amount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity < 1) {
        return sendError(res, 400, 'Each item must have a valid product_id and quantity');
      }

      const product = await Product.findById(item.product_id);
      if (!product) return sendError(res, 404, `Product ${item.product_id} not found`);
      if (product.status !== 'active') return sendError(res, 400, `"${product.title}" is not available`);
      if (product.stock < item.quantity) {
        return sendError(res, 400, `Only ${product.stock} units available for "${product.title}"`);
      }

      const unit_price = product.price;
      total_amount += unit_price * item.quantity;

      orderItems.push({
        product_id: product._id,
        title: product.title,
        image: product.images[0] || null,
        quantity: item.quantity,
        unit_price,
      });

      // Reduce stock
      product.stock -= item.quantity;
      if (product.stock === 0) product.status = 'out_of_stock';
      await product.save();
    }

    const order = await Order.create({
      buyer_id: req.user._id,
      items: orderItems,
      total_amount,
      shipping_address,
      notes: notes || '',
    });

    // Send notification (non-blocking)
    createNotification(
      req.user._id,
      'order_placed',
      'Order Placed Successfully',
      `Your order #${order._id} for ₹${total_amount.toLocaleString('en-IN')} has been placed.`,
      order._id,
      'Order'
    ).catch(() => {});

    // Send confirmation email (non-blocking)
    const user = await User.findById(req.user._id);
    if (user && user.email) {
      sendOrderConfirmationEmail(user.email, user.name, order).catch(() => {});
    }

    return sendSuccess(res, 201, 'Order placed successfully', { order });
  } catch (error) {
    next(error);
  }
};

// ─── Get My Orders ────────────────────────────────────────────────
const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { buyer_id: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('payment_id', 'status amount method paid_at')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    return sendPaginated(res, orders, page, limit, total);
  } catch (error) {
    next(error);
  }
};

// ─── Get Order By ID ──────────────────────────────────────────────
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer_id', 'name email phone')
      .populate('payment_id');

    if (!order) return sendError(res, 404, 'Order not found');

    if (order.buyer_id._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to view this order');
    }

    return sendSuccess(res, 200, 'Order fetched', { order });
  } catch (error) {
    next(error);
  }
};

// ─── Update Order Status ──────────────────────────────────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return sendError(res, 400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Only admin/sellers can update to confirmed/shipped/delivered
    if (req.user.role === 'buyer' && status !== 'cancelled') {
      return sendError(res, 403, 'Buyers can only cancel orders. Use the cancel endpoint.');
    }

    const order = await Order.findById(req.params.id).populate('buyer_id', 'name email');
    if (!order) return sendError(res, 404, 'Order not found');

    // Prevent going backwards in status
    const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    const currentIdx = statusOrder.indexOf(order.status);
    const newIdx = statusOrder.indexOf(status);

    if (order.status === 'delivered' || order.status === 'cancelled') {
      return sendError(res, 400, `Cannot update a ${order.status} order`);
    }

    order.status = status;
    await order.save();

    // Send notification to buyer
    createNotification(
      order.buyer_id._id,
      `order_${status}`,
      `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      `Your order #${order._id} has been ${status}.`,
      order._id,
      'Order'
    ).catch(() => {});

    // Send status update email (non-blocking)
    if (order.buyer_id && order.buyer_id.email) {
      sendOrderStatusEmail(order.buyer_id.email, order.buyer_id.name, order).catch(() => {});
    }

    return sendSuccess(res, 200, `Order status updated to ${status}`, { order });
  } catch (error) {
    next(error);
  }
};

// ─── Cancel Order ─────────────────────────────────────────────────
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return sendError(res, 404, 'Order not found');

    if (order.buyer_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to cancel this order');
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      return sendError(res, 400, `Cannot cancel a ${order.status} order`);
    }

    if (order.status === 'cancelled') {
      return sendError(res, 400, 'Order is already cancelled');
    }

    // Restore stock for each item
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock: item.quantity },
        $set: { status: 'active' },
      });
    }

    order.status = 'cancelled';
    await order.save();

    createNotification(
      order.buyer_id,
      'order_cancelled',
      'Order Cancelled',
      `Your order #${order._id} has been cancelled.`,
      order._id,
      'Order'
    ).catch(() => {});

    return sendSuccess(res, 200, 'Order cancelled successfully', { order });
  } catch (error) {
    next(error);
  }
};

// ─── Get All Orders (Seller's products) ──────────────────────────
const getSellerOrders = async (req, res, next) => {
  try {
    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
      return sendError(res, 403, 'Only sellers can access this route');
    }

    const { page = 1, limit = 10, status } = req.query;

    // Get seller's product IDs
    const Product = require('../models/Product');
    const sellerProducts = await Product.find({ seller_id: req.user._id }).select('_id');
    const productIds = sellerProducts.map(p => p._id);

    const filter = { 'items.product_id': { $in: productIds } };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('buyer_id', 'name email phone')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    return sendPaginated(res, orders, page, limit, total);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, cancelOrder, getSellerOrders };
