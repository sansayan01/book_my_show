const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('../config/db');

// Route files
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

// Initialize express
const app = express();

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
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging with Morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Create logs directory for production
  const logsDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  // Log to file in production
  const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
}

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/bookings', bookingLimiter);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Setup Swagger documentation
setupSwagger(app);

// Health check endpoint with dependency status
app.get('/api/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : dbState === 0 ? 'disconnected' : 'connecting';
    
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const heapUsedPercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);
    
    const health = {
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
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
        }
      }
    };
    
    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});

module.exports = app;