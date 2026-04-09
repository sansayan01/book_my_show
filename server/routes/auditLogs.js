const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getRecentLogs,
  getEntityAuditTrail,
  getMyActivity,
  searchLogs,
  getActionStats,
  getDailyActivity,
  getTopActiveAdmins
} = require('../controllers/auditLogController');

// All routes require authentication and admin role
router.use(protect, admin);

// Get recent audit logs
router.get('/recent', getRecentLogs);

// Get current user's activity
router.get('/my-activity', getMyActivity);

// Search audit logs
router.get('/search', searchLogs);

// Get action statistics
router.get('/stats/actions', getActionStats);

// Get daily activity
router.get('/stats/daily', getDailyActivity);

// Get top active admins
router.get('/stats/admins', getTopActiveAdmins);

// Get audit trail for specific entity
router.get('/entity/:entity/:entityId', getEntityAuditTrail);

module.exports = router;
