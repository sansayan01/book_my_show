const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  connect,
  getStatus,
  testNotification
} = require('../controllers/sseController');

// Connect to SSE stream (no auth required, but will be authenticated if token provided)
router.get('/stream', connect);

// Get SSE connection status
router.get('/status', protect, getStatus);

// Send test notification (for debugging)
router.post('/test', protect, testNotification);

module.exports = router;
