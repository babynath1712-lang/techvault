const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getSellerOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All order routes require authentication
router.use(protect);

// POST /api/orders — place a new order
router.post('/', createOrder);

// GET /api/orders/my-orders — buyer's orders
router.get('/my-orders', getMyOrders);

// GET /api/orders/seller-orders — seller's incoming orders
router.get('/seller-orders', getSellerOrders);

// GET /api/orders/:id — get single order
router.get('/:id', getOrderById);

// PATCH /api/orders/:id/status — update order status (admin/seller)
router.patch('/:id/status', updateOrderStatus);

// PATCH /api/orders/:id/cancel — cancel order (buyer/admin)
router.patch('/:id/cancel', cancelOrder);

module.exports = router;
