const { validationResult } = require('express-validator');

/**
 * Middleware to validate request using express-validator results
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Input sanitization middleware
 * Sanitize body, query, and params to prevent injection attacks
 */
exports.sanitize = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      // Remove potentially dangerous characters
      return value.replace(/[<>]/g, '');
    }
    return value;
  };

  const sanitizeObject = (obj) => {
    if (!obj) return;
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      } else {
        obj[key] = sanitizeValue(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

/**
 * Request size validation
 */
exports.validateRequestSize = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxBytes = maxSize === '10mb' ? 10 * 1024 * 1024 : parseInt(maxSize);
    
    if (contentLength > maxBytes) {
      return res.status(413).json({
        success: false,
        message: 'Request body too large'
      });
    }
    next();
  };
};