/**
 * Audit Log Service
 * Handles audit logging for admin actions
 */
const AuditLog = require('../models/AuditLog');

class AuditLogService {
  /**
   * Log an admin action
   */
  async log(params) {
    try {
      const {
        action,
        entity,
        entityId,
        performedBy,
        targetUser = null,
        ipAddress = '',
        userAgent = '',
        requestId = '',
        changes = { before: {}, after: {} },
        metadata = {},
        status = 'success',
        errorMessage = ''
      } = params;

      const log = await AuditLog.create({
        action,
        entity,
        entityId,
        performedBy,
        targetUser,
        ipAddress,
        userAgent,
        requestId,
        changes,
        metadata,
        status,
        errorMessage
      });

      return log;
    } catch (error) {
      console.error('Audit log error:', error);
      return null;
    }
  }

  /**
   * Log action with automatic request info extraction
   */
  async logFromRequest(req, params) {
    return this.log({
      ...params,
      performedBy: req.user._id,
      ipAddress: req.ip || req.connection?.remoteAddress || '',
      userAgent: req.headers['user-agent'] || '',
      requestId: req.requestId || ''
    });
  }

  /**
   * Get audit trail for an entity
   */
  async getEntityAuditTrail(entity, entityId, page = 1, limit = 50) {
    return AuditLog.getEntityAuditTrail(entity, entityId, page, limit);
  }

  /**
   * Get user activity
   */
  async getUserActivity(userId, page = 1, limit = 50) {
    return AuditLog.getUserActivity(userId, page, limit);
  }

  /**
   * Get recent admin actions
   */
  async getRecentActions(limit = 100) {
    return AuditLog.getRecentActions(limit);
  }

  /**
   * Search audit logs
   */
  async search(filters, page = 1, limit = 50) {
    return AuditLog.search(filters, page, limit);
  }

  /**
   * Get action statistics for a time period
   */
  async getActionStats(startDate, endDate) {
    const match = { timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    
    const stats = await AuditLog.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          successful: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return stats;
  }

  /**
   * Get daily activity counts
   */
  async getDailyActivity(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return AuditLog.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  /**
   * Get top active admins
   */
  async getTopActiveAdmins(days = 7, limit = 10) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return AuditLog.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: '$performedBy',
          actionCount: { $sum: 1 },
          lastAction: { $max: '$timestamp' }
        }
      },
      { $sort: { actionCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          actionCount: 1,
          lastAction: 1
        }
      }
    ]);
  }
}

module.exports = new AuditLogService();
