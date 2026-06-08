const OTP = require('../models/OTP');

/**
 * Generate a 6-digit OTP and save to DB
 * @param {string} userId
 * @param {string} purpose
 * @returns {string} The OTP code
 */
const generateOTP = async (userId, purpose) => {
  // Invalidate any previous OTPs for same user/purpose
  await OTP.deleteMany({ user_id: userId, purpose, is_used: false });

  const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await OTP.create({
    user_id: userId,
    otp_code,
    purpose,
    expires_at,
  });

  return otp_code;
};

/**
 * Verify an OTP code
 * @param {string} userId
 * @param {string} otp_code
 * @param {string} purpose
 * @returns {boolean}
 */
const verifyOTPCode = async (userId, otp_code, purpose) => {
  const otp = await OTP.findOne({
    user_id: userId,
    otp_code,
    purpose,
    is_used: false,
    expires_at: { $gt: new Date() },
  });

  if (!otp) return false;

  // Mark as used
  otp.is_used = true;
  await otp.save();

  return true;
};

module.exports = { generateOTP, verifyOTPCode };
