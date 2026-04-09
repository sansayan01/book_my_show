/**
 * API Analytics Middleware
 * Tracks request/response metrics for analytics
 */

const apiAnalyticsService = require('../services/apiAnalyticsService');

/**
 * Middleware to track API request/response metrics
 */
const apiAnalytics = (req, res, next) => {
  const startTime = Date.now();
  
  // Capture response finish
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    apiAnalyticsService.recordRequest(req, res, responseTime);
  });
  
  // Capture response errors
  res.on('error', (err) => {
    apiAnalyticsService.recordError(req, err);
  });
  
  next();
};

/**
 * Error tracking middleware
 */
const errorTracker = (err, req, res, next) => {
  apiAnalyticsService.recordError(req, err);
  next(err);
};

module.exports = { apiAnalytics, errorTracker, apiAnalyticsService };
