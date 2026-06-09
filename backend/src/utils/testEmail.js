/**
 * Test email sending to sivambabynath@gmail.com
 * Run: node src/utils/testEmail.js
 */
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

async function test() {
  console.log('📧 Testing SMTP connection...');
  console.log('   From :', process.env.EMAIL_USER);
  console.log('   Pass  :', process.env.EMAIL_PASS ? '✅ set (' + process.env.EMAIL_PASS.length + ' chars)' : '❌ NOT SET');

  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');
  } catch (err) {
    console.error('❌ SMTP connection FAILED:', err.message);
    console.error('\n🔧 Fix: Go to https://myaccount.google.com/apppasswords');
    console.error('   Generate a new App Password for "Mail" and update EMAIL_PASS in .env\n');
    process.exit(1);
  }

  // Send test OTP email to sivambabynath@gmail.com
  const TEST_TO = 'sivambabynath@gmail.com';
  const TEST_OTP = '123456';

  console.log(`📨 Sending test OTP to ${TEST_TO}...`);
  try {
    const info = await transporter.sendMail({
      from: `"TechVault" <${process.env.EMAIL_USER}>`,
      to: TEST_TO,
      subject: 'TechVault – OTP Test Email',
      html: `
        <div style="font-family:Arial,sans-serif;padding:40px;max-width:500px;">
          <h2 style="color:#6366f1;">🛒 TechVault – OTP Test</h2>
          <p>This is a test email to confirm OTP delivery is working.</p>
          <div style="background:#1f2937;border-radius:12px;padding:28px;text-align:center;margin:20px 0;">
            <p style="color:#9ca3af;font-size:12px;letter-spacing:2px;">TEST OTP</p>
            <div style="color:#fff;font-size:42px;font-weight:800;letter-spacing:14px;">${TEST_OTP}</div>
          </div>
          <p style="color:#6b7280;font-size:13px;">If you received this, OTP emails are working correctly! ✅</p>
        </div>
      `,
      text: `TechVault OTP Test – code: ${TEST_OTP}`,
    });

    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log(`\n👉 Check ${TEST_TO} inbox (and Spam folder).`);
  } catch (err) {
    console.error('❌ Email send FAILED:', err.message);
  }
}

test();
