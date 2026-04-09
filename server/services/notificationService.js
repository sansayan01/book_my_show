/**
 * Notification Service
 * Handles in-app, email, and WebSocket notifications
 */
const Notification = require('../models/Notification');
const wsManager = require('./websocketManager');

class NotificationService {
  /**
   * Create and send a notification
   */
  async send(userId, type, title, message, data = {}, options = {}) {
    try {
      const notification = await Notification.create({
        user: userId,
        type,
        title,
        message,
        data,
        channel: options.channel || 'in_app',
        priority: options.priority || 'normal'
      });

      // Send real-time notification via WebSocket
      this.sendRealTime(userId, notification);

      return notification;
    } catch (error) {
      console.error('Notification error:', error);
      return null;
    }
  }

  /**
   * Send real-time notification via WebSocket
   */
  sendRealTime(userId, notification) {
    try {
      wsManager.sendToUser(userId.toString(), {
        type: 'notification',
        notification: {
          _id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          createdAt: notification.createdAt
        }
      });
    } catch (error) {
      console.error('WebSocket notification error:', error);
    }
  }

  /**
   * Broadcast to all connected clients
   */
  broadcast(message) {
    try {
      wsManager.broadcast(message);
    } catch (error) {
      console.error('WebSocket broadcast error:', error);
    }
  }

  /**
   * Send booking confirmation notification
   */
  async sendBookingConfirmation(userId, booking) {
    return this.send(userId, 'booking_confirmed', 'Booking Confirmed!', 
      `Your tickets for ${booking.movie?.title || 'the movie'} have been confirmed. Booking ID: ${booking.ticketCode || booking._id}`,
      { bookingId: booking._id, ticketCode: booking.ticketCode },
      { priority: 'high' }
    );
  }

  /**
   * Send show reminder notification
   */
  async sendShowReminder(userId, show, booking) {
    return this.send(userId, 'show_reminder', 'Show Reminder ⏰',
      `Your show for ${show.movie?.title || 'the movie'} starts in 30 minutes at ${show.cinema?.name || 'the cinema'}. Enjoy the show!`,
      { showId: show._id, bookingId: booking?._id },
      { priority: 'high' }
    );
  }

  /**
   * Send referral reward notification
   */
  async sendReferralReward(userId, amount, referredUser) {
    return this.send(userId, 'referral_reward', 'Referral Reward! 🎉',
      `You earned ₹${amount} for referring ${referredUser}. Keep sharing to earn more!`,
      { amount },
      { priority: 'normal' }
    );
  }

  /**
   * Send loyalty tier upgrade notification
   */
  async sendLoyaltyUpgrade(userId, newTier) {
    return this.send(userId, 'loyalty_tier_upgrade', `Welcome to ${newTier} Tier! 🌟`,
      `Congratulations! You've been upgraded to ${newTier} tier. Enjoy exclusive benefits!`,
      { tier: newTier },
      { priority: 'high' }
    );
  }

  /**
   * Send loyalty points earned notification
   */
  async sendLoyaltyPointsEarned(userId, points, totalPoints) {
    return this.send(userId, 'loyalty_points_earned', `+${points} Loyalty Points!`,
      `You earned ${points} loyalty points. Total: ${totalPoints} points.`,
      { points, totalPoints },
      { priority: 'low' }
    );
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId) {
    return Notification.countDocuments({ user: userId, isRead: false });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId, notificationId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    return Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ user: userId })
    ]);

    return {
      notifications,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };
  }
}

module.exports = new NotificationService();
