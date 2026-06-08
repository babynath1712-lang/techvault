const { protect, restrictTo } = require('./authMiddleware');

// ─── Admin Only Middleware ─────────────────────────────────────────
const adminOnly = [protect, restrictTo('admin')];

// ─── Seller or Admin Middleware ───────────────────────────────────
const sellerOrAdmin = [protect, restrictTo('seller', 'admin')];

module.exports = { adminOnly, sellerOrAdmin };
