/**
 * Request/Response Logger Middleware
 * Logs detailed request and response information to file
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class RequestLogger {
  constructor() {
    this.logsDir = path.join(__dirname, '../../logs');
    this.ensureLogsDirectory();
    
    // Rotate log files daily
    this.currentDate = new Date().toISOString().split('T')[0];
    this.accessLogStream = null;
    this.errorLogStream = null;
    this.requestLogStream = null;
    
    this.initStreams();
  }

  ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  initStreams() {
    const dateStr = new Date().toISOString().split('T')[0];
    
    // Access log (summary)
    this.accessLogStream = fs.createWriteStream(
      path.join(this.logsDir, `access-${dateStr}.log`),
      { flags: 'a' }
    );
    
    // Error log (errors only)
    this.errorLogStream = fs.createWriteStream(
      path.join(this.logsDir, `errors-${dateStr}.log`),
      { flags: 'a' }
    );
    
    // Detailed request log
    this.requestLogStream = fs.createWriteStream(
      path.join(this.logsDir, `requests-${dateStr}.log`),
      { flags: 'a' }
    );
  }

  /**
   * Check and rotate logs if date changed
   */
  checkRotation() {
    const today = new Date().toISOString().split('T')[0];
    if (today !== this.currentDate) {
      this.currentDate = today;
      this.closeStreams();
      this.initStreams();
    }
  }

  closeStreams() {
    if (this.accessLogStream) this.accessLogStream.end();
    if (this.errorLogStream) this.errorLogStream.end();
    if (this.requestLogStream) this.requestLogStream.end();
  }

  /**
   * Format log entry as JSON
   */
  formatLog(data) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      ...data
    }) + '\n';
  }

  /**
   * Log access (method, url, status, duration)
   */
  logAccess(req, res, duration) {
    this.checkRotation();
    
    const entry = {
      type: 'access',
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      userId: req.user?.id || null
    };
    
    this.accessLogStream.write(this.formatLog(entry));
  }

  /**
   * Log detailed request information
   */
  logRequest(req, data = {}) {
    this.checkRotation();
    
    const entry = {
      type: 'request',
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      path: req.path,
      query: req.query,
      params: req.params,
      headers: {
        'content-type': req.get('content-type'),
        'user-agent': req.get('user-agent'),
        'accept': req.get('accept')
      },
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id || null,
      ...data
    };
    
    // Remove sensitive headers
    delete entry.headers['authorization'];
    delete entry.headers['cookie'];
    delete entry.headers['x-api-key'];
    
    // Truncate body if too large
    if (entry.body && JSON.stringify(entry.body).length > 1000) {
      entry.bodyPreview = JSON.stringify(entry.body).substring(0, 1000) + '...';
      delete entry.body;
    }
    
    this.requestLogStream.write(this.formatLog(entry));
  }

  /**
   * Log response information
   */
  logResponse(req, res, data = {}) {
    this.checkRotation();
    
    const entry = {
      type: 'response',
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      ...data
    };
    
    this.requestLogStream.write(this.formatLog(entry));
  }

  /**
   * Log error
   */
  logError(req, error) {
    this.checkRotation();
    
    const entry = {
      type: 'error',
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.errorCode || error.code
      },
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id || null
    };
    
    this.errorLogStream.write(this.formatLog(entry));
  }

  /**
   * Express middleware for request logging
   */
  middleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      
      // Log incoming request
      this.logRequest(req);
      
      // Capture response data
      const originalJson = res.json;
      res.json = (body) => {
        const duration = Date.now() - startTime;
        
        // Log access
        this.logAccess(req, res, duration);
        
        // Log response
        this.logResponse(req, res, {
          responseBody: typeof body === 'object' ? 
            (body.success !== undefined ? { success: body.success } : 'json') : 
            'unknown'
        });
        
        // Log error if status >= 400
        if (res.statusCode >= 400 && body && body.error) {
          this.logError(req, body.error);
        }
        
        return originalJson.call(res, body);
      };
      
      next();
    };
  }

  /**
   * Get recent logs
   */
  getRecentLogs(type = 'all', lines = 100) {
    const logs = [];
    const dateStr = this.currentDate;
    
    let file;
    switch (type) {
      case 'access':
        file = path.join(this.logsDir, `access-${dateStr}.log`);
        break;
      case 'errors':
        file = path.join(this.logsDir, `errors-${dateStr}.log`);
        break;
      case 'requests':
        file = path.join(this.logsDir, `requests-${dateStr}.log`);
        break;
      default:
        return { error: 'Specify access, errors, or requests' };
    }
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      const allLines = content.split('\n').filter(Boolean).slice(-lines);
      return allLines.map(line => JSON.parse(line));
    } catch (error) {
      return { error: `Cannot read logs: ${error.message}` };
    }
  }

  /**
   * Shutdown logger
   */
  shutdown() {
    this.closeStreams();
    console.log('[RequestLogger] Shutdown complete');
  }
}

// Singleton instance
const requestLogger = new RequestLogger();

module.exports = requestLogger;
