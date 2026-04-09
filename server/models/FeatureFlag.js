const mongoose = require('mongoose');

/**
 * Feature Flag Schema
 * For managing feature toggles in the application
 */
const featureFlagSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Feature flag key is required'],
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Feature flag name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  enabled: {
    type: Boolean,
    default: false
  },
  // Rollout configuration
  rollout: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    description: 'Percentage of users who can access this feature (0-100)'
  },
  // User tiers that can access this feature
  allowedTiers: [{
    type: String,
    enum: ['free', 'bronze', 'silver', 'gold', 'platinum', 'admin']
  }],
  // Specific user IDs that have access
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Environment-specific flags
  environments: {
    development: { type: Boolean, default: true },
    staging: { type: Boolean, default: false },
    production: { type: Boolean, default: false }
  },
  // Feature metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Admin who last modified this flag
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Schedule for automatic enable/disable
  schedule: {
    enableAt: Date,
    disableAt: Date,
    timezone: { type: String, default: 'UTC' }
  },
  // Tags for organization
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Static method to get all enabled flags for a user
featureFlagSchema.statics.getEnabledForUser = async function(user, environment = 'development') {
  const flags = await this.find({ enabled: true });
  
  return flags.filter(flag => {
    // Check environment
    if (!flag.environments[environment]) {
      return false;
    }
    
    // Check schedule
    const now = new Date();
    if (flag.schedule.enableAt && now < flag.schedule.enableAt) {
      return false;
    }
    if (flag.schedule.disableAt && now > flag.schedule.disableAt) {
      return false;
    }
    
    // Check specific user access
    if (flag.allowedUsers.length > 0) {
      return flag.allowedUsers.some(id => id.toString() === user._id.toString());
    }
    
    // Check tier access
    const userTier = user.loyaltyTier || 'free';
    if (flag.allowedTiers.length > 0 && !flag.allowedTiers.includes(userTier)) {
      // Admin always has access
      if (user.role !== 'admin') {
        return false;
      }
    }
    
    // Check rollout percentage
    if (flag.rollout > 0) {
      const hash = hashUserId(user._id.toString(), flag.key);
      if (hash > flag.rollout) {
        return false;
      }
    }
    
    return true;
  });
};

// Simple hash function to determine rollout percentage
function hashUserId(userId, flagKey) {
  let hash = 0;
  const str = userId + flagKey;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 100);
}

module.exports = mongoose.model('FeatureFlag', featureFlagSchema);
