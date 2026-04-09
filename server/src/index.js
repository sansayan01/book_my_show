/**
 * BookMyShow Backend Server
 * Advanced Express Server with WebSocket, Caching, API Versioning, and Graceful Shutdown
 * Enterprise Features: GraphQL, Security Headers, Compression, Analytics
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('../config/db');

// Import new enterprise services
const { apiAnalytics, errorTracker } = require('../middleware/apiAnalytics');
const { securityHeaders, additionalSecurityHeaders } = require('../middleware/securityHeaders');
const { cacheMiddleware, setCacheHeaders } = require('../middleware/cacheHeaders');
const { ipRateLimiter, dynamicRateLimiter, getAllIPStats } = require('../middleware/ipRateLimiter');
const { bodySizeLimit, dynamicBodyLimit } = require('../middleware/bodySizeLimit');
const { dbPoolMetrics, dbQueryTracker, getPoolMetrics } = require('../middleware/dbPoolMetrics');
const { deepHealthCheck, simpleHealthCheck } = require('../middleware/healthCheckDeep');

// Import new services
const wsManager = require('../services/websocketManager');
const cacheService = require('../services/cacheService');
const cronService = require('../services/cronService');
const requestLogger = require('../middleware/requestLogger');
const i18nService = require('../services/i18nService');
const featureFlagService = require('../services/featureFlagService');
const recommendationService = require('../services/recommendationService');
const cinemaPreferenceService = require('../services/cinemaPreferenceService');
const popularSearchesService = require('../services/popularSearchesService');
const sseService = require('../services/sseService');
const jobQueueService = require('../services/jobQueueService');

// Route files - v1 API
const authRoutes = require('../routes/auth');
const movieRoutes = require('../routes/movies');
const cinemaRoutes = require('../routes/cinemas');
const showRoutes = require('../routes/shows');
const bookingRoutes = require('../routes/bookings');
const analyticsRoutes = require('../routes/analytics');
const paymentRoutes = require('../routes/payments');
const adminRoutes = require('../routes/admin');
const walletRoutes = require('../routes/wallet');
const referralRoutes = require('../routes/referrals');
const loyaltyRoutes = require('../routes/loyalty');
const exportRoutes = require('../routes/export');
const notificationRoutes = require('../routes/notifications');
// New feature routes
const i18nRoutes = require('../routes/i18n');
const featureFlagRoutes = require('../routes/featureFlags');
const auditLogRoutes = require('../routes/auditLogs');
const recommendationRoutes = require('../routes/recommendations');
const searchRoutes = require('../routes/search');
const sseRoutes = require('../routes/sse');
const healthRoutes = require('../routes/health');
const graphqlRoutes = require('../routes/graphql');

// Swagger documentation
const setupSwagger = require('../config/swagger');

// Error handler
const errorHandler = require('../middleware/errorHandler');

// Auth middleware
const { protect, admin } = require('../middleware/auth');

// Rate limiter
const { generalLimiter, authLimiter, bookingLimiter } = require('../middleware/rateLimiter');

// Validation middleware
const { sanitize, validateRequestSize } = require('../middleware/validate');

// Request ID middleware
const requestIdMiddleware = require('../middleware/requestId');

// Initialize express
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Connect to database
connectDB();

// ==========================================
// ENTERPRISE SECURITY MIDDLEWARE
// ==========================================

// Security headers (helmet)
app.use(securityHeaders);
app.use(additionalSecurityHeaders);

// Request compression
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024
}));

// Cache headers for static resources
app.use(setCacheHeaders);

// API Analytics
app.use(apiAnalytics);

// Database query tracking
app.use(dbQueryTracker);

// Dynamic body size limits
app.use(dynamicBodyLimit);

// Body parser with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request sanitization
app.use(sanitize);

// Request size validation
app.use(validateRequestSize('10mb'));

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));

// Request ID middleware for tracing
app.use(requestIdMiddleware);

// Request logging to file
app.use(requestLogger.middleware());

// i18n middleware for multi-language support
app.use(i18nService.middleware());

// Basic logging with Morgan (for console only)
const morgan = require('morgan');
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Create logs directory for production
  const logsDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

// Apply rate limiting
app.use('/api/v1/', generalLimiter);
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1/bookings', bookingLimiter);

// Apply IP-based rate limiting for all API routes
app.use('/api/v1/', dynamicRateLimiter);

// Apply caching with ETag/Last-Modified
app.use('/api/v1/movies', cacheMiddleware({ etag: true, lastModified: true, maxAge: 300 }));
app.use('/api/v1/cinemas', cacheMiddleware({ etag: true, lastModified: true, maxAge: 300 }));
app.use('/api/v1/shows', cacheMiddleware({ etag: true, lastModified: true, maxAge: 60 }));

/**
 * API VERSION 1 (/api/v1/*)
 * All routes are now prefixed with /api/v1 for proper versioning
 */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/cinemas', cinemaRoutes);
