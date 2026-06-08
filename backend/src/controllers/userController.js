const User = require('../models/User');
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/response');

// ─── Get My Profile ───────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'Profile fetched', { user: req.user });
  } catch (error) {
    next(error);
  }
};

// ─── Update Profile ───────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, profileImage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, profileImage },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 200, 'Profile updated successfully', { user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// ─── Delete Account ───────────────────────────────────────────────
const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    return sendSuccess(res, 200, 'Account deactivated successfully');
  } catch (error) {
    next(error);
  }
};

// ─── Get Seller's Products ────────────────────────────────────────
const getSellerProducts = async (req, res, next) => {
  try {
    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
      return sendError(res, 403, 'Only sellers can access this route');
    }

    const products = await Product.find({ seller_id: req.user._id }).sort({ created_at: -1 });
    return sendSuccess(res, 200, 'Seller products fetched', { products });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, deleteAccount, getSellerProducts };
