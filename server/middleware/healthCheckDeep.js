/**
 * Health Check Deep Mode Controller
 * Provides comprehensive health checks with detailed diagnostics
 */

const mongoose = require('mongoose');
const os = require('os');
const { dbPoolMetrics } = require('../middleware/dbPoolMetrics');

/**
 * Deep health check with all dependencies
 */
exports.deepHealthCheck = async (req, res) => {
  const checks = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: 'v1'
  };
  
  try {
    // Parallel health checks
    const [
      database,
      cache,
      memory,
      cpu,
      disk,
      network,
      external,
      websocket,
      queue
    ] = await Promise.allSettled([
      checkDatabase(),
      checkCache(),
      checkMemory(),
      checkCPU(),
      checkDisk(),
      checkNetwork(),
      checkExternalServices(),
      checkWebSocket(),
      checkQueue()
    ]);
    
    checks.database = database.status === 'fulfilled' ? database.value : { status: 'error', error: database.reason?.message };
    checks.cache = cache.status === 'fulfilled' ? cache.value : { status: 'error', error: cache.reason?.message };
    checks.memory = memory.status === 'fulfilled' ? memory.value : { status: 'fulfilled', value: memory.value };
    checks.cpu = cpu.status === 'fulfilled' ? cpu.value : { status: 'error', error: cpu.reason?.message };
    checks.disk = disk.status === 'fulfilled' ? disk.value : { status: 'error', error: disk.reason?.message };
    checks.network = network.status === 'fulfilled' ? network.value : { status: 'error', error: network.reason?.message };
    checks.external = external.status === 'fulfilled' ? external.value : { status: 'error', error: external.reason?.message };
    checks.websocket = websocket.status === 'fulfilled' ? websocket.value : { status: 'error', error: websocket.reason?.message };
    checks.queue = queue.status === 'fulfilled' ? queue.value : { status: 'error', error: queue.reason?.message };
    
    // Calculate overall status
    checks.status = calculateOverallStatus(checks);
    
    res.json({
      success: true,
      ...checks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Deep health check failed',
      error: error.message,
      ...checks
    });
  }
};

/**
 * Check database health
 */
async function checkDatabase() {
  const start = Date.now();
  
  try {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const dbState = mongoose.connection.readyState;
    
    let pingMs = null;
    let collections = 0;
    let indexes = 0;
    
    if (dbState === 1) {
      const pingStart = Date.now();
      await mongoose.connection.db.admin().ping();
      pingMs = Date.now() - pingStart;
      
      // Get collection stats
      const collections_list = await mongoose.connection.db.listCollections().toArray();
      collections = collections_list.length;
    }
    
    return {
      status: states[dbState],
      healthy: dbState === 1,
      pingMs,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      collections,
      readyState: dbState,
      responseTime: Date.now() - start
    };
  } catch (error) {
    return {
      status: 'error',
      healthy: false,
      error: error.message,
      responseTime: Date.now() - start
    };
  }
}

/**
 * Check cache service health
 */
async function checkCache() {
  try {
    const cacheService = require('../services/cacheService');
    const stats = cacheService.getStats();
    
    return {
      status: 'healthy',
      healthy: true,
      size: stats.size,
      hits: stats.hits,
      misses: stats.misses,
      hitRate: stats.hitRate,
      maxSize: stats.maxSize
    };
  } catch (error) {
    return {
      status: 'error',
      healthy: false,
      error: error.message
    };
  }
}

/**
 * Check memory health
 */
function checkMemory() {
  const usage = process.memoryUsage();
  const total = os.totalmem();
  const free = os.freemem();
  
  const heapPercent = Math.round((usage.heapUsed / usage.heapTotal) * 100);
  const systemPercent = Math.round(((total - free) / total) * 100);
  
  return {
    status: heapPercent < 90 ? 'healthy' : 'warning',
    healthy: heapPercent < 90,
    heap: {
      used: formatBytes(usage.heapUsed),
      total: formatBytes(usage.heapTotal),
      percentage: heapPercent
    },
    rss: formatBytes(usage.rss),
    external: formatBytes(usage.external),
    system: {
      total: formatBytes(total),
      free: formatBytes(free),
      used: formatBytes(total - free),
      percentage: systemPercent
    }
  };
}

