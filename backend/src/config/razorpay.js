const Razorpay = require('razorpay');

// ─── Singleton Razorpay Instance ──────────────────────────────────
let razorpayInstance;

const getRazorpay = () => {
  if (razorpayInstance) return razorpayInstance;

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
  }

  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  return razorpayInstance;
};

// ─── Create Razorpay Order ────────────────────────────────────────
const createRazorpayOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) => {
  const razorpay = getRazorpay();

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency,
    receipt,
    notes,
  });

  return order;
};

// ─── Fetch Razorpay Order ─────────────────────────────────────────
const fetchRazorpayOrder = async (razorpayOrderId) => {
  const razorpay = getRazorpay();
  return await razorpay.orders.fetch(razorpayOrderId);
};

// ─── Fetch Razorpay Payment ───────────────────────────────────────
const fetchRazorpayPayment = async (razorpayPaymentId) => {
  const razorpay = getRazorpay();
  return await razorpay.payments.fetch(razorpayPaymentId);
};

// ─── Initiate Refund ──────────────────────────────────────────────
const initiateRefund = async (razorpayPaymentId, amount) => {
  const razorpay = getRazorpay();
  return await razorpay.payments.refund(razorpayPaymentId, {
    amount: Math.round(amount * 100), // Convert to paise
  });
};

// ─── Create UPI Order (via Razorpay UPI Intent) ───────────────────
const createUPIOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) => {
  const razorpay = getRazorpay();

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt,
    notes: {
      ...notes,
      upi_id: process.env.UPI_ID || 'sivambabynath@okicici',
    },
  });

  return order;
};

// ─── Get UPI Details ──────────────────────────────────────────────
const getUPIDetails = () => ({
  upi_id: process.env.UPI_ID || 'sivambabynath@okicici',
  name: process.env.UPI_NAME || 'Baby nath',
});

module.exports = {
  getRazorpay,
  createRazorpayOrder,
  createUPIOrder,
  fetchRazorpayOrder,
  fetchRazorpayPayment,
  initiateRefund,
  getUPIDetails,
};
