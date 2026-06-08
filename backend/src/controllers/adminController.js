const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

// ─── Dashboard Stats ──────────────────────────────────────────────
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders, totalRevenue] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Product.countDocuments(),
      Order.countDocuments(),
      Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    const revenueByMonth = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: { $month: '$paid_at' }, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } },
    ]);

    return sendSuccess(res, 200, 'Dashboard stats fetched', {
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      revenueByMonth,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get All Users ────────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ created_at: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    return sendPaginated(res, users, page, limit, total);
  } catch (error) {
    next(error);
  }
};

// ─── Update User Role ─────────────────────────────────────────────
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['buyer', 'seller', 'admin'].includes(role)) {
      return sendError(res, 400, 'Invalid role');
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return sendError(res, 404, 'User not found');

    return sendSuccess(res, 200, 'User role updated', { user });
  } catch (error) {
    next(error);
  }
};

// ─── Deactivate User ──────────────────────────────────────────────
const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return sendError(res, 404, 'User not found');

    return sendSuccess(res, 200, 'User deactivated', { user });
  } catch (error) {
    next(error);
  }
};

// ─── Get All Orders ───────────────────────────────────────────────
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('buyer_id', 'name email').sort({ created_at: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    return sendPaginated(res, orders, page, limit, total);
  } catch (error) {
    next(error);
  }
};

// ─── Get All Products (Admin) ─────────────────────────────────────
const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).populate('seller_id', 'name email').sort({ created_at: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    return sendPaginated(res, products, page, limit, total);
  } catch (error) {
    next(error);
  }
};

// ─── Approve Product ──────────────────────────────────────────────
const approveProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    );
    if (!product) return sendError(res, 404, 'Product not found');

    return sendSuccess(res, 200, 'Product approved', { product });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getAllUsers, updateUserRole, deactivateUser, getAllOrders, getAllProducts, approveProduct };