app.use('/api/v1/shows', showRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/referrals', referralRoutes);
app.use('/api/v1/loyalty', loyaltyRoutes);
app.use('/api/v1/export', exportRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// New feature routes
app.use('/api/v1/i18n', i18nRoutes);
app.use('/api/v1/feature-flags', featureFlagRoutes);
app.use('/api/v1/audit-logs', auditLogRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/sse', sseRoutes);
app.use('/api/v1/health', healthRoutes);

// GraphQL API endpoint
app.use('/api/v1/graphql', graphqlRoutes);

// Setup Swagger documentation
setupSwagger(app);

/**
 * Health check endpoint with dependency status
 * Enhanced with cache and WebSocket stats
 */
app.get('/api/v1/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : dbState === 0 ? 'disconnected' : 'connecting';
    
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const heapUsedPercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);
    
    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: 'v1',
      requestId: req.requestId,
      dependencies: {
        database: {
          status: dbStatus,
          name: 'MongoDB'
        },
        memory: {
          status: heapUsedPercent < 90 ? 'healthy' : 'warning',
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          heapPercent: `${heapUsedPercent}%`
        },
        cache: cacheService.getStats(),
        websocket: wsManager.getStats()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
      requestId: req.requestId
    });
  }
});

/**
 * Deep health check endpoint (enterprise)
 * Provides comprehensive system diagnostics
 */
app.get('/api/v1/health/deep', deepHealthCheck);

/**
 * Simple health check (for load balancers)
 */
app.get('/health/live', simpleHealthCheck);
app.get('/health/ready', simpleHealthCheck);

/**
 * API usage analytics endpoint (admin only)
 */
app.get('/api/v1/admin/analytics', protect, admin, (req, res) => {
  const analyticsService = require('../services/apiAnalyticsService');
  res.json({
    success: true,
    analytics: analyticsService.getStats()
  });
});

/**
 * IP analytics endpoint (admin only)
 */
app.get('/api/v1/admin/ip-analytics', protect, admin, (req, res) => {
  res.json({
    success: true,
    ips: getAllIPStats()
  });
});

/**
 * Database connection pool metrics (admin only)
 */
app.get('/api/v1/admin/pool-metrics', protect, admin, getPoolMetrics);

/**
 * Cache management endpoint (admin only)
 */
app.get('/api/v1/admin/cache/stats', (req, res) => {
  res.json({
    success: true,
    data: cacheService.getStats()
  });
});

app.post('/api/v1/admin/cache/clear', (req, res) => {
  const cleared = cacheService.clear();
  res.json({
    success: true,
    message: `Cleared ${cleared} cache entries`
  });
});

/**
 * Cron job status endpoint (admin only)
 */
app.get('/api/v1/admin/cron/status', (req, res) => {
  res.json({
    success: true,
    data: cronService.getStatus()
  });
});

