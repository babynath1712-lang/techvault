const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: [
        'Laptops',
        'Smartphones',
        'Tablets',
        'Accessories',
        'Audio',
        'Gaming',
        'Cameras',
        'Wearables',
        'Components',
        'Other',
      ],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length <= 10,
        message: 'Cannot have more than 10 images',
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock', 'pending_approval'],
      default: 'active',
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

// Indexes for search performance
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ status: 1 });
productSchema.index({ seller_id: 1, status: 1 });

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function () {
  return `₹${this.price.toLocaleString('en-IN')}`;
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
