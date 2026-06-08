const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    otp_code: {
      type: String,
      required: [true, 'OTP code is required'],
      length: 6,
    },
    purpose: {
      type: String,
      enum: ['email_verification', 'password_reset', 'login', 'phone_verification'],
      required: [true, 'OTP purpose is required'],
    },
    expires_at: {
      type: Date,
      required: [true, 'Expiry time is required'],
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    },
    is_used: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
      max: [5, 'Maximum OTP attempts exceeded'],
    },
  },
  {
    timestamps: { createdAt: 'created_at' },
    versionKey: false,
  }
);

// TTL index — MongoDB auto-deletes expired OTPs
otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

// Compound index for fast lookups
otpSchema.index({ user_id: 1, purpose: 1, is_used: 1 });

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