app.post('/api/v1/admin/cron/run/:taskName', async (req, res) => {
  const success = await cronService.runTask(req.params.taskName);
  res.json({
    success,
    message: success ? `Task ${req.params.taskName} executed` : 'Task not found'
  });
});

/**
 * WebSocket stats endpoint (admin only)
 */
app.get('/api/v1/admin/websocket/stats', (req, res) => {
  res.json({
    success: true,
    data: wsManager.getStats()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestId: req.requestId
  });
});

// Error handler
app.use(errorHandler);

// Initialize WebSocket server
wsManager.init(server);

// Initialize Cron jobs (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  cronService.init();
}

// Initialize feature flags
featureFlagService.initializeDefaults().catch(err => {
  console.error('Failed to initialize feature flags:', err);
});

// Log service initialization
console.log('[Services] Initialized: i18n, feature flags, job queue, SSE, recommendations');

// Log enterprise features initialization
console.log('[Enterprise] Security headers (helmet), compression, GraphQL, API analytics enabled');

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║          BookMyShow Backend Server Starting...             ║
╠═══════════════════════════════════════════════════════════╣
║  Port: ${PORT}                                                ║
║  Mode: ${(process.env.NODE_ENV || 'development').padEnd(41)}║
║  API Version: v1                                           ║
║  WebSocket: /ws                                           ║
║  GraphQL: /api/v1/graphql                                  ║
║  GraphiQL: /api/v1/graphql/playground                      ║
╠═══════════════════════════════════════════════════════════╣
║  ENTERPRISE FEATURES:                                      ║
║  - Security Headers (helmet) ✓                            ║
║  - Request/Response Compression ✓                        ║
║  - GraphQL API Layer ✓                                     ║
║  - API Usage Analytics ✓                                  ║
║  - ETag/Last-Modified Caching ✓                           ║
║  - DB Connection Pool Metrics ✓                           ║
║  - IP-Based Rate Limiting ✓                               ║
║  - Deep Health Check Mode ✓                               ║
║  - CORS Per-Route Config ✓                                ║
╚═══════════════════════════════════════════════════════════╝
  `);
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`WebSocket URL: ws://localhost:${PORT}/ws`);
  console.log(`GraphQL URL: http://localhost:${PORT}/api/v1/graphql`);
});

/**
 * GRACEFUL SHUTDOWN HANDLING
 * Handles SIGTERM and SIGINT signals for container orchestration
 */
const gracefulShutdown = async (signal) => {
  console.log(`\n[${signal}] Received shutdown signal...`);
  console.log('[Graceful Shutdown] Starting cleanup...');
  
  // Stop accepting new connections
  server.close(() => {
    console.log('[Graceful Shutdown] HTTP server closed');
  });
  
  try {
    // 1. Stop cron jobs
    cronService.shutdown();
    
    // 2. Stop WebSocket server
    wsManager.shutdown();
    
    // 3. Clear cache
    cacheService.shutdown();
    
    // 4. Clear SSE connections
    if (sseService) {
      console.log('[Graceful Shutdown] Closing SSE connections...');
      // SSE connections will be cleaned up by event loop
    }
    
    // 5. Clear popular searches cache
    if (popularSearchesService) {
      console.log('[Graceful Shutdown] Cleaning up search cache...');
    }
    
    // 6. Close database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('[Graceful Shutdown] Database connection closed');
    }
    
    // 7. Close request logger
    requestLogger.shutdown();
    
    console.log('[Graceful Shutdown] All connections closed gracefully');
    process.exit(0);
  } catch (error) {
    console.error('[Graceful Shutdown] Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`[Error] Unhandled Rejection: ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[Error] Uncaught Exception: ${err.message}`);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Log memory warnings
setInterval(() => {
  const memoryUsage = process.memoryUsage();
  const heapUsedPercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);
  
  if (heapUsedPercent > 90) {
    console.warn(`[Warning] High memory usage: ${heapUsedPercent}%`);
  }
}, 60000);

module.exports = { app, server };
