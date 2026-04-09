const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getHealthDashboard,
  getMetrics
} = require('../controllers/healthController');

// Public health check
router.get('/dashboard', getHealthDashboard);

// Prometheus-style metrics (admin only)
router.get('/metrics', protect, admin, getMetrics);

module.exports = router;
