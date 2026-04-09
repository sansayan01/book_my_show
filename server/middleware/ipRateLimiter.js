/**
 * IP-Based Rate Limiting Middleware
 * Advanced rate limiting based on client IP with different tiers
 */

const rateLimit = require('express-rate-limit');
const ApiStats = require('../services/apiAnalyticsService');

// IP-based tier configuration
const IP_TIERS = {
  TRUSTED: { windowMs: 60000, max: 500, message: 'High usage detected' },
  STANDARD: { windowMs: 60000, max: 100, message: 'Too many requests' },
  LIMITED: { windowMs: 60000, max: 20, message: 'Rate limit exceeded' },
  BANNED: { windowMs: 3600000, max: 0, message: 'IP temporarily banned' }
};

// Store for IP tracking
const ipTracker = new Map();

/**
 * Determine IP tier based on history
 */
const getIPTier = (ip) => {
  const stats = ipTracker.get(ip);
  if (!stats) return 'STANDARD';
  
  // Promote to TRUSTED if consistently good behavior
  if (stats.requests > 1000 && stats.errorRate < 1) return 'TRUSTED';
  
  // Demote to LIMITED if high error rate
  if (stats.errorRate > 10) return 'LIMITED';
  
  // Ban if consistently abusing
  if (stats.violations > 5) return 'BANNED';
  
  return 'STANDARD';
};

/**
 * Track IP activity
 */
const trackIP = (ip, success = true) => {
  const now = Date.now();
  let stats = ipTracker.get(ip);
  
  if (!stats) {
    stats = {
      requests: 0,
      errors: 0,
      violations: 0,
      firstSeen: now,
      lastSeen: now
    };
  }
  
  stats.requests++;
  stats.lastSeen = now;
  if (!success) {
    stats.errors++;
    stats.violations++;
  }
  
  // Calculate error rate
  stats.errorRate = (stats.errors / stats.requests) * 100;
  
  ipTracker.set(ip, stats);
  
  // Cleanup old entries (1 hour)
  if (now - stats.lastSeen > 3600000) {
    ipTracker.delete(ip);
  }
};

/**
 * Get IP stats
 */
const getIPStats = (ip) => {
  return ipTracker.get(ip) || null;
};

/**
 * Get all tracked IPs
 */
const getAllIPStats = () => {
  return Array.from(ipTracker.entries()).map(([ip, stats]) => ({
    ip,
    ...stats,
    tier: getIPTier(ip)
  }));
};

/**
 * IP-based rate limiter middleware
 */
const ipRateLimiter = (options = {}) => {
  const { tier = 'STANDARD' } = options;
  const tierConfig = IP_TIERS[tier] || IP_TIERS.STANDARD;
  
  return rateLimit({
    windowMs: tierConfig.windowMs,
    max: tierConfig.max,
    message: {
      success: false,
      message: tierConfig.message,
      tier,
      retryAfter: Math.ceil(tierConfig.windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.ip || req.connection.remoteAddress || 'unknown';
    },
    handler: (req, res) => {
      trackIP(req.ip, false);
      res.status(429).json({
        success: false,
        message: tierConfig.message,
        tier,
        ip: req.ip,
        retryAfter: Math.ceil(tierConfig.windowMs / 1000)
      });
    },
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/api/v1/health' || req.path === '/health';
    }
  });
};

/**
 * Dynamic rate limiter based on IP tier
 */
const dynamicRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const tier = getIPTier(ip);
  const limiter = ipRateLimiter({ tier });
  
  limiter(req, res, next);
};

/**
 * Create rate limiter for specific routes
 */
const createRouteRateLimiter = (route, options = {}) => {
  const {
    windowMs = 60000,
    max = 100,
    message = 'Too many requests to this endpoint'
  } = options;
  
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      route,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return `${req.ip}:${route}`;
    }
  });
};

/**
 * White list certain IPs from rate limiting
 */
const whitelistIPs = (ips) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    if (ips.includes(ip)) {
      return next();
    }
    return dynamicRateLimiter(req, res, next);
  };
};

/**
 * Blacklist certain IPs
 */
const blacklistIPs = (ips) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    if (ips.includes(ip)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    return next();
  };
};

module.exports = {
  ipRateLimiter,
  dynamicRateLimiter,
  createRouteRateLimiter,
  whitelistIPs,
  blacklistIPs,
  getIPTier,
  trackIP,
  getIPStats,
  getAllIPStats,
  IP_TIERS
};
