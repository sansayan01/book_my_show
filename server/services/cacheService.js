/**
 * In-Memory Cache Service
 * Provides caching layer for frequently accessed data with TTL support
 */

class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default
    this.maxSize = 1000;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      clears: 0
    };
    
    // Start cleanup interval
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Generate cache key
   * @param {string} prefix - Key prefix (e.g., 'movie', 'show')
   * @param {string|object} identifier - Key identifier
   */
  generateKey(prefix, identifier) {
    if (typeof identifier === 'object') {
      identifier = JSON.stringify(identifier);
    }
    return `${prefix}:${identifier}`;
  }

  /**
   * Set item in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl = this.defaultTTL) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const expiresAt = Date.now() + ttl;
    this.cache.set(key, {
      value,
      expiresAt,
      createdAt: Date.now()
    });
    
    this.stats.sets++;
    return true;
  }

  /**
   * Get item from cache
   * @param {string} key - Cache key
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value;
  }

  /**
   * Check if key exists and is not expired
   * @param {string} key - Cache key
   */
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Delete item from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) this.stats.deletes++;
    return deleted;
  }

  /**
   * Delete keys matching pattern
   * @param {string} pattern - Key pattern (e.g., 'movie:*')
   */
  deletePattern(pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    let count = 0;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    this.stats.deletes += count;
    return count;
  }

  /**
   * Clear all cache
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.stats.clears++;
    return size;
  }

  /**
   * Cleanup expired entries
   */
  cleanup() {
    const now = Date.now();
    let count = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        count++;
      }
    }
    
    if (count > 0) {
      console.log(`[Cache] Cleaned up ${count} expired entries`);
    }
    
    return count;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2)
      : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: `${hitRate}%`,
      stats: { ...this.stats }
    };
  }

  /**
   * Cache with automatic key generation
   * @param {string} prefix - Key prefix
   * @param {string|object} identifier - Key identifier
   * @param {Function} fetchFn - Function to fetch data if not cached
   * @param {number} ttl - TTL in milliseconds
   */
  async remember(prefix, identifier, fetchFn, ttl = this.defaultTTL) {
    const key = this.generateKey(prefix, identifier);
    
    // Try cache first
    const cached = this.get(key);
    if (cached !== null) {
      return { data: cached, fromCache: true };
    }
    
    // Fetch fresh data
    const data = await fetchFn();
    this.set(key, data, ttl);
    return { data, fromCache: false };
  }

  /**
   * Preload cache with data
   * @param {string} prefix - Key prefix
   * @param {Array} items - Array of items with id property
   * @param {number} ttl - TTL in milliseconds
   */
  preload(prefix, items, ttl = this.defaultTTL) {
    let count = 0;
    for (const item of items) {
      if (item._id || item.id) {
        const key = this.generateKey(prefix, item._id || item.id);
        this.set(key, item, ttl);
        count++;
      }
    }
    console.log(`[Cache] Preloaded ${count} ${prefix} items`);
    return count;
  }

  /**
   * Shutdown cache service
   */
  shutdown() {
    clearInterval(this.cleanupInterval);
    this.clear();
    console.log('[Cache] Service shutdown complete');
  }
}

// Singleton instance
const cacheService = new CacheService();

module.exports = cacheService;
