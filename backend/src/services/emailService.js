const { sendMail } = require('../config/mail');

// ─── Email HTML Templates ─────────────────────────────────────────
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TechVault</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">🛒 TechVault</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Premium Tech Marketplace</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">© 2024 TechVault. All rights reserved.</p>
              <p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">If you did not request this email, please ignore it.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── Send OTP Email ───────────────────────────────────────────────
const sendOTPEmail = async (to, name, otp, purpose) => {
  const purposeLabels = {
    email_verification: 'Email Verification',
    password_reset: 'Password Reset',
    login: 'Login Verification',
    phone_verification: 'Phone Verification',
  };

  const label = purposeLabels[purpose] || 'Verification';

  const content = `
    <h2 style="margin:0 0 8px;color:#1f2937;font-size:22px;">Hello, ${name}! 👋</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
      Your <strong>${label}</strong> code is ready. Enter it below to continue.
    </p>
    <div style="background:#1f2937;border-radius:12px;padding:28px;text-align:center;margin:0 0 24px;">
      <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Your OTP Code</p>
      <div style="color:#ffffff;font-size:42px;font-weight:800;letter-spacing:14px;">${otp}</div>
    </div>
    <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
      ⏰ This code expires in <strong>10 minutes</strong>.<br/>
      🔒 Never share this code with anyone, including TechVault support.
    </p>`;

  return await sendMail({
    to,
    subject: `TechVault – Your ${label} Code: ${otp}`,
    html: baseTemplate(content),
    text: `Your TechVault ${label} OTP is: ${otp}. It expires in 10 minutes.`,
  });
};

// ─── Send Welcome Email ───────────────────────────────────────────
const sendWelcomeEmail = async (to, name, role) => {
  const roleMsg = role === 'seller'
    ? 'You can now list your tech products and reach thousands of buyers!'
    : 'Start exploring thousands of premium tech products!';

  const content = `
    <h2 style="margin:0 0 8px;color:#1f2937;font-size:22px;">Welcome to TechVault, ${name}! 🎉</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
      Your account has been verified successfully. ${roleMsg}
    </p>
    <a href="${process.env.CLIENT_URL}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
      Explore TechVault →
    </a>`;

  return await sendMail({
    to,
    subject: 'Welcome to TechVault! 🎉',
    html: baseTemplate(content),
    text: `Welcome to TechVault, ${name}! Your account is ready. Visit: ${process.env.CLIENT_URL}`,
  });
};

// ─── Send Order Confirmation Email ────────────────────────────────
const sendOrderConfirmationEmail = async (to, name, order) => {
  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;">${item.title}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:14px;text-align:center;">x${item.quantity}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#1f2937;font-size:14px;text-align:right;font-weight:600;">₹${(item.unit_price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>`).join('');

  const content = `
    <h2 style="margin:0 0 8px;color:#1f2937;font-size:22px;">Order Confirmed! ✅</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Hi ${name}, your order has been placed successfully.</p>
    <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#6b7280;font-size:13px;">ORDER ID</p>
      <p style="margin:4px 0 0;color:#1f2937;font-size:14px;font-weight:600;font-family:monospace;">#${order._id}</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${itemRows}
    </table>
    <div style="text-align:right;padding:16px 0;border-top:2px solid #e5e7eb;">
      <p style="margin:0;color:#6b7280;font-size:14px;">Total Amount</p>
      <p style="margin:4px 0 0;color:#6366f1;font-size:24px;font-weight:800;">₹${order.total_amount.toLocaleString('en-IN')}</p>
    </div>
    <a href="${process.env.CLIENT_URL}/orders/${order._id}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;margin-top:16px;">
      Track Your Order →
    </a>`;

  return await sendMail({
    to,
    subject: `TechVault – Order Confirmed #${order._id}`,
    html: baseTemplate(content),
    text: `Hi ${name}, your TechVault order #${order._id} is confirmed. Total: ₹${order.total_amount}`,
  });
};

// ─── Send Order Status Update Email ──────────────────────────────
const sendOrderStatusEmail = async (to, name, order) => {
  const statusConfig = {
    shipped: { emoji: '📦', msg: 'Your order is on its way!', color: '#3b82f6' },
    delivered: { emoji: '✅', msg: 'Your order has been delivered!', color: '#10b981' },
    cancelled: { emoji: '❌', msg: 'Your order has been cancelled.', color: '#ef4444' },
  };

  const config = statusConfig[order.status] || { emoji: '🔄', msg: `Your order status has been updated to ${order.status}.`, color: '#6366f1' };

  const content = `
    <h2 style="margin:0 0 8px;color:#1f2937;font-size:22px;">${config.emoji} Order ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">Hi ${name}, ${config.msg}</p>
    <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#6b7280;font-size:13px;">ORDER ID</p>
      <p style="margin:4px 0 0;color:#1f2937;font-size:14px;font-weight:600;font-family:monospace;">#${order._id}</p>
    </div>
    <a href="${process.env.CLIENT_URL}/orders/${order._id}" style="display:inline-block;background:${config.color};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
      View Order Details →
    </a>`;

  return await sendMail({
    to,
    subject: `TechVault – Order ${order.status.charAt(0).toUpperCase() + order.status.slice(1)} #${order._id}`,
    html: baseTemplate(content),
    text: `Hi ${name}, your TechVault order #${order._id} is now ${order.status}.`,
  });
};

// ─── Send Payment Receipt Email ───────────────────────────────────
const sendPaymentReceiptEmail = async (to, name, payment, order) => {
  const content = `
    <h2 style="margin:0 0 8px;color:#1f2937;font-size:22px;">Payment Successful! 💳</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">Hi ${name}, we've received your payment.</p>
    <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:20px;margin-bottom:20px;">
      <p style="margin:0;color:#065f46;font-size:14px;">Amount Paid</p>
      <p style="margin:4px 0 0;color:#065f46;font-size:28px;font-weight:800;">₹${payment.amount.toLocaleString('en-IN')}</p>
    </div>
    <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">TRANSACTION ID</p>
      <p style="margin:0;color:#1f2937;font-size:13px;font-family:monospace;">${payment.transaction_id || 'N/A'}</p>
    </div>
    <a href="${process.env.CLIENT_URL}/orders/${order._id}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
      View Order →
    </a>`;

  return await sendMail({
    to,
    subject: `TechVault – Payment Receipt ₹${payment.amount}`,
    html: baseTemplate(content),
    text: `Hi ${name}, your payment of ₹${payment.amount} for order #${order._id} was successful.`,
  });
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendPaymentReceiptEmail,
};
