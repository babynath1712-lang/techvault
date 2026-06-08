const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
  getPaymentByOrder,
  getMyPayments,
  requestRefund,
  getUPIPaymentDetails,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// All payment routes require authentication
router.use(protect);

// GET /api/payments/upi?order_id=xxx — get UPI ID, name & deep link for QR
router.get('/upi', getUPIPaymentDetails);

// POST /api/payments/create-order — initiate Razorpay order
router.post('/create-order', createRazorpayOrder);

// POST /api/payments/verify — verify Razorpay payment signature
router.post('/verify', verifyPayment);

// GET /api/payments/my-payments — get current user's payment history
router.get('/my-payments', getMyPayments);

// GET /api/payments/order/:orderId — get payment for a specific order
router.get('/order/:orderId', getPaymentByOrder);

// POST /api/payments/:id/refund — request a refund
router.post('/:id/refund', requestRefund);

module.exports = router;
