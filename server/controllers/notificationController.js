/**
 * Notification Controller
 */
const notificationService = require('../services/notificationService');

// @desc    Get user notifications
// @route   GET /api/v1/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await notificationService.getUserNotifications(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread count
// @route   GET /api/v1/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.user.id, req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user.id);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set show reminder
// @route   POST /api/v1/notifications/reminder
// @access  Private
exports.setReminder = async (req, res, next) => {
  try {
    const { showId, remindAt } = req.body;
    const ShowReminder = require('../models/ShowReminder');
    const Show = require('../models/Show');

    // Validate show exists
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Check if reminder already exists
    const existing = await ShowReminder.findOne({ user: req.user.id, show: showId, isActive: true });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Reminder already set for this show'
      });
    }

    const reminder = await ShowReminder.create({
      user: req.user.id,
      show: showId,
      reminderTime: new Date(remindAt),
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Reminder set successfully',
      data: reminder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's reminders
// @route   GET /api/v1/notifications/reminders
// @access  Private
exports.getReminders = async (req, res, next) => {
  try {
    const ShowReminder = require('../models/ShowReminder');
    const reminders = await ShowReminder.find({ user: req.user.id, isActive: true })
      .populate('show', 'date time screen')
      .sort({ reminderTime: 1 });

    res.status(200).json({
      success: true,
      data: reminders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reminder
// @route   DELETE /api/v1/notifications/reminder/:id
// @access  Private
exports.deleteReminder = async (req, res, next) => {
  try {
    const ShowReminder = require('../models/ShowReminder');
    await ShowReminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isActive: false }
    );

    res.status(200).json({
      success: true,
      message: 'Reminder deleted'
    });
  } catch (error) {
    next(error);
  }
};
