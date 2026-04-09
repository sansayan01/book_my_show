/**
 * Health Dashboard Controller
 * Provides system health and monitoring data
 */
const mongoose = require('mongoose');
const os = require('os');
const featureFlagService = require('../services/featureFlagService');
const jobQueueService = require('../services/jobQueueService');
const sseService = require('../services/sseService');
const cacheService = require('../services/cacheService');

/**
 * Get comprehensive system health dashboard data
 */
exports.getHealthDashboard = async (req, res) => {
  try {
    const [
      dbState,
      memoryUsage,
      cpuLoad,
      uptime,
      cacheStats,
      wsStats,
      jobQueueStats,
      sseStats,
      processInfo
    ] = await Promise.all([
      getDatabaseHealth(),
      getMemoryUsage(),
      getCPULoad(),
      getUptime(),
      getCacheStats(),
      getWebSocketStats(),
      getJobQueueStats(),
      getSSEStats(),
      getProcessInfo()
    ]);

    const health = {
      status: determineOverallStatus(dbState, memoryUsage),
      timestamp: new Date().toISOString(),
      uptime,
      database: dbState,
      memory: memoryUsage,
      cpu: cpuLoad,
      cache: cacheStats,
      websocket: wsStats,
      jobQueue: jobQueueStats,
      sse: sseStats,
      process: processInfo,
      environment: process.env.NODE_ENV || 'development'
    };

    res.json({
      success: true,
      health
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get health dashboard',
      error: error.message
    });
  }
};

/**
 * Get database health
 */
async function getDatabaseHealth() {
  try {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const dbState = mongoose.connection.readyState;
    
    let pingMs = null;
    if (dbState === 1) {
      const start = Date.now();
      await mongoose.connection.db.admin().ping();
      pingMs = Date.now() - start;
    }

    return {
      status: states[dbState] || 'unknown',
      state: dbState,
      name: 'MongoDB',
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      pingMs,
      healthy: dbState === 1
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      healthy: false
    };
  }
}

/**
 * Get memory usage
 */
function getMemoryUsage() {
  const usage = process.memoryUsage();
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  
  return {
    heap: {
      used: formatBytes(usage.heapUsed),
      total: formatBytes(usage.heapTotal),
      percentage: Math.round((usage.heapUsed / usage.heapTotal) * 100)
    },
    rss: formatBytes(usage.rss),
    system: {
      total: formatBytes(total),
      free: formatBytes(free),
      used: formatBytes(used),
      percentage: Math.round((used / total) * 100)
    },
    healthy: (usage.heapUsed / usage.heapTotal) < 0.9
  };
}

/**
 * Get CPU load
 */
function getCPULoad() {
  const load = os.loadavg();
  const cpus = os.cpus();
  
  return {
    loadAverage: {
      '1min': load[0],
      '5min': load[1],
      '15min': load[2]
    },
    cores: cpus.length,
    model: cpus[0]?.model || 'Unknown',
    healthy: load[0] < cpus.length * 2
  };
}

/**
 * Get uptime
 */
function getUptime() {
  const uptimeSeconds = process.uptime();
  
  return {
    seconds: uptimeSeconds,
    formatted: formatUptime(uptimeSeconds),
    startedAt: new Date(Date.now() - uptimeSeconds * 1000).toISOString()
  };
}

/**
 * Get cache stats
 */
function getCacheStats() {
  try {
    const stats = cacheService.getStats();
    return {
      ...stats,
      healthy: true
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}

/**
 * Get WebSocket stats
 */
function getWebSocketStats() {
  try {
    const wsManager = require('../services/websocketManager');
    const stats = wsManager.getStats();
    return {
      ...stats,
      healthy: true
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}

/**
 * Get job queue stats
 */
function getJobQueueStats() {
  try {
    const stats = jobQueueService.getStats();
    return {
      ...stats,
      healthy: true
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}

/**
 * Get SSE stats
 */
function getSSEStats() {
  try {
    const stats = sseService.getStats();
    return {
      ...stats,
      healthy: true
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}

/**
 * Get process info
 */
function getProcessInfo() {
  return {
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    argv: process.argv.slice(0, 2)
  };
}

/**
 * Determine overall system status
 */
function determineOverallStatus(dbState, memory) {
  if (dbState?.state !== 1) return 'unhealthy';
  if (memory?.heap?.percentage > 90) return 'degraded';
  if (memory?.heap?.percentage > 80) return 'warning';
  return 'healthy';
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
 * Format uptime
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.join(' ') || '< 1m';
}

/**
 * Get metrics for monitoring (Prometheus-style)
 */
exports.getMetrics = async (req, res) => {
  try {
    const memory = getMemoryUsage();
    const cpu = getCPULoad();
    const jobStats = jobQueueService.getStats();
    const sseStats = sseService.getStats();
    const dbState = mongoose.connection.readyState === 1;
    
    const metrics = `
# HELP nodejs_memory_heap_used_bytes Node.js heap used bytes
# TYPE nodejs_memory_heap_used_bytes gauge
nodejs_memory_heap_used_bytes ${process.memoryUsage().heapUsed}

# HELP nodejs_memory_heap_total_bytes Node.js heap total bytes
# TYPE nodejs_memory_heap_total_bytes gauge
nodejs_memory_heap_total_bytes ${process.memoryUsage().heapTotal}

# HELP nodejs_memory_rss_bytes Node.js RSS bytes
# TYPE nodejs_memory_rss_bytes gauge
nodejs_memory_rss_bytes ${process.memoryUsage().rss}

# HELP nodejs_cpu_load_average Node.js CPU load average
# TYPE nodejs_cpu_load_average gauge
nodejs_cpu_load_average{interval="1m"} ${cpu.loadAverage[0]}
nodejs_cpu_load_average{interval="5m"} ${cpu.loadAverage[1]}
nodejs_cpu_load_average{interval="15m"} ${cpu.loadAverage[2]}

# HELP bookmyshow_job_queue_total_jobs Total jobs in queue
# TYPE bookmyshow_job_queue_total_jobs gauge
bookmyshow_job_queue_total_jobs{status="queued"} ${jobStats.queued}
bookmyshow_job_queue_total_jobs{status="processing"} ${jobStats.processing}
bookmyshow_job_queue_total_jobs{status="completed"} ${jobStats.completed}
bookmyshow_job_queue_total_jobs{status="failed"} ${jobStats.failed}

# HELP bookmyshow_sse_active_connections Active SSE connections
# TYPE bookmyshow_sse_active_connections gauge
bookmyshow_sse_active_connections ${sseStats.connectedUsers}

# HELP bookmyshow_database_connected Database connection status
# TYPE bookmyshow_database_connected gauge
bookmyshow_database_connected ${dbState ? 1 : 0}

# HELP nodejs_uptime_seconds Node.js process uptime in seconds
# TYPE nodejs_uptime_seconds counter
nodejs_uptime_seconds ${process.uptime()}
`.trim();

    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  } catch (error) {
    res.status(500).send('Error generating metrics');
  }
};