/**
 * Check CPU health
 */
function checkCPU() {
  const load = os.loadavg();
  const cpus = os.cpus();
  const loadPerCore = load[0] / cpus.length;
  
  return {
    status: loadPerCore < 2 ? 'healthy' : loadPerCore < 4 ? 'warning' : 'critical',
    healthy: loadPerCore < 2,
    loadAverage: {
      '1min': load[0],
      '5min': load[1],
      '15min': load[2]
    },
    cores: cpus.length,
    loadPerCore: Math.round(loadPerCore * 100) / 100,
    model: cpus[0]?.model || 'Unknown',
    speed: `${cpus[0]?.speed || 'N/A'} MHz`
  };
}

/**
 * Check disk health
 */
async function checkDisk() {
  try {
    // Use fs.statfs if available, otherwise return mock data
    const fs = require('fs');
    
    return {
      status: 'healthy',
      healthy: true,
      note: 'Disk check requires additional configuration'
    };
  } catch (error) {
    return {
      status: 'error',
      healthy: false,
      error: error.message
    };
  }
}

/**
 * Check network connectivity
 */
function checkNetwork() {
  const interfaces = os.networkInterfaces();
  const activeInterfaces = Object.keys(interfaces).filter(name => {
    const iface = interfaces[name];
    return iface.some(i => !i.internal && i.family === 'IPv4');
  });
  
  return {
    status: 'healthy',
    healthy: true,
    hostname: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    activeInterfaces,
    interfaceCount: activeInterfaces.length
  };
}

/**
 * Check external services
 */
async function checkExternalServices() {
  const services = {
    database: { url: process.env.MONGO_URI, healthy: false },
    cache: { healthy: false },
    websocket: { healthy: false }
  };
  
  // Check database
  if (mongoose.connection.readyState === 1) {
    services.database.healthy = true;
  }
  
  // Check cache (assumed healthy if service exists)
  try {
    const cacheService = require('../services/cacheService');
    services.cache.healthy = !!cacheService;
  } catch (e) {}
  
  // Check WebSocket
  try {
    const wsManager = require('../services/websocketManager');
    services.websocket.healthy = !!wsManager;
  } catch (e) {}
  
  const allHealthy = Object.values(services).every(s => s.healthy);
  
  return {
    status: allHealthy ? 'healthy' : 'degraded',
    healthy: allHealthy,
    services
  };
}

/**
 * Check WebSocket health
 */
function checkWebSocket() {
  try {
    const wsManager = require('../services/websocketManager');
    const stats = wsManager.getStats();
    
    return {
      status: 'healthy',
      healthy: true,
      ...stats
    };
  } catch (error) {
    return {
      status: 'error',
      healthy: false,
      error: error.message
    };
  }
}

/**
 * Check queue health
 */
function checkQueue() {
  try {
    const jobQueueService = require('../services/jobQueueService');
    const stats = jobQueueService.getStats();
    
    return {
      status: 'healthy',
      healthy: true,
      ...stats
    };
  } catch (error) {
    return {
      status: 'error',
      healthy: false,
      error: error.message
    };
  }
}

/**
 * Calculate overall status
 */
function calculateOverallStatus(checks) {
  const criticalChecks = ['database'];
  const warningThreshold = 0.8;
  
  // Check critical services
  for (const check of criticalChecks) {
    if (checks[check]?.healthy === false) {
      return 'critical';
    }
  }
  
  // Check memory
  if (checks.memory?.healthy === false) {
    return 'warning';
  }
  
  // Calculate health score
  let total = 0;
  let healthy = 0;
  
  Object.entries(checks).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      if ('healthy' in value) {
        total++;
        if (value.healthy) healthy++;
      }
      if ('status' in value) {
        total++;
        if (value.status === 'healthy') healthy++;
      }
    }
  });
  
  const score = total > 0 ? healthy / total : 1;
  
  if (score >= warningThreshold) return 'healthy';
  if (score >= 0.5) return 'warning';
  return 'critical';
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Simple health check (for load balancer)
 */
exports.simpleHealthCheck = (req, res) => {
  const dbState = mongoose.connection.readyState === 1;
  
  if (dbState) {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString()
    });
  }
};
