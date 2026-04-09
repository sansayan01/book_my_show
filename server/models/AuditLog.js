const mongoose = require('mongoose');

/**
 * Audit Log Schema
 * Tracks all admin actions for compliance and security
 */
const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      // User management
      'user_create', 'user_update', 'user_delete', 'user_deactivate', 'user_activate',
      'user_role_change', 'user_tier_change', 'user_password_reset',
      // Movie management
      'movie_create', 'movie_update', 'movie_delete', 'movie_publish', 'movie_unpublish',
      // Cinema management
      'cinema_create', 'cinema_update', 'cinema_delete', 'cinema_featured',
      // Show management
      'show_create', 'show_update', 'show_delete', 'show_cancel',
      // Booking management
      'booking_cancel_admin', 'booking_refund',
      // System
      'feature_flag_create', 'feature_flag_update', 'feature_flag_delete', 'feature_flag_toggle',
      'settings_update', 'cache_clear', 'data_export',
      // Auth
      'login', 'logout', 'login_failed',
      // Financial
      'payment_process', 'payment_refund', 'wallet_adjustment',
      // Loyalty
      'points_adjustment', 'tier_upgrade', 'tier_downgrade'
    ],
    index: true
  },
  entity: {
    type: String,
    required: true,
    enum: ['user', 'movie', 'cinema', 'show', 'booking', 'feature_flag', 'settings', 'payment', 'wallet', 'loyalty', 'auth'],
    index: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  // Who performed the action
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Target of the action (if different from performedBy)
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // IP address of the request
  ipAddress: {
    type: String,
    default: ''
  },
  // User agent
  userAgent: {
    type: String,
    default: ''
  },
  // Request ID for tracing
  requestId: {
    type: String,
    index: true
  },
  // Action details
  changes: {
    before: { type: mongoose.Schema.Types.Mixed, default: {} },
    after: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Status
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success',
    index: true
  },
  // Error message if failed
  errorMessage: {
    type: String,
    default: ''
  },
  // Timestamp (separate from createdAt for scheduled actions)
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for common queries
auditLogSchema.index({ performedBy: 1, timestamp: -1 });
auditLogSchema.index({ entity: 1, entityId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 }); // For time-based queries

// Static method to log an admin action
auditLogSchema.statics.log = async function(data) {
  try {
    const log = await this.create({
      ...data,
      timestamp: data.timestamp || new Date()
    });
    return log;
  } catch (error) {
    console.error('Audit log error:', error);
    // Don't throw - audit logging should not break main operations
    return null;
  }
};

// Static method to get audit trail for an entity
auditLogSchema.statics.getEntityAuditTrail = async function(entity, entityId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  const [logs, total] = await Promise.all([
    this.find({ entity, entityId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('performedBy', 'name email role'),
    this.countDocuments({ entity, entityId })
  ]);

  return {
    logs,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
};

// Static method to get user activity
auditLogSchema.statics.getUserActivity = async function(userId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  const [logs, total] = await Promise.all([
    this.find({ performedBy: userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit),
    this.countDocuments({ performedBy: userId })
  ]);

  return {
    logs,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
};

// Static method to get recent admin actions
auditLogSchema.statics.getRecentActions = async function(limit = 100) {
  return this.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('performedBy', 'name email role');
};

// Static method to search audit logs
auditLogSchema.statics.search = async function(filters, page = 1, limit = 50) {
  const query = {};
  
  if (filters.action) query.action = filters.action;
  if (filters.entity) query.entity = filters.entity;
  if (filters.entityId) query.entityId = filters.entityId;
  if (filters.performedBy) query.performedBy = filters.performedBy;
  if (filters.targetUser) query.targetUser = filters.targetUser;
  if (filters.status) query.status = filters.status;
  if (filters.startDate || filters.endDate) {
    query.timestamp = {};
    if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
    if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
  }

  const skip = (page - 1) * limit;
  
  const [logs, total] = await Promise.all([
    this.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('performedBy', 'name email role')
      .populate('targetUser', 'name email'),
    this.countDocuments(query)
  ]);

  return {
    logs,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
