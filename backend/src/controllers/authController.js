const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');
const { sendOTPEmail, sendWelcomeEmail } = require('../services/emailService');
const { generateOTP, verifyOTPCode } = require('../services/otpService');

// ─── Register ────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required');
    }

    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters');
    }

    if (!['buyer', 'seller'].includes(role) && role !== undefined) {
      return sendError(res, 400, 'Role must be buyer or seller');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 400, 'An account with this email already exists');
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash: password,
      role: role || 'buyer',
      phone: phone || undefined,
    });

    // Send OTP for email verification (non-blocking)
    try {
      const otp = await generateOTP(user._id, 'email_verification');
      await sendOTPEmail(user.email, user.name, otp, 'email_verification');
    } catch (emailErr) {
      console.warn('OTP email failed (non-critical):', emailErr.message);
    }

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 201, 'Registration successful. Please verify your email with the OTP sent.', {
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password_hash');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Your account has been deactivated. Contact support.');
    }

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 200, 'Login successful', {
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ─── Verify OTP ───────────────────────────────────────────────────
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp_code, purpose } = req.body;

    if (!email || !otp_code || !purpose) {
      return sendError(res, 400, 'Email, otp_code, and purpose are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return sendError(res, 404, 'User not found');

    const isValid = await verifyOTPCode(user._id, otp_code, purpose);
    if (!isValid) return sendError(res, 400, 'Invalid or expired OTP. Please request a new one.');

    if (purpose === 'email_verification' && !user.isVerified) {
      user.isVerified = true;
      await user.save();

      // Send welcome email after verification
      sendWelcomeEmail(user.email, user.name, user.role).catch(() => {});
    }

    return sendSuccess(res, 200, 'OTP verified successfully', { isVerified: user.isVerified });
  } catch (error) {
    next(error);
  }
};

// ─── Resend OTP ───────────────────────────────────────────────────
const resendOTP = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !purpose) {
      return sendError(res, 400, 'Email and purpose are required');
    }

    const validPurposes = ['email_verification', 'password_reset', 'login', 'phone_verification'];
    if (!validPurposes.includes(purpose)) {
      return sendError(res, 400, 'Invalid purpose');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return sendError(res, 404, 'User not found');

    const otp = await generateOTP(user._id, purpose);
    await sendOTPEmail(user.email, user.name, otp, purpose);

    return sendSuccess(res, 200, 'OTP sent successfully. Check your email.');
  } catch (error) {
    next(error);
  }
};

// ─── Forgot Password ──────────────────────────────────────────────
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, 400, 'Email is required');

    const user = await User.findOne({ email: email.toLowerCase() });
    // Always respond success to avoid email enumeration
    if (!user) {
      return sendSuccess(res, 200, 'If this email exists, a password reset OTP has been sent.');
    }

    const otp = await generateOTP(user._id, 'password_reset');
    await sendOTPEmail(user.email, user.name, otp, 'password_reset');

    return sendSuccess(res, 200, 'Password reset OTP sent to your email.');
  } catch (error) {
    next(error);
  }
};

// ─── Reset Password ───────────────────────────────────────────────
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp_code, newPassword } = req.body;

    if (!email || !otp_code || !newPassword) {
      return sendError(res, 400, 'Email, otp_code, and newPassword are required');
    }

    if (newPassword.length < 6) {
      return sendError(res, 400, 'New password must be at least 6 characters');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return sendError(res, 404, 'User not found');

    const isValid = await verifyOTPCode(user._id, otp_code, 'password_reset');
    if (!isValid) return sendError(res, 400, 'Invalid or expired OTP');

    user.password_hash = newPassword; // Will be hashed by pre-save hook
    await user.save();

    return sendSuccess(res, 200, 'Password reset successfully. You can now login.');
  } catch (error) {
    next(error);
  }
};

// ─── Get Current User ─────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, 'User not found');

    return sendSuccess(res, 200, 'User fetched', { user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, verifyOTP, resendOTP, forgotPassword, resetPassword, getMe };
