/**
 * Feature Flag Service
 * Manages feature toggles for the application
 */
const FeatureFlag = require('../models/FeatureFlag');

class FeatureFlagService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 60000; // 1 minute
  }

  /**
   * Check if a feature is enabled for a user
   */
  async isEnabled(key, user, environment = process.env.NODE_ENV || 'development') {
    // Check cache first
    const cacheKey = `${key}:${user?._id || 'anonymous'}:${environment}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.value;
    }

    try {
      const flag = await FeatureFlag.findOne({ key });
      
      if (!flag) {
        // Flag doesn't exist, assume disabled
        return false;
      }

      // If flag is globally disabled
      if (!flag.enabled) {
        this.setCache(cacheKey, false);
        return false;
      }

      // Check environment
      if (!flag.environments[environment]) {
        this.setCache(cacheKey, false);
        return false;
      }

      // Check schedule
      const now = new Date();
      if (flag.schedule.enableAt && now < flag.schedule.enableAt) {
        this.setCache(cacheKey, false);
        return false;
      }
      if (flag.schedule.disableAt && now > flag.schedule.disableAt) {
        this.setCache(cacheKey, false);
        return false;
      }

      // Check specific user access (bypasses tier and rollout)
      if (flag.allowedUsers.length > 0 && user?._id) {
        const hasAccess = flag.allowedUsers.some(
          id => id.toString() === user._id.toString()
        );
        this.setCache(cacheKey, hasAccess);
        return hasAccess;
      }

      // Check admin bypass
      if (user?.role === 'admin') {
        this.setCache(cacheKey, true);
        return true;
      }

      // Check tier access
      const userTier = user?.loyaltyTier || 'free';
      if (flag.allowedTiers.length > 0 && !flag.allowedTiers.includes(userTier)) {
        this.setCache(cacheKey, false);
        return false;
      }

      // Check rollout percentage
      if (flag.rollout > 0 && user?._id) {
        const hash = this.hashUserId(user._id.toString(), key);
        const inRollout = hash < flag.rollout;
        this.setCache(cacheKey, inRollout);
        return inRollout;
      }

      this.setCache(cacheKey, true);
      return true;
    } catch (error) {
      console.error(`Feature flag check error for ${key}:`, error);
      return false;
    }
  }

  /**
   * Hash function for consistent rollout percentage
   */
  hashUserId(userId, flagKey) {
    let hash = 0;
    const str = userId + flagKey;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash % 100);
  }

  /**
   * Set cache value
   */
  setCache(key, value) {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get all flags for a user
   */
  async getUserFlags(user, environment = process.env.NODE_ENV || 'development') {
    try {
      const flags = await FeatureFlag.find({ enabled: true });
      const result = {};

      for (const flag of flags) {
        result[flag.key] = await this.isEnabled(flag.key, user, environment);
      }

      return result;
    } catch (error) {
      console.error('Error getting user flags:', error);
      return {};
    }
  }

  /**
   * Create a new feature flag
   */
  async createFlag(data, modifiedBy) {
    try {
      const flag = await FeatureFlag.create({
        ...data,
        modifiedBy
      });
      this.clearCache();
      return flag;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a feature flag
   */
  async updateFlag(key, data, modifiedBy) {
    try {
      const flag = await FeatureFlag.findOneAndUpdate(
        { key },
        { ...data, modifiedBy },
        { new: true, runValidators: true }
      );
      this.clearCache();
      return flag;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle a feature flag
   */
  async toggleFlag(key, modifiedBy) {
    try {
      const flag = await FeatureFlag.findOne({ key });
      if (!flag) {
        return null;
      }
      
      flag.enabled = !flag.enabled;
      flag.modifiedBy = modifiedBy;
      await flag.save();
      this.clearCache();
      return flag;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a feature flag
   */
  async deleteFlag(key) {
    try {
      const result = await FeatureFlag.deleteOne({ key });
      this.clearCache();
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all feature flags (admin)
   */
  async getAllFlags() {
    return FeatureFlag.find().sort({ key: 1 });
  }

  /**
   * Initialize default flags if they don't exist
   */
  async initializeDefaults() {
    const defaultFlags = [
      {
        key: 'new_recommendation_engine',
        name: 'New Recommendation Engine',
        description: 'Enable content-based movie recommendations',
        enabled: true,
        rollout: 50,
        environments: { development: true, staging: true, production: true },
        tags: ['recommendations', 'ai']
      },
      {
        key: 'sse_notifications',
        name: 'Server-Sent Events Notifications',
        description: 'Enable real-time SSE notifications',
        enabled: true,
        rollout: 100,
        environments: { development: true, staging: true, production: true },
        tags: ['notifications', 'realtime']
      },
      {
        key: 'cinema_preference_learning',
        name: 'Cinema Preference Learning',
        description: 'Learn user cinema preferences over time',
        enabled: true,
        rollout: 100,
        environments: { development: true, staging: true, production: true },
        tags: ['recommendations', 'ml']
      },
      {
        key: 'popular_searches',
        name: 'Popular Searches Cache',
        description: 'Show trending/popular searches',
        enabled: true,
        rollout: 100,
        environments: { development: true, staging: true, production: true },
        tags: ['search', 'trending']
      },
      {
        key: 'background_jobs',
        name: 'Background Job Processing',
        description: 'Enable background job queue for async tasks',
        enabled: true,
        rollout: 100,
        environments: { development: true, staging: true, production: true },
        tags: ['performance', 'async']
      }
    ];

    for (const flag of defaultFlags) {
      try {
        await FeatureFlag.findOneAndUpdate(
          { key: flag.key },
          flag,
          { upsert: true, new: true }
        );
      } catch (error) {
        console.error(`Error initializing flag ${flag.key}:`, error);
      }
    }
  }
}

module.exports = new FeatureFlagService();
