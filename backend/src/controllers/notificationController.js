const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/response');

// ─── Get My Notifications ─────────────────────────────────────────
const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unread_only } = req.query;
    const filter = { user_id: req.user._id };
    if (unread_only === 'true') filter.is_read = false;

    const skip = (Number(page) - 1) * Number(limit);
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ created_at: -1 }).skip(skip).limit(Number(limit)),
      Notification.countDocuments(filter),
      Notification.countDocuments({ user_id: req.user._id, is_read: false }),
    ]);

    return sendSuccess(res, 200, 'Notifications fetched', { notifications, total, unreadCount });
  } catch (error) {
    next(error);
  }
};

// ─── Mark As Read ─────────────────────────────────────────────────
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { is_read: true },
      { new: true }
    );
    if (!notification) return sendError(res, 404, 'Notification not found');

    return sendSuccess(res, 200, 'Notification marked as read', { notification });
  } catch (error) {
    next(error);
  }
};

// ─── Mark All As Read ─────────────────────────────────────────────
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user_id: req.user._id, is_read: false }, { is_read: true });
    return sendSuccess(res, 200, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

// ─── Delete Notification ──────────────────────────────────────────
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });
    if (!notification) return sendError(res, 404, 'Notification not found');

    return sendSuccess(res, 200, 'Notification deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
