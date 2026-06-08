const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// All notification routes require authentication
router.use(protect);

// GET /api/notifications
router.get('/', getNotifications);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', markAsRead);

// PATCH /api/notifications/read-all
router.patch('/read-all', markAllAsRead);

// DELETE /api/notifications/:id
router.delete('/:id', deleteNotification);

module.exports = router;
