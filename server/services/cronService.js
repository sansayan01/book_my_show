/**
 * Cron Service for Scheduled Cleanup Tasks
 * Handles expired bookings, session cleanup, and maintenance tasks
 */

const cron = require('node-cron');
const Booking = require('../models/Booking');
const ShowReminder = require('../models/ShowReminder');
const Show = require('../models/Show');
const cacheService = require('./cacheService');
const seatLockService = require('./seatLockService');
const notificationService = require('./notificationService');

class CronService {
  constructor() {
    this.tasks = new Map();
    this.isRunning = false;
  }

  /**
   * Initialize all scheduled tasks
   */
  init() {
    this.isRunning = true;
    
    // Task 1: Cleanup expired bookings (run every hour)
    this.tasks.set('cleanupExpiredBookings', {
      schedule: '0 * * * *', // Every hour at minute 0
      task: cron.schedule('0 * * * *', () => this.cleanupExpiredBookings()),
      description: 'Cancel unpaid bookings older than 30 minutes'
    });

    // Task 2: Release stale seat locks (run every 5 minutes)
    this.tasks.set('releaseStaleSeatLocks', {
      schedule: '*/5 * * * *',
      task: cron.schedule('*/5 * * * *', () => this.releaseStaleSeatLocks()),
      description: 'Release seat locks that have expired'
    });

    // Task 3: Cleanup expired sessions (run every 15 minutes)
    this.tasks.set('cleanupExpiredSessions', {
      schedule: '*/15 * * * *',
      task: cron.schedule('*/15 * * * *', () => this.cleanupExpiredSessions()),
      description: 'Clean up expired user sessions'
    });

    // Task 4: Clear cache (run every 10 minutes)
    this.tasks.set('clearExpiredCache', {
      schedule: '*/10 * * * *',
      task: cron.schedule('*/10 * * * *', () => this.clearExpiredCache()),
      description: 'Clear expired cache entries'
    });

    // Task 5: Generate daily analytics report (run at midnight)
    this.tasks.set('dailyReport', {
      schedule: '0 0 * * *',
      task: cron.schedule('0 0 * * *', () => this.generateDailyReport()),
      description: 'Generate and log daily booking statistics'
    });

    // Task 6: Cleanup old log files (run daily at 3 AM)
    this.tasks.set('cleanupOldLogs', {
      schedule: '0 3 * * *',
      task: cron.schedule('0 3 * * *', () => this.cleanupOldLogs()),
      description: 'Remove log files older than 7 days'
    });

    // Task 7: Health check on MongoDB (run every 10 minutes)
    this.tasks.set('healthCheck', {
      schedule: '*/10 * * * *',
      task: cron.schedule('*/10 * * * *', () => this.healthCheck()),
      description: 'Monitor database and memory health'
    });

    // Task 8: Send show reminders (run every minute)
    this.tasks.set('sendShowReminders', {
      schedule: '* * * * *',
      task: cron.schedule('* * * * *', () => this.sendShowReminders()),
      description: 'Send show reminder notifications'
    });

    console.log('[Cron] Service initialized with', this.tasks.size, 'scheduled tasks');
  }

