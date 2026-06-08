const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  getAllOrders,
  getAllProducts,
  approveProduct,
} = require('../controllers/adminController');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes require admin role
router.use(adminOnly);

// GET /api/admin/dashboard
router.get('/dashboard', getDashboardStats);

// GET /api/admin/users
router.get('/users', getAllUsers);

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', updateUserRole);

// PATCH /api/admin/users/:id/deactivate
router.patch('/users/:id/deactivate', deactivateUser);

// GET /api/admin/orders
router.get('/orders', getAllOrders);

// GET /api/admin/products
router.get('/products', getAllProducts);

// PATCH /api/admin/products/:id/approve
router.patch('/products/:id/approve', approveProduct);

module.exports = router;
