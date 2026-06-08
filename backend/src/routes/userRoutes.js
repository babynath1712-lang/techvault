const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteAccount, getSellerProducts } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(protect);

// GET /api/users/profile
router.get('/profile', getProfile);

// PUT /api/users/profile
router.put('/profile', updateProfile);

// DELETE /api/users/account
router.delete('/account', deleteAccount);

// GET /api/users/my-products (for sellers)
router.get('/my-products', getSellerProducts);

module.exports = router;
