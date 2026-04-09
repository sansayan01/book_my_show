/**
 * SSE Controller
 * Handles Server-Sent Events connections
 */
const sseService = require('../services/sseService');

/**
 * Connect to SSE stream
 */
exports.connect = async (req, res) => {
  try {
    // For authenticated users
    if (req.user) {
      sseService.addConnection(req.user._id.toString(), req, res);
      
      // Keep the connection alive
      req.socket.on('close', () => {
        console.log(`SSE connection closed for user ${req.user._id}`);
      });
    } else {
      // For anonymous users - use IP as identifier
      const ip = req.ip || req.connection?.remoteAddress || 'anonymous';
      sseService.addConnection(ip, req, res);
    }
  } catch (error) {
    console.error('SSE connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to establish SSE connection'
    });
  }
};

/**
 * Get SSE connection status
 */
exports.getStatus = async (req, res) => {
  try {
    const stats = sseService.getStats();
    const userConnections = req.user 
      ? sseService.getUserConnections(req.user._id.toString())
      : [];
    
    res.json({
      success: true,
      stats,
      myConnections: userConnections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get SSE status',
      error: error.message
    });
  }
};

/**
 * Test SSE notification (for debugging)
 */
exports.testNotification = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const sent = sseService.sendToUser(
      req.user._id.toString(),
      sseService.constructor.Events.SYSTEM_ANNOUNCEMENT,
      {
        title: 'Test Notification',
        message: 'This is a test notification from the SSE service',
        priority: 'normal'
      }
    );
    
    res.json({
      success: true,
      sent,
      message: sent ? 'Test notification sent' : 'No active connections'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification',
      error: error.message
    });
  }
};
