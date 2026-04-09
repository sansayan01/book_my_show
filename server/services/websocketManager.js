/**
 * WebSocket Manager for Real-time Seat Updates
 * Handles seat availability broadcasts and connection management
 */

const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

class WebSocketManager {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // clientId -> { ws, userId, subscriptions }
    this.rooms = new Map();   // showId -> Set of clientIds
    this.heartbeatInterval = null;
  }

  /**
   * Initialize WebSocket server
   * @param {http.Server} server - HTTP server instance
   */
  init(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws',
      clientTracking: true
    });

    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });

    // Heartbeat to keep connections alive
    this.heartbeatInterval = setInterval(() => {
      this.checkHeartbeats();
    }, 30000);

    console.log('[WebSocket] Server initialized on /ws path');
    return this.wss;
  }

  /**
   * Handle new WebSocket connection
   */
  handleConnection(ws, req) {
    const clientId = uuidv4();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    ws.clientId = clientId;
    ws.isAlive = true;
    ws.subscriptions = new Set();
    ws.joinTime = Date.now();

    this.clients.set(clientId, {
      ws,
      userId: null,
      subscriptions: ws.subscriptions,
      ip,
      userAgent: req.headers['user-agent']
    });

    console.log(`[WebSocket] Client connected: ${clientId} from ${ip}`);

    // Send welcome message
    this.sendToClient(clientId, {
      type: 'connected',
      clientId,
      timestamp: new Date().toISOString()
    });

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (message) => {
      this.handleMessage(clientId, message);
    });

    ws.on('close', () => {
      this.handleDisconnect(clientId);
    });

    ws.on('error', (error) => {
      console.error(`[WebSocket] Client ${clientId} error:`, error.message);
      this.handleDisconnect(clientId);
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleMessage(clientId, message) {
    try {
      const data = JSON.parse(message);
      const client = this.clients.get(clientId);
      
      if (!client) return;

      switch (data.type) {
        case 'subscribe':
          this.handleSubscribe(clientId, data);
          break;
          
        case 'unsubscribe':
          this.handleUnsubscribe(clientId, data);
          break;
          
        case 'auth':
          this.handleAuth(clientId, data);
          break;
          
        case 'ping':
          this.sendToClient(clientId, { type: 'pong', timestamp: Date.now() });
          break;
          
        case 'seat_lock':
          this.handleSeatLock(clientId, data);
          break;
          
        case 'seat_release':
          this.handleSeatRelease(clientId, data);
          break;
          
        default:
          console.log(`[WebSocket] Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('[WebSocket] Message parse error:', error.message);
    }
  }

  /**
   * Handle subscribe to show updates
   */
  handleSubscribe(clientId, data) {
    const { showId } = data;
    if (!showId) return;

    const client = this.clients.get(clientId);
    client.subscriptions.add(showId);

    if (!this.rooms.has(showId)) {
      this.rooms.set(showId, new Set());
    }
    this.rooms.get(showId).add(clientId);

    this.sendToClient(clientId, {
      type: 'subscribed',
      showId,
      timestamp: new Date().toISOString()
    });

    console.log(`[WebSocket] Client ${clientId} subscribed to show ${showId}`);
  }

  /**
   * Handle unsubscribe from show updates
   */
  handleUnsubscribe(clientId, data) {
    const { showId } = data;
    const client = this.clients.get(clientId);
    
    if (!client || !showId) return;

    client.subscriptions.delete(showId);
    
    if (this.rooms.has(showId)) {
      this.rooms.get(showId).delete(clientId);
      if (this.rooms.get(showId).size === 0) {
        this.rooms.delete(showId);
      }
    }

    this.sendToClient(clientId, {
      type: 'unsubscribed',
      showId
    });
  }

  /**
   * Handle authentication for WebSocket
   */
  handleAuth(clientId, data) {
    const { userId, token } = data;
    const client = this.clients.get(clientId);
    
    if (!client) return;

    // In production, validate token here
    client.userId = userId;
    client.authenticated = true;

    this.sendToClient(clientId, {
      type: 'authenticated',
      userId
    });

    console.log(`[WebSocket] Client ${clientId} authenticated as ${userId}`);
  }

  /**
   * Handle seat lock notification
   */
  handleSeatLock(clientId, data) {
    const { showId, seats, sessionId } = data;
    this.broadcastToShow(showId, {
      type: 'seat_locked',
      showId,
      seats,
      sessionId,
      timestamp: new Date().toISOString()
    }, clientId);
  }

  /**
   * Handle seat release notification
   */
  handleSeatRelease(clientId, data) {
    const { showId, seats, sessionId } = data;
    this.broadcastToShow(showId, {
      type: 'seat_released',
      showId,
      seats,
      sessionId,
      timestamp: new Date().toISOString()
    }, clientId);
  }

  /**
   * Broadcast seat update to all subscribers of a show
   */
  broadcastSeatUpdate(showId, seats, bookingUserId = null) {
    this.broadcastToShow(showId, {
      type: 'seat_update',
      showId,
      seats,
      timestamp: new Date().toISOString()
    }, null, bookingUserId);
  }

  /**
   * Broadcast message to all clients subscribed to a show
   */
  broadcastToShow(showId, message, excludeClientId = null, bookingUserId = null) {
    const room = this.rooms.get(showId);
    if (!room) return;

    const payload = JSON.stringify(message);

    for (const clientId of room) {
      if (clientId === excludeClientId) continue;
      
      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        // Optionally exclude the user who made the booking
        if (bookingUserId && client.userId === bookingUserId) continue;
        
        client.ws.send(payload);
      }
    }
  }

  /**
   * Send message to specific client
   */
  sendToClient(clientId, message) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  /**
   * Handle client disconnect
   */
  handleDisconnect(clientId) {
    const client = this.clients.get(clientId);
    
    if (client) {
      // Remove from all rooms
      for (const showId of client.subscriptions) {
        if (this.rooms.has(showId)) {
          this.rooms.get(showId).delete(clientId);
          if (this.rooms.get(showId).size === 0) {
            this.rooms.delete(showId);
          }
        }
      }
    }

    this.clients.delete(clientId);
    console.log(`[WebSocket] Client disconnected: ${clientId}`);
  }

  /**
   * Check heartbeats for all clients
   */
  checkHeartbeats() {
    for (const [clientId, client] of this.clients) {
      if (!client.ws.isAlive) {
        client.ws.terminate();
        this.handleDisconnect(clientId);
        continue;
      }
      
      client.ws.isAlive = false;
      client.ws.ping();
    }
  }

  /**
   * Broadcast to all connected clients
   */
  broadcast(message) {
    const payload = JSON.stringify(message);
    
    for (const [clientId, client] of this.clients) {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload);
      }
    }
  }

  /**
   * Get server statistics
   */
  getStats() {
    return {
      totalClients: this.clients.size,
      totalRooms: this.rooms.size,
      subscriptions: Array.from(this.rooms.entries()).map(([showId, clients]) => ({
        showId,
        subscriberCount: clients.size
      })),
      authenticatedClients: Array.from(this.clients.values())
        .filter(c => c.authenticated).length
    };
  }

  /**
   * Graceful shutdown
   */
  shutdown() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Notify all clients
    this.broadcast({
      type: 'server_shutdown',
      message: 'Server is shutting down'
    });

    // Close all connections
    for (const [clientId, client] of this.clients) {
      client.ws.close(1001, 'Server shutdown');
    }

    this.wss.close();
    this.clients.clear();
    this.rooms.clear();
    
    console.log('[WebSocket] Server shutdown complete');
  }
}

// Singleton instance
const wsManager = new WebSocketManager();

module.exports = wsManager;
