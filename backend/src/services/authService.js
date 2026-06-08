const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { generateOTP } = require('./otpService');
const { sendOTPEmail } = require('./emailService');

/**
 * Register a new user
 */
const registerUser = async ({ name, email, password, role, phone }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');

  const user = await User.create({ name, email, password_hash: password, role, phone });

  const otp = await generateOTP(user._id, 'email_verification');
  await sendOTPEmail(user.email, user.name, otp, 'email_verification');

  return { user, token: generateToken(user._id, user.role) };
};

/**
 * Login an existing user
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password_hash');
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  if (!user.isActive) throw new Error('Account deactivated');

  return { user: user.toJSON(), token: generateToken(user._id, user.role) };
};

module.exports = { registerUser, loginUser };