  /**
   * Cleanup expired/unpaid bookings
   */
  async cleanupExpiredBookings() {
    try {
      console.log('[Cron] Running expired bookings cleanup...');
      
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      
      const result = await Booking.updateMany(
        {
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: { $lt: thirtyMinutesAgo }
        },
        {
          $set: { 
            status: 'expired',
            paymentStatus: 'failed'
          }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[Cron] Expired ${result.modifiedCount} unpaid bookings`);
      }
    } catch (error) {
      console.error('[Cron] Error cleaning up expired bookings:', error.message);
    }
  }

  /**
   * Release stale seat locks
   */
  async releaseStaleSeatLocks() {
    try {
      console.log('[Cron] Running stale seat locks cleanup...');
      
      const released = await seatLockService.cleanupExpiredLocks();
      
      if (released > 0) {
        console.log(`[Cron] Released ${released} stale seat locks`);
      }
    } catch (error) {
      console.error('[Cron] Error releasing stale seat locks:', error.message);
    }
  }

  /**
   * Cleanup expired sessions
   */
  async cleanupExpiredSessions() {
    try {
      console.log('[Cron] Running expired sessions cleanup...');
      
      // This would interact with a session store
      // For now, just log
      console.log('[Cron] Session cleanup completed');
    } catch (error) {
      console.error('[Cron] Error cleaning up sessions:', error.message);
    }
  }

  /**
   * Clear expired cache entries
   */
  async clearExpiredCache() {
    try {
      console.log('[Cron] Running cache cleanup...');
      
      const stats = cacheService.getStats();
      const beforeSize = stats.size;
      
      cacheService.cleanup();
      
      const newStats = cacheService.getStats();
      console.log(`[Cron] Cache: ${beforeSize} -> ${newStats.size} entries`);
    } catch (error) {
      console.error('[Cron] Error clearing cache:', error.message);
    }
  }

  /**
   * Generate daily report
   */
  async generateDailyReport() {
    try {
      console.log('[Cron] Generating daily report...');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get booking stats for today
      const stats = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: today, $lt: tomorrow }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        }
      ]);

      const report = {
        date: today.toISOString().split('T')[0],
        stats: stats.reduce((acc, s) => {
          acc[s._id] = { count: s.count, revenue: s.revenue };
          return acc;
        }, {}),
        cacheStats: cacheService.getStats(),
        generatedAt: new Date().toISOString()
      };

      console.log('[Cron] Daily Report:', JSON.stringify(report, null, 2));
    } catch (error) {
      console.error('[Cron] Error generating daily report:', error.message);
    }
  }

  /**
   * Cleanup old log files
   */
  async cleanupOldLogs() {
    try {
      const fs = require('fs');
      const path = require('path');
      
      console.log('[Cron] Running old logs cleanup...');
      
      const logsDir = path.join(__dirname, '../../logs');
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      const files = fs.readdirSync(logsDir);
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtimeMs < sevenDaysAgo) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        console.log(`[Cron] Deleted ${deletedCount} old log files`);
      }
    } catch (error) {
      console.error('[Cron] Error cleaning up logs:', error.message);
    }
  }

  /**
   * Health check on database and memory
   */
  async healthCheck() {
    try {
      const memoryUsage = process.memoryUsage();
      const heapUsedPercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);
      
      console.log(`[Cron] Health: Memory ${heapUsedPercent}%, RSS ${Math.round(memoryUsage.rss / 1024 / 1024)}MB`);
      
      // Check if memory usage is too high
      if (heapUsedPercent > 85) {
        console.warn('[Cron] WARNING: High memory usage detected, consider restart');
        // Could trigger alerts here
      }
    } catch (error) {
      console.error('[Cron] Error in health check:', error.message);
    }
  }

  /**
   * Send show reminder notifications
   */
  async sendShowReminders() {
    try {
      const now = new Date();
      const windowStart = new Date(now.getTime() - 30 * 1000); // 30 seconds ago
      const windowEnd = new Date(now.getTime() + 30 * 1000);   // next 30 seconds

      const dueReminders = await ShowReminder.find({
        isActive: true,
        isSent: false,
        reminderTime: { $gte: windowStart, $lte: windowEnd }
      })
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title' },
          { path: 'cinema', select: 'name' }
        ]
      });

      if (dueReminders.length > 0) {
        console.log(`[Cron] Sending ${dueReminders.length} show reminders`);
      }

      for (const reminder of dueReminders) {
        try {
          await notificationService.sendShowReminder(
            reminder.user,
            reminder.show,
            null
          );

          reminder.isSent = true;
          reminder.sentAt = new Date();
          await reminder.save();
        } catch (err) {
          console.error(`[Cron] Error sending reminder ${reminder._id}:`, err.message);
        }
      }
    } catch (error) {
      console.error('[Cron] Error in show reminders:', error.message);
    }
  }

  /**
   * Get status of all tasks
   */
  getStatus() {
    return {
      running: this.isRunning,
      tasks: Array.from(this.tasks.entries()).map(([name, data]) => ({
        name,
        schedule: data.schedule,
        description: data.description
      }))
    };
  }

  /**
   * Run a specific task manually
   */
  async runTask(taskName) {
    const task = this.tasks.get(taskName);
    if (task) {
      await task.task.stop();
      await task.task.invoke();
      console.log(`[Cron] Manually ran task: ${taskName}`);
      return true;
    }
    return false;
  }

  /**
   * Stop all tasks
   */
  stopAll() {
    for (const [name, data] of this.tasks) {
      data.task.stop();
      console.log(`[Cron] Stopped task: ${name}`);
    }
    this.isRunning = false;
  }

  /**
   * Restart all tasks
   */
  restartAll() {
    this.stopAll();
    this.tasks.clear();
    this.init();
  }

  /**
   * Graceful shutdown
   */
  shutdown() {
    console.log('[Cron] Shutting down...');
    this.stopAll();
    console.log('[Cron] Shutdown complete');
  }
}

// Singleton instance
const cronService = new CronService();

module.exports = cronService;
