/**
 * API Usage Analytics Service
 * Tracks API usage patterns, response times, and error rates
 */

class APIAnalyticsService {
  constructor() {
    this.stats = {
      totalRequests: 0,
      totalResponseTime: 0,
      errorCount: 0,
      requestsByEndpoint: {},
      requestsByMethod: {},
      requestsByIP: {},
      responseTimeHistory: [],
      lastMinuteRequests: [],
      startTime: Date.now()
    };
    
    // Cleanup old data every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Record an API request
   */
  recordRequest(req, res, responseTime) {
    const endpoint = `${req.method} ${req.route?.path || req.path}`;
    const ip = req.ip || req.connection.remoteAddress;
    
    this.stats.totalRequests++;
    this.stats.totalResponseTime += responseTime;
    this.stats.lastMinuteRequests.push(Date.now());
    
    // Track by endpoint
    if (!this.stats.requestsByEndpoint[endpoint]) {
      this.stats.requestsByEndpoint[endpoint] = {
        count: 0,
        totalResponseTime: 0,
        errors: 0
      };
    }
    this.stats.requestsByEndpoint[endpoint].count++;
    this.stats.requestsByEndpoint[endpoint].totalResponseTime += responseTime;
    
    // Track by method
    this.stats.requestsByMethod[req.method] = (this.stats.requestsByMethod[req.method] || 0) + 1;
    
    // Track by IP (for rate limiting insights)
    if (!this.stats.requestsByIP[ip]) {
      this.stats.requestsByIP[ip] = { count: 0, endpoints: {} };
    }
    this.stats.requestsByIP[ip].count++;
    if (!this.stats.requestsByIP[ip].endpoints[endpoint]) {
      this.stats.requestsByIP[ip].endpoints[endpoint] = 0;
    }
    this.stats.requestsByIP[ip].endpoints[endpoint]++;
    
    // Track response time history (keep last 1000)
    this.stats.responseTimeHistory.push({ time: Date.now(), duration: responseTime });
    if (this.stats.responseTimeHistory.length > 1000) {
      this.stats.responseTimeHistory.shift();
    }
    
    // Track errors
    if (res.statusCode >= 400) {
      this.stats.errorCount++;
      this.stats.requestsByEndpoint[endpoint].errors++;
    }
  }

  /**
   * Record an error
   */
  recordError(req, error) {
    const endpoint = `${req.method} ${req.route?.path || req.path}`;
    this.stats.errorCount++;
    
    if (this.stats.requestsByEndpoint[endpoint]) {
      this.stats.requestsByEndpoint[endpoint].errors++;
    }
  }

  /**
   * Get analytics stats
   */
  getStats() {
    const requestsPerMinute = this.getRequestsPerMinute();
    const avgResponseTime = this.getAverageResponseTime();
    const errorRate = this.getErrorRate();
    const topEndpoints = this.getTopEndpoints(10);
    
    return {
      totalRequests: this.stats.totalRequests,
      avgResponseTime,
      requestsPerMinute,
      errorRate,
      topEndpoints,
      requestsByMethod: this.stats.requestsByMethod,
      uptime: Date.now() - this.stats.startTime
    };
  }

  /**
   * Get requests per minute
   */
  getRequestsPerMinute() {
    const oneMinuteAgo = Date.now() - 60000;
    const recentRequests = this.stats.lastMinuteRequests.filter(t => t > oneMinuteAgo);
    return recentRequests.length;
  }

  /**
   * Get average response time
   */
  getAverageResponseTime() {
    if (this.stats.totalRequests === 0) return 0;
    return Math.round(this.stats.totalResponseTime / this.stats.totalRequests);
  }

  /**
   * Get error rate
   */
  getErrorRate() {
    if (this.stats.totalRequests === 0) return 0;
    return parseFloat(((this.stats.errorCount / this.stats.totalRequests) * 100).toFixed(2));
  }

  /**
   * Get top endpoints by usage
   */
  getTopEndpoints(limit = 10) {
    return Object.entries(this.stats.requestsByEndpoint)
      .map(([path, data]) => ({
        path,
        count: data.count,
        avgResponseTime: Math.round(data.totalResponseTime / data.count),
        errorRate: data.count > 0 ? parseFloat(((data.errors / data.count) * 100).toFixed(2)) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get analytics for a specific IP
   */
  getIPAnalytics(ip) {
    return this.stats.requestsByIP[ip] || { count: 0, endpoints: {} };
  }

  /**
   * Cleanup old data
   */
  cleanup() {
    const oneMinuteAgo = Date.now() - 60000;
    this.stats.lastMinuteRequests = this.stats.lastMinuteRequests.filter(t => t > oneMinuteAgo);
    
    // Remove stale IP data (no requests in 1 hour)
    const oneHourAgo = Date.now() - 3600000;
    Object.keys(this.stats.requestsByIP).forEach(ip => {
      // Keep IP data for rate limiting insights
    });
  }

  /**
   * Reset all stats
   */
  reset() {
    this.stats = {
      totalRequests: 0,
      totalResponseTime: 0,
      errorCount: 0,
      requestsByEndpoint: {},
      requestsByMethod: {},
      requestsByIP: {},
      responseTimeHistory: [],
      lastMinuteRequests: [],
      startTime: Date.now()
    };
  }

  /**
   * Get full stats (for internal use)
   */
  getFullStats() {
    return { ...this.stats };
  }
}

// Export singleton instance
module.exports = new APIAnalyticsService();
