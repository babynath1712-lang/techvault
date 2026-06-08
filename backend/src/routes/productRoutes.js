const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { sellerOrAdmin } = require('../middleware/adminMiddleware');

// GET /api/products - public
router.get('/', getAllProducts);

// GET /api/products/search - public
router.get('/search', searchProducts);

// GET /api/products/:id - public
router.get('/:id', getProductById);

// POST /api/products - seller/admin only
router.post('/', sellerOrAdmin, createProduct);

// PUT /api/products/:id - seller/admin only
router.put('/:id', sellerOrAdmin, updateProduct);

// DELETE /api/products/:id - seller/admin only
router.delete('/:id', sellerOrAdmin, deleteProduct);

module.exports = router;
