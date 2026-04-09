const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  setReminder,
  getReminders,
  deleteReminder
} = require('../controllers/notificationController');
const { validate, schemas } = require('../validators');

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.post('/reminder', protect, validate(schemas.setReminder), setReminder);
router.get('/reminders', protect, getReminders);
router.delete('/reminder/:id', protect, deleteReminder);

module.exports = router;
