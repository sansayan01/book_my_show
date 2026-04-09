/**
 * Server-Sent Events (SSE) Service
 * Real-time notifications via SSE
 */
const { v4: uuidv4 } = require('uuid');

class SSEService {
  constructor() {
    // Map of user ID to array of SSE connections
    this.connections = new Map();
    // Event listeners
    this.listeners = new Map();
    // Stats
    this.stats = {
      totalConnections: 0,
      totalEvents: 0,
      totalBytesSent: 0
    };
  }

  /**
   * Add a new SSE connection for a user
   */
  addConnection(userId, req, res) {
    const connectionId = uuidv4();
    const connection = {
      id: connectionId,
      userId,
      req,
      res,
      createdAt: new Date(),
      lastActivity: new Date(),
      isAlive: true
    };

    // Add to connections map
    if (!this.connections.has(userId)) {
      this.connections.set(userId, []);
    }
    this.connections.get(userId).push(connection);
    this.stats.totalConnections++;

    // Set up SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*'
    });

    // Send initial connection event
    this.sendToConnection(connection, {
      type: 'connected',
      connectionId,
      timestamp: new Date().toISOString()
    });

    // Handle client disconnect
    req.on('close', () => {
      this.removeConnection(userId, connectionId);
    });

    req.on('error', () => {
      this.removeConnection(userId, connectionId);
    });

    // Heartbeat every 30 seconds
    const heartbeat = setInterval(() => {
      if (!connection.isAlive) {
        clearInterval(heartbeat);
        this.removeConnection(userId, connectionId);
        return;
      }
      connection.isAlive = false;
      this.sendToConnection(connection, {
        type: 'heartbeat',
        timestamp: new Date().toISOString()
      });
    }, 30000);

    connection.heartbeat = heartbeat;

    return connection;
  }

  /**
   * Remove a connection
   */
  removeConnection(userId, connectionId) {
    const userConnections = this.connections.get(userId);
    if (!userConnections) return;

    const index = userConnections.findIndex(c => c.id === connectionId);
    if (index !== -1) {
      const connection = userConnections[index];
      if (connection.heartbeat) {
        clearInterval(connection.heartbeat);
      }
      userConnections.splice(index, 1);
      
      if (userConnections.length === 0) {
        this.connections.delete(userId);
      }
    }
  }

  /**
   * Send event to a specific connection
   */
  sendToConnection(connection, data) {
    try {
      const event = `data: ${JSON.stringify(data)}\n\n`;
      connection.res.write(event);
      connection.isAlive = true;
      connection.lastActivity = new Date();
      this.stats.totalEvents++;
      this.stats.totalBytesSent += Buffer.byteLength(event);
    } catch (error) {
      console.error('SSE send error:', error);
      connection.isAlive = false;
    }
  }

  /**
   * Send event to a user (all their connections)
   */
  sendToUser(userId, eventType, data) {
    const userConnections = this.connections.get(userId);
    if (!userConnections || userConnections.length === 0) {
      return false;
    }

    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      ...data
    };

    userConnections.forEach(connection => {
      this.sendToConnection(connection, event);
    });

    return true;
  }

  /**
   * Broadcast event to all connected users
   */
  broadcast(eventType, data) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      ...data
    };

    this.connections.forEach((connections, userId) => {
      connections.forEach(connection => {
        this.sendToConnection(connection, event);
      });
    });

    return this.getConnectedUserCount();
  }

  /**
   * Subscribe to specific event types
   */
  subscribe(userId, eventTypes, callback) {
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, []);
    }

    const listener = {
      id: uuidv4(),
      eventTypes,
      callback,
      createdAt: new Date()
    };

    this.listeners.get(userId).push(listener);
    return listener.id;
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(userId, listenerId) {
    const userListeners = this.listeners.get(userId);
    if (!userListeners) return false;

    const index = userListeners.findIndex(l => l.id === listenerId);
    if (index !== -1) {
      userListeners.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Trigger an event to all subscribers
   */
  emit(eventType, data) {
    const event = {
      type: eventType,
      timestamp: new Date().toISOString(),
      ...data
    };

    // Notify listeners
    this.listeners.forEach((listeners) => {
      listeners.forEach(listener => {
        if (listener.eventTypes.includes(eventType) || listener.eventTypes.includes('*')) {
          try {
            listener.callback(event);
          } catch (error) {
            console.error('Listener error:', error);
          }
        }
      });
    });

    // Send to SSE connections
    this.broadcast(eventType, data);
  }

  /**
   * Get number of connected users
   */
  getConnectedUserCount() {
    return this.connections.size;
  }

  /**
   * Get total active connections
   */
  getTotalConnections() {
    let total = 0;
    this.connections.forEach(conns => {
      total += conns.length;
    });
    return total;
  }

  /**
   * Get connection info for a user
   */
  getUserConnections(userId) {
    const connections = this.connections.get(userId);
    if (!connections) return [];

    return connections.map(c => ({
      id: c.id,
      createdAt: c.createdAt,
      lastActivity: c.lastActivity,
      isAlive: c.isAlive
    }));
  }

  /**
   * Get service stats
   */
  getStats() {
    return {
      ...this.stats,
      connectedUsers: this.getConnectedUserCount(),
      totalConnections: this.getTotalConnections(),
      listeners: this.listeners.size
    };
  }

  /**
   * Clean up dead connections
   */
  cleanup() {
    const now = Date.now();
    const timeout = 60 * 1000; // 1 minute timeout

    this.connections.forEach((connections, userId) => {
      connections.forEach((connection, index) => {
        if (!connection.isAlive && now - connection.lastActivity.getTime() > timeout) {
          this.removeConnection(userId, connection.id);
        }
      });
    });
  }

  /**
   * Predefined event types
   */
  static Events = {
    BOOKING_CONFIRMED: 'booking_confirmed',
    BOOKING_CANCELLED: 'booking_cancelled',
    SHOW_REMINDER: 'show_reminder',
    REFERRAL_REWARD: 'referral_reward',
    LOYALTY_UPGRADE: 'loyalty_upgrade',
    PAYMENT_SUCCESS: 'payment_success',
    PAYMENT_FAILED: 'payment_failed',
    NEW_MOVIE: 'new_movie',
    PROMO_OFFER: 'promo_offer',
    SYSTEM_ANNOUNCEMENT: 'system_announcement'
  };
}

// Initialize global SSE service
global.sseService = global.sseService || new SSEService();

// Cleanup dead connections every minute
setInterval(() => {
  global.sseService.cleanup();
}, 60000);

module.exports = global.sseService;
