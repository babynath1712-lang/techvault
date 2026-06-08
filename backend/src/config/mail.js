const nodemailer = require('nodemailer');

// ─── Create Reusable Transporter ─────────────────────────────────
let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

// ─── Verify connection on startup ────────────────────────────────
const verifyMailConnection = async () => {
  try {
    const t = getTransporter();
    await t.verify();
    console.log('✅ Mail server connected successfully');
  } catch (error) {
    console.warn(`⚠️  Mail server not available: ${error.message}`);
    console.warn('   Email features will be disabled until SMTP is configured.');
  }
};

// ─── Send Mail Helper ─────────────────────────────────────────────
const sendMail = async ({ to, subject, html, text }) => {
  try {
    const t = getTransporter();
    const info = await t.sendMail({
      from: `"TechVault" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email send failed to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = { getTransporter, verifyMailConnection, sendMail };
