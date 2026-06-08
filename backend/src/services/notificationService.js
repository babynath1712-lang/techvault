const Notification = require('../models/Notification');

/**
 * Create a new notification for a user
 * @param {string} userId
 * @param {string} type
 * @param {string} title
 * @param {string} message
 * @param {string|null} referenceId
 * @param {string|null} referenceType
 */
const createNotification = async (userId, type, title, message, referenceId = null, referenceType = null) => {
  try {
    await Notification.create({
      user_id: userId,
      type,
      title,
      message,
      reference_id: referenceId,
      reference_type: referenceType,
    });
  } catch (error) {
    // Non-critical — log but don't throw
    console.error(`Failed to create notification: ${error.message}`);
  }
};

/**
 * Get unread notification count for a user
 * @param {string} userId
 * @returns {number}
 */
const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ user_id: userId, is_read: false });
};

module.exports = { createNotification, getUnreadCount };
