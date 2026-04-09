/**
 * Security Headers Middleware
 * Implements security headers using helmet
 */

const helmet = require('helmet');

// Configure helmet with custom settings
const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'wss:', 'ws:'],
      mediaSrc: ["'self'", 'https:'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  
  // X-Frame-Options
  frameguard: {
    action: 'deny'
  },
  
  // X-Content-Type-Options
  noSniff: true,
  
  // X-XSS-Protection
  xssFilter: true,
  
  // Strict-Transport-Security (HSTS)
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  // Referrer-Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  },
  
  // X-Download-Options
  ieNoOpen: true,
  
  // X-Permitted-Cross-Domain-Policies
  permittedCrossDomainPolicies: {
    permittedPolicies: 'none'
  }
});

// Additional security headers
const additionalSecurityHeaders = (req, res, next) => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Add custom security headers
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
  });
  
  next();
};

// CORS configuration factory
const corsConfig = (options = {}) => {
  const {
    origins = [process.env.FRONTEND_URL || 'http://localhost:5173'],
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders = ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Requested-With'],
    exposedHeaders = ['X-Total-Count', 'X-Page-Count', 'ETag', 'Last-Modified'],
    credentials = true,
    maxAge = 86400 // 24 hours
  } = options;

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman)
      if (!origin) return callback(null, true);
      
      if (origins.includes(origin) || origins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods,
    allowedHeaders,
    exposedHeaders,
    credentials,
    maxAge,
    optionsSuccessStatus: 204
  };
};

// Route-specific CORS middleware factory
const routeCors = (routeOptions = {}) => {
  const cors = require('cors');
  const config = corsConfig(routeOptions);
  return cors(config);
};

module.exports = {
  securityHeaders,
  additionalSecurityHeaders,
  corsConfig,
  routeCors
};
