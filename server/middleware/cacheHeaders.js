/**
 * Cache Headers Middleware
 * Implements ETag and Last-Modified caching strategy
 */

const crypto = require('crypto');

/**
 * Generate ETag from content
 */
const generateETag = (content) => {
  if (!content) return null;
  const hash = crypto.createHash('md5').update(JSON.stringify(content)).digest('hex');
  return `"${hash}"`;
};

/**
 * Cache middleware factory
 * Adds ETag and Last-Modified headers for cacheable responses
 */
const cacheMiddleware = (options = {}) => {
  const {
    etag = true,
    lastModified = true,
    maxAge = 300 // 5 minutes default
  } = options;

  return (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to add caching headers
    res.json = (body) => {
      if (body && body.success !== false) { // Don't cache error responses
        // Add ETag
        if (etag) {
          const etag = generateETag(body);
          res.set('ETag', etag);
          
          // Check If-None-Match header
          if (req.headers['if-none-match'] === etag) {
            res.status(304).end();
            return res;
          }
        }
        
        // Add Last-Modified
        if (lastModified) {
          res.set('Last-Modified', new Date().toUTCString());
        }
        
        // Add Cache-Control
        res.set('Cache-Control', `public, max-age=${maxAge}`);
      }
      
      return originalJson(body);
    };
    
    next();
  };
};

/**
 * Conditional GET middleware
 * Handles If-Modified-Since and If-None-Match headers
 */
const conditionalGet = (req, res, next) => {
  // Check If-None-Match
  if (req.headers['if-none-match']) {
    // ETag matching handled at response level
  }
  
  // Check If-Modified-Since
  if (req.headers['if-modified-since']) {
    const ifModifiedSince = new Date(req.headers['if-modified-since']).getTime();
    const now = Date.now();
    
    if (now - ifModifiedSince < 5000) { // Less than 5 seconds old
      res.status(304).end();
      return;
    }
  }
  
  next();
};

/**
 * Set caching headers for static resources
 */
const setCacheHeaders = (req, res, next) => {
  // Cache public resources for 1 hour
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)) {
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('Expires', new Date(Date.now() + 3600000).toUTCString());
  }
  
  // Cache API responses based on route
  if (req.path.startsWith('/api/v1/movies') || req.path.startsWith('/api/v1/cinemas')) {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  
  next();
};

module.exports = {
  cacheMiddleware,
  conditionalGet,
  setCacheHeaders,
  generateETag
};
