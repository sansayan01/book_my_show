/**
 * Request Body Size Limit Middleware
 * Enforces request body size limits per route
 */

const express = require('express');

/**
 * Default body size limits by route type
 */
const DEFAULT_LIMITS = {
  default: '1mb',
  json: '10mb',
  raw: '50mb',
  multipart: '100mb',
  text: '5mb'
};

/**
 * Route-specific body limits
 */
const ROUTE_LIMITS = {
  '/api/v1/bookings': '5mb',
  '/api/v1/payments': '1mb',
  '/api/v1/movies': '10mb',
  '/api/v1/admin/import': '50mb',
  '/api/v1/export': '10mb'
};

/**
 * Create body size limit middleware
 */
const bodySizeLimit = (limit = '1mb') => {
  return express.json({ limit, strict: true });
};

/**
 * Parse human-readable size to bytes
 */
const parseSize = (size) => {
  if (typeof size === 'number') return size;
  
  const units = {
    b: 1,
    bytes: 1,
    kb: 1024,
    k: 1024,
    mb: 1024 * 1024,
    m: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
    g: 1024 * 1024 * 1024
  };
  
  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)?$/);
  if (!match) return 1024 * 1024; // Default 1mb
  
  const value = parseFloat(match[1]);
  const unit = match[2] || 'b';
  
  return value * (units[unit] || 1);
};

/**
 * Validate request body size
 */
const validateBodySize = (req, res, next) => {
  const contentLength = req.headers['content-length'];
  
  if (!contentLength) {
    return next();
  }
  
  const maxSize = parseSize(DEFAULT_LIMITS.default);
  
  if (parseInt(contentLength) > maxSize) {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large',
      error: 'Body size exceeds the allowed limit',
      maxSize: DEFAULT_LIMITS.default,
      received: `${Math.round(parseInt(contentLength) / 1024 / 1024)}mb`
    });
  }
  
  next();
};

/**
 * Dynamic body size limit based on route
 */
const dynamicBodyLimit = (req, res, next) => {
  // Find matching route limit
  const path = req.path;
  let limit = DEFAULT_LIMITS.default;
  
  for (const [route, routeLimit] of Object.entries(ROUTE_LIMITS)) {
    if (path.startsWith(route)) {
      limit = routeLimit;
      break;
    }
  }
  
  // Apply the limit
  express.json({ limit })(req, res, (err) => {
    if (err) {
      return res.status(413).json({
        success: false,
        message: 'Request entity too large',
        error: err.message,
        limit
      });
    }
    next();
  });
};

/**
 * Create route-specific limit middleware
 */
const createRouteBodyLimit = (route, limit = '10mb') => {
  return (req, res, next) => {
    if (req.path.startsWith(route)) {
      express.json({ limit })(req, res, next);
    } else {
      next();
    }
  };
};

/**
 * Multipart file upload limit
 */
const fileUploadLimit = (limit = '100mb') => {
  return express.raw({ 
    limit,
    type: 'multipart/form-data'
  });
};

/**
 * XML body limit
 */
const xmlBodyLimit = (limit = '5mb') => {
  return express.text({ 
    limit,
    type: 'application/xml'
  });
};

module.exports = {
  bodySizeLimit,
  validateBodySize,
  dynamicBodyLimit,
  createRouteBodyLimit,
  fileUploadLimit,
  xmlBodyLimit,
  DEFAULT_LIMITS,
  ROUTE_LIMITS,
  parseSize
};
