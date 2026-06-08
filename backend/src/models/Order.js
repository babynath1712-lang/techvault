const mongoose = require('mongoose');

// Embedded subdocument for order items (mirrors ORDER_ITEMS table in ERD)
const orderItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: [true, 'Product ID is required'],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit_price: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
  },
  { _id: true }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'India' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer ID is required'],
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: 'Order must have at least one item',
      },
    },
    total_amount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shipping_address: shippingAddressSchema,
    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

// Indexes
orderSchema.index({ buyer_id: 1, status: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ created_at: -1 });

// Virtual: computed subtotal per item
orderItemSchema.virtual('subtotal').get(function () {
  return this.quantity * this.unit_price;
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
