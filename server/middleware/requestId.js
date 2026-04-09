/**
 * Request ID Middleware for request tracing
 * Generates and attaches unique request IDs for debugging and monitoring
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Middleware to generate and attach request ID
 */
const requestIdMiddleware = (req, res, next) => {
  // Check for existing request ID in headers (from load balancer/proxy)
  const incomingRequestId = req.headers['x-request-id'] || req.headers['x-correlation-id'];
  
  // Use incoming ID or generate new one
  const requestId = incomingRequestId || uuidv4();
  
  // Attach to request object
  req.requestId = requestId;
  
  // Also attach to response headers for client correlation
  res.setHeader('X-Request-ID', requestId);
  
  // If incoming had a different ID, log the mapping
  if (incomingRequestId && incomingRequestId !== requestId) {
    res.setHeader('X-Correlation-ID', incomingRequestId);
  }
  
  // Log incoming request with request ID
  const startTime = Date.now();
  req.startTime = startTime;
  
  // Log request start
  console.log(`[${requestId}] --> ${req.method} ${req.originalUrl} - Started`);
  
  // Capture response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';
    
    const logMessage = `[${requestId}] <-- ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`;
    
    if (logLevel === 'error') {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
    
    originalEnd.apply(res, args);
  };
  
  next();
};

module.exports = requestIdMiddleware;
