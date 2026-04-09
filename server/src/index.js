/**
 * BookMyShow Backend Server
 * Advanced Express Server with WebSocket, Caching, API Versioning, and Graceful Shutdown
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('../config/db');

// Import new services
const wsManager = require('../services/websocketManager');
const cacheService = require('../services/cacheService');
const cronService = require('../services/cronService');
const requestLogger = require('../middleware/requestLogger');

// Route files - v1 API
const authRoutes = require('../routes/auth');
const movieRoutes = require('../routes/movies');
const cinemaRoutes = require('../routes/cinemas');
const showRoutes = require('../routes/shows');
const bookingRoutes = require('../routes/bookings');
const analyticsRoutes = require('../routes/analytics');
const paymentRoutes = require('../routes/payments');
const adminRoutes = require('../routes/admin');

// Swagger documentation
const setupSwagger = require('../config/swagger');

// Error handler
const errorHandler = require('../middleware/errorHandler');

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
╚═══════════════════════════════════════════════════════════╝
  `);
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`WebSocket URL: ws://localhost:${PORT}/ws`);
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
    
    // 4. Close database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('[Graceful Shutdown] Database connection closed');
    }
    
    // 5. Close request logger
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
