const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    method: {
      type: String,
      enum: ['razorpay', 'upi', 'card', 'netbanking', 'wallet', 'cod'],
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transaction_id: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allow multiple null values
    },
    razorpay_order_id: {
      type: String,
      trim: true,
      default: null,
    },
    razorpay_payment_id: {
      type: String,
      trim: true,
      default: null,
    },
    razorpay_signature: {
      type: String,
      trim: true,
      default: null,
    },
    paid_at: {
      type: Date,
      default: null,
    },
    failure_reason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

// Indexes
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
