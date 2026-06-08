const Product = require('../models/Product');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

// ─── Get All Products ─────────────────────────────────────────────
const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, minPrice, maxPrice, status = 'active' } = req.query;

    const filter = { status };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('seller_id', 'name email')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    return sendPaginated(res, products, page, limit, total);
  } catch (error) {
    next(error);
  }
};

// ─── Get Product By ID ────────────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller_id', 'name email phone');
    if (!product) return sendError(res, 404, 'Product not found');

    return sendSuccess(res, 200, 'Product fetched', { product });
  } catch (error) {
    next(error);
  }
};

// ─── Search Products ──────────────────────────────────────────────
const searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    if (!q) return sendError(res, 400, 'Search query is required');

    const skip = (Number(page) - 1) * Number(limit);
    const filter = {
      status: 'active',
      $text: { $search: q },
    };

    const [products, total] = await Promise.all([
      Product.find(filter, { score: { $meta: 'textScore' } })
        .populate('seller_id', 'name')
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    return sendPaginated(res, products, page, limit, total);
  } catch (error) {
    next(error);
  }
};

// ─── Create Product ───────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, stock, category, images, specifications } = req.body;

    const product = await Product.create({
      seller_id: req.user._id,
      title,
      description,
      price,
      stock,
      category,
      images: images || [],
      specifications: specifications || {},
    });

    return sendSuccess(res, 201, 'Product created successfully', { product });
  } catch (error) {
    next(error);
  }
};

// ─── Update Product ───────────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, 'Product not found');

    // Only the seller or admin can update
    if (product.seller_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to update this product');
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, 200, 'Product updated successfully', { product: updated });
  } catch (error) {
    next(error);
  }
};

// ─── Delete Product ───────────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, 'Product not found');

    if (product.seller_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to delete this product');
    }

    await Product.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 200, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllProducts, getProductById, searchProducts, createProduct, updateProduct, deleteProduct };
