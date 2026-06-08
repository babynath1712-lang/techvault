const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const { createRazorpayOrder, fetchRazorpayPayment, initiateRefund, getUPIDetails } = require('../config/razorpay');
const { createNotification } = require('../services/notificationService');
const { sendPaymentReceiptEmail } = require('../services/emailService');
const { sendSuccess, sendError } = require('../utils/response');

// ─── Create Razorpay Order ────────────────────────────────────────
const createRazorpayOrderCtrl = async (req, res, next) => {
  try {
    const { order_id } = req.body;

    if (!order_id) return sendError(res, 400, 'order_id is required');

    const order = await Order.findById(order_id);
    if (!order) return sendError(res, 404, 'Order not found');

    if (order.buyer_id.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Not authorized to pay for this order');
    }

    if (order.status !== 'pending') {
      return sendError(res, 400, `Order is already ${order.status}`);
    }

    // Check if a completed payment already exists
    const existingPayment = await Payment.findOne({ order_id, status: 'completed' });
    if (existingPayment) {
      return sendError(res, 400, 'This order has already been paid');
    }

    // Create Razorpay order using config helper
    const razorpayOrder = await createRazorpayOrder({
      amount: order.total_amount,
      currency: 'INR',
      receipt: `receipt_${order._id}`,
      notes: { order_id: order._id.toString(), buyer_id: req.user._id.toString() },
    });

    // Create a pending payment record
    const payment = await Payment.create({
      order_id: order._id,
      user_id: req.user._id,
      amount: order.total_amount,
      method: 'razorpay',
      status: 'pending',
      razorpay_order_id: razorpayOrder.id,
    });

    return sendSuccess(res, 200, 'Razorpay order created successfully', {
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      payment_id: payment._id,
      key_id: process.env.RAZORPAY_KEY_ID,
      prefill: {
        name: req.user.name,
        email: req.user.email,
        contact: req.user.phone || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Verify Payment ───────────────────────────────────────────────
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !payment_id) {
      return sendError(res, 400, 'All payment verification fields are required');
    }

    // Verify HMAC-SHA256 signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await Payment.findByIdAndUpdate(payment_id, {
        status: 'failed',
        failure_reason: 'Invalid signature — possible tampered request',
      });
      return sendError(res, 400, 'Payment verification failed: signature mismatch');
    }

    // Mark payment as completed
    const payment = await Payment.findByIdAndUpdate(
      payment_id,
      {
        status: 'completed',
        razorpay_payment_id,
        razorpay_signature,
        transaction_id: razorpay_payment_id,
        paid_at: new Date(),
      },
      { new: true }
    );

    if (!payment) return sendError(res, 404, 'Payment record not found');

    // Update order → confirmed
    const order = await Order.findByIdAndUpdate(
      payment.order_id,
      { status: 'confirmed', payment_id: payment._id },
      { new: true }
    );

    // Send notification
    await createNotification(
      req.user._id,
      'payment_success',
      'Payment Successful',
      `Payment of ₹${payment.amount.toLocaleString('en-IN')} for order #${order._id} was successful.`,
      order._id,
      'Order'
    );

    // Send payment receipt email (non-blocking)
    const user = await User.findById(req.user._id);
    if (user && user.email) {
      sendPaymentReceiptEmail(user.email, user.name, payment, order).catch(() => {});
    }

    return sendSuccess(res, 200, 'Payment verified successfully', { payment, order });
  } catch (error) {
    next(error);
  }
};

// ─── Get Payment By Order ─────────────────────────────────────────
const getPaymentByOrder = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ order_id: req.params.orderId }).populate('order_id');
    if (!payment) return sendError(res, 404, 'Payment not found for this order');

    // Ensure user can only see their own payment
    if (payment.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to view this payment');
    }

    return sendSuccess(res, 200, 'Payment fetched', { payment });
  } catch (error) {
    next(error);
  }
};

// ─── Get My Payments ──────────────────────────────────────────────
const getMyPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { user_id: req.user._id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [payments, total] = await Promise.all([
      Payment.find(filter).populate('order_id', 'status total_amount items').sort({ created_at: -1 }).skip(skip).limit(Number(limit)),
      Payment.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: payments,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Request Refund ───────────────────────────────────────────────
const requestRefund = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return sendError(res, 404, 'Payment not found');

    if (payment.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to refund this payment');
    }

    if (payment.status !== 'completed') {
      return sendError(res, 400, 'Only completed payments can be refunded');
    }

    if (!payment.razorpay_payment_id) {
      return sendError(res, 400, 'No Razorpay payment ID found for refund');
    }

    const refund = await initiateRefund(payment.razorpay_payment_id, payment.amount);

    await Payment.findByIdAndUpdate(payment._id, { status: 'refunded' });

    await createNotification(
      payment.user_id,
      'payment_failed',
      'Refund Initiated',
      `Refund of ₹${payment.amount} has been initiated for order #${payment.order_id}.`,
      payment.order_id,
      'Order'
    );

    return sendSuccess(res, 200, 'Refund initiated successfully', { refund });
  } catch (error) {
    next(error);
  }
};

// ─── Get UPI Payment Details ──────────────────────────────────────
const getUPIPaymentDetails = async (req, res, next) => {
  try {
    const upi = getUPIDetails();

    // Build UPI deep link for QR code generation
    const { order_id } = req.query;
    let amount = null;

    if (order_id) {
      const order = await Order.findById(order_id);
      if (order) amount = order.total_amount;
    }

    const upiLink = amount
      ? `upi://pay?pa=${upi.upi_id}&pn=${encodeURIComponent(upi.name)}&am=${amount}&cu=INR&tn=TechVault+Order`
      : `upi://pay?pa=${upi.upi_id}&pn=${encodeURIComponent(upi.name)}&cu=INR`;

    return sendSuccess(res, 200, 'UPI payment details fetched', {
      upi_id: upi.upi_id,
      upi_name: upi.name,
      upi_link: upiLink,
      amount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRazorpayOrder: createRazorpayOrderCtrl, verifyPayment, getPaymentByOrder, getMyPayments, requestRefund, getUPIPaymentDetails };
