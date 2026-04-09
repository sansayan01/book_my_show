const rateLimit = require('express-rate-limit');

/**
 * Tier-based Rate Limiter Middleware
 * Implements different rate limits based on user loyalty tier
 */

// Rate limit configurations by tier
const TIER_LIMITS = {
  free: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    requests: 100,
    bookingRequests: 10,
    searchRequests: 50
  },
  bronze: {
    windowMs: 15 * 60 * 1000,
    requests: 200,
    bookingRequests: 20,
    searchRequests: 100
  },
  silver: {
    windowMs: 15 * 60 * 1000,
    requests: 500,
    bookingRequests: 50,
    searchRequests: 200
  },
  gold: {
    windowMs: 15 * 60 * 1000,
    requests: 1000,
    bookingRequests: 100,
    searchRequests: 500
  },
  platinum: {
    windowMs: 15 * 60 * 1000,
    requests: 5000,
    bookingRequests: 500,
    searchRequests: 2000
  },
  admin: {
    windowMs: 15 * 60 * 1000,
    requests: 10000,
    bookingRequests: 1000,
    searchRequests: 5000
  }
};

// Free tier has no access to some endpoints
const TIER_RESTRICTIONS = {
  free: {
    maxMovieResults: 20,
    maxShowResults: 10,
    allowAdvancedFilters: false,
    allowBulkBookings: false
  },
  bronze: {
    maxMovieResults: 50,
    maxShowResults: 25,
    allowAdvancedFilters: false,
    allowBulkBookings: false
  },
  silver: {
    maxMovieResults: 100,
    maxShowResults: 50,
    allowAdvancedFilters: true,
    allowBulkBookings: false
  },
  gold: {
    maxMovieResults: 200,
    maxShowResults: 100,
    allowAdvancedFilters: true,
    allowBulkBookings: true
  },
  platinum: {
    maxMovieResults: 500,
    maxShowResults: 250,
    allowAdvancedFilters: true,
    allowBulkBookings: true
  },
  admin: {
    maxMovieResults: 1000,
    maxShowResults: 500,
    allowAdvancedFilters: true,
    allowBulkBookings: true
  }
};

/**
 * Get rate limit config for a user tier
 */
const getTierLimits = (user) => {
  if (!user) {
    return TIER_LIMITS.free;
  }
  
  if (user.role === 'admin') {
    return TIER_LIMITS.admin;
  }
  
  const tier = user.loyaltyTier || 'free';
  return TIER_LIMITS[tier] || TIER_LIMITS.free;
};

/**
 * Get restrictions for a user tier
 */
const getTierRestrictions = (user) => {
  if (!user) {
    return TIER_RESTRICTIONS.free;
  }
  
  if (user.role === 'admin') {
    return TIER_RESTRICTIONS.admin;
  }
  
  const tier = user.loyaltyTier || 'free';
  return TIER_RESTRICTIONS[tier] || TIER_RESTRICTIONS.free;
};

/**
 * Create a tier-aware rate limiter
 */
const createTierLimiter = (limitType = 'requests') => {
  return async (req, res, next) => {
    const user = req.user;
    const limits = getTierLimits(user);
    const max = limits[limitType] || limits.requests;
    
    // Get user's identifier for rate limiting
    const identifier = user?._id?.toString() || req.ip;
    const key = `tier_limit:${limitType}:${identifier}`;
    
    // Use a simple in-memory store (would use Redis in production)
    if (!global.rateLimitStore) {
      global.rateLimitStore = new Map();
    }
    
    const now = Date.now();
    const windowStart = now - limits.windowMs;
    
    // Clean old entries
    if (!global.rateLimitStore.has(key)) {
      global.rateLimitStore.set(key, []);
    }
    
    const requests = global.rateLimitStore.get(key);
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    if (recentRequests.length >= max) {
      const oldestRequest = Math.min(...recentRequests);
      const retryAfter = Math.ceil((oldestRequest + limits.windowMs - now) / 1000);
      
      return res.status(429).json({
        success: false,
        message: `Rate limit exceeded for ${limitType}. Please try again later.`,
        tier: user?.loyaltyTier || 'free',
        limit: max,
        remaining: 0,
        retryAfter
      });
    }
    
    // Add current request
    recentRequests.push(now);
    global.rateLimitStore.set(key, recentRequests);
    
    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': max,
      'X-RateLimit-Remaining': Math.max(0, max - recentRequests.length),
      'X-RateLimit-Reset': Math.ceil((now + limits.windowMs) / 1000),
      'X-User-Tier': user?.loyaltyTier || 'free'
    });
    
    next();
  };
};

/**
 * General tier-based rate limiter
 */
const tierRateLimiter = createTierLimiter('requests');

/**
 * Booking tier-based rate limiter
 */
const tierBookingLimiter = createTierLimiter('bookingRequests');

/**
 * Search tier-based rate limiter
 */
const tierSearchLimiter = createTierLimiter('searchRequests');

/**
 * Middleware to add tier restrictions to request
 */
const tierRestrictions = (req, res, next) => {
  req.tierRestrictions = getTierRestrictions(req.user);
  req.tierLimits = getTierLimits(req.user);
  next();
};

/**
 * Check if user can access a specific feature based on tier
 */
const canAccessFeature = (user, feature) => {
  const restrictions = getTierRestrictions(user);
  return restrictions[feature] === true || user?.role === 'admin';
};

/**
 * Get user tier info
 */
const getUserTierInfo = (user) => {
  const tier = user?.loyaltyTier || 'free';
  const limits = getTierLimits(user);
  const restrictions = getTierRestrictions(user);
  
  return {
    tier,
    limits,
    restrictions,
    isAdmin: user?.role === 'admin',
    isPremium: ['gold', 'platinum'].includes(tier) || user?.role === 'admin'
  };
};

module.exports = {
  tierRateLimiter,
  tierBookingLimiter,
  tierSearchLimiter,
  tierRestrictions,
  getTierLimits,
  getTierRestrictions,
  canAccessFeature,
  getUserTierInfo,
  TIER_LIMITS,
  TIER_RESTRICTIONS
};
