/**
 * Audit Log Controller
 * Handles audit log retrieval and management
 */
const auditLogService = require('../services/auditLogService');

/**
 * Get recent audit logs (admin only)
 */
exports.getRecentLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const logs = await auditLogService.getRecentActions(limit);
    
    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get audit logs',
      error: error.message
    });
  }
};

/**
 * Get audit trail for an entity
 */
exports.getEntityAuditTrail = async (req, res) => {
  try {
    const { entity, entityId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    const result = await auditLogService.getEntityAuditTrail(entity, entityId, page, limit);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get audit trail',
      error: error.message
    });
  }
};

/**
 * Get current user's activity (admin only)
 */
exports.getMyActivity = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    const result = await auditLogService.getUserActivity(req.user._id, page, limit);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get activity',
      error: error.message
    });
  }
};

/**
 * Search audit logs
 */
exports.searchLogs = async (req, res) => {
  try {
    const {
      action,
      entity,
      entityId,
      performedBy,
      status,
      startDate,
      endDate
    } = req.query;
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    const filters = {};
    if (action) filters.action = action;
    if (entity) filters.entity = entity;
    if (entityId) filters.entityId = entityId;
    if (performedBy) filters.performedBy = performedBy;
    if (status) filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    
    const result = await auditLogService.search(filters, page, limit);
    
    res.json({
      success: true,
      ...result,
      filters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search audit logs',
      error: error.message
    });
  }
};

/**
 * Get action statistics
 */
exports.getActionStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const stats = await auditLogService.getActionStats(startDate, endDate);
    
    res.json({
      success: true,
      period: { startDate, endDate, days },
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get action stats',
      error: error.message
    });
  }
};

/**
 * Get daily activity counts
 */
exports.getDailyActivity = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const activity = await auditLogService.getDailyActivity(days);
    
    res.json({
      success: true,
      days,
      activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get daily activity',
      error: error.message
    });
  }
};

/**
 * Get top active admins
 */
exports.getTopActiveAdmins = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const limit = parseInt(req.query.limit) || 10;
    
    const admins = await auditLogService.getTopActiveAdmins(days, limit);
    
    res.json({
      success: true,
      period: `${days} days`,
      admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get top admins',
      error: error.message
    });
  }
};
