const crypto = require('crypto');

/**
 * Verify Razorpay payment signature
 * @param {string} razorpay_order_id
 * @param {string} razorpay_payment_id
 * @param {string} razorpay_signature
 * @returns {boolean}
 */
const verifyRazorpaySignature = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === razorpay_signature;
};

/**
 * Initialize Razorpay instance
 */
const getRazorpayInstance = () => {
  const Razorpay = require('razorpay');
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

module.exports = { verifyRazorpaySignature, getRazorpayInstance };
