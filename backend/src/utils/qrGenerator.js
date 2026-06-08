const QRCode = require('qrcode');

/**
 * Generate a QR code as a base64 data URL
 * @param {string} text - The text/URL to encode
 * @returns {Promise<string>} Base64 data URL
 */
const generateQRCode = async (text) => {
  try {
    const qrDataURL = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
    return qrDataURL;
  } catch (error) {
    throw new Error(`QR Code generation failed: ${error.message}`);
  }
};

/**
 * Generate QR code for an order
 * @param {string} orderId - MongoDB Order ID
 * @returns {Promise<string>} Base64 data URL
 */
const generateOrderQR = async (orderId) => {
  const orderURL = `${process.env.CLIENT_URL}/orders/${orderId}`;
  return await generateQRCode(orderURL);
};

module.exports = { generateQRCode, generateOrderQR };
