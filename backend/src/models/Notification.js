const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: [
        'order_placed',
        'order_confirmed',
        'order_shipped',
        'order_delivered',
        'order_cancelled',
        'payment_success',
        'payment_failed',
        'product_approved',
        'product_rejected',
        'new_message',
        'system',
      ],
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    reference_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null, // e.g., order_id, product_id
    },
    reference_type: {
      type: String,
      enum: ['Order', 'Product', 'Payment', 'User', null],
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at' },
    versionKey: false,
  }
);

// Indexes
notificationSchema.index({ user_id: 1, is_read: 1 });
notificationSchema.index({ user_id: 1, created_at: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
