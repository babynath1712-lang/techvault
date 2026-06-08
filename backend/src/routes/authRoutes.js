const express = require('express');
const router = express.Router();
const { register, login, verifyOTP, resendOTP, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter, otpLimiter } = require('../middleware/rateLimitMiddleware');

// POST /api/auth/register
router.post('/register', authLimiter, register);

// POST /api/auth/login
router.post('/login', authLimiter, login);

// POST /api/auth/verify-otp
router.post('/verify-otp', otpLimiter, verifyOTP);

// POST /api/auth/resend-otp
router.post('/resend-otp', otpLimiter, resendOTP);

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, resetPassword);

// GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
