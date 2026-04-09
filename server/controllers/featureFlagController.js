/**
 * Feature Flag Controller
 * Handles feature flag management
 */
const featureFlagService = require('../services/featureFlagService');
const FeatureFlag = require('../models/FeatureFlag');
const auditLogService = require('../services/auditLogService');

/**
 * Get all feature flags (admin only)
 */
exports.getAllFlags = async (req, res) => {
  try {
    const flags = await featureFlagService.getAllFlags();
    
    res.json({
      success: true,
      count: flags.length,
      flags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get feature flags',
      error: error.message
    });
  }
};

/**
 * Get a specific flag
 */
exports.getFlag = async (req, res) => {
  try {
    const flag = await FeatureFlag.findOne({ key: req.params.key });
    
    if (!flag) {
      return res.status(404).json({
        success: false,
        message: 'Feature flag not found'
      });
    }
    
    res.json({
      success: true,
      flag
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get feature flag',
      error: error.message
    });
  }
};

/**
 * Create a new feature flag
 */
exports.createFlag = async (req, res) => {
  try {
    const { key, name, description, enabled, rollout, allowedTiers, allowedUsers, environments, metadata, tags } = req.body;
    
    const flag = await featureFlagService.createFlag({
      key,
      name,
      description,
      enabled,
      rollout,
      allowedTiers,
      allowedUsers,
      environments,
      metadata,
      tags
    }, req.user._id);
    
    // Audit log
    await auditLogService.logFromRequest(req, {
      action: 'feature_flag_create',
      entity: 'feature_flag',
      entityId: flag._id,
      changes: { before: {}, after: flag.toObject() }
    });
    
    res.status(201).json({
      success: true,
      message: 'Feature flag created',
      flag
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create feature flag',
      error: error.message
    });
  }
};

/**
 * Update a feature flag
 */
exports.updateFlag = async (req, res) => {
  try {
    const oldFlag = await FeatureFlag.findOne({ key: req.params.key });
    
    if (!oldFlag) {
      return res.status(404).json({
        success: false,
        message: 'Feature flag not found'
      });
    }
    
    const flag = await featureFlagService.updateFlag(
      req.params.key,
      req.body,
      req.user._id
    );
    
    // Audit log
    await auditLogService.logFromRequest(req, {
      action: 'feature_flag_update',
      entity: 'feature_flag',
      entityId: flag._id,
      changes: { before: oldFlag.toObject(), after: flag.toObject() }
    });
    
    res.json({
      success: true,
      message: 'Feature flag updated',
      flag
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update feature flag',
      error: error.message
    });
  }
};

/**
 * Toggle a feature flag
 */
exports.toggleFlag = async (req, res) => {
  try {
    const oldFlag = await FeatureFlag.findOne({ key: req.params.key });
    
    if (!oldFlag) {
      return res.status(404).json({
        success: false,
        message: 'Feature flag not found'
      });
    }
    
    const flag = await featureFlagService.toggleFlag(req.params.key, req.user._id);
    
    // Audit log
    await auditLogService.logFromRequest(req, {
      action: 'feature_flag_toggle',
      entity: 'feature_flag',
      entityId: flag._id,
      changes: { 
        before: { enabled: oldFlag.enabled },
        after: { enabled: flag.enabled }
      }
    });
    
    res.json({
      success: true,
      message: `Feature flag ${flag.enabled ? 'enabled' : 'disabled'}`,
      flag
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle feature flag',
      error: error.message
    });
  }
};

/**
 * Delete a feature flag
 */
exports.deleteFlag = async (req, res) => {
  try {
    const flag = await FeatureFlag.findOne({ key: req.params.key });
    
    if (!flag) {
      return res.status(404).json({
        success: false,
        message: 'Feature flag not found'
      });
    }
    
    await featureFlagService.deleteFlag(req.params.key);
    
    // Audit log
    await auditLogService.logFromRequest(req, {
      action: 'feature_flag_delete',
      entity: 'feature_flag',
      entityId: flag._id,
      changes: { before: flag.toObject(), after: {} }
    });
    
    res.json({
      success: true,
      message: 'Feature flag deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete feature flag',
      error: error.message
    });
  }
};

/**
 * Get flags for current user
 */
exports.getUserFlags = async (req, res) => {
  try {
    const environment = req.query.env || process.env.NODE_ENV || 'development';
    const flags = await featureFlagService.getUserFlags(req.user, environment);
    
    res.json({
      success: true,
      flags,
      tier: req.user.loyaltyTier || 'free'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user flags',
      error: error.message
    });
  }
};

/**
 * Check if a specific flag is enabled
 */
exports.checkFlag = async (req, res) => {
  try {
    const { key } = req.params;
    const environment = req.query.env || process.env.NODE_ENV || 'development';
    const enabled = await featureFlagService.isEnabled(key, req.user, environment);
    
    res.json({
      success: true,
      key,
      enabled,
      userTier: req.user?.loyaltyTier || 'free'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check flag',
      error: error.message
    });
  }
};
