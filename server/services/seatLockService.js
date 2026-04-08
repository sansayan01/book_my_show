const mongoose = require('mongoose');

// In-memory store for seat locks (use Redis in production)
const seatLocks = new Map();

/**
 * Seat Lock Service
 * Prevents double booking by temporarily locking seats during checkout
 */
class SeatLockService {
  constructor() {
    // Clean up expired locks every 30 seconds
    setInterval(() => this.cleanupExpiredLocks(), 30000);
  }

  /**
   * Generate lock key for a show
   */
  getLockKey(showId) {
    return `seat_lock:${showId}`;
  }

  /**
   * Lock seats for a show (e.g., during checkout process)
   * @param {string} showId - Show ID
   * @param {Array} seats - Array of {row, number} objects
   * @param {string} sessionId - Unique session identifier
   * @param {number} durationMs - Lock duration in milliseconds (default 5 minutes)
   */
  async lockSeats(showId, seats, sessionId, durationMs = 5 * 60 * 1000) {
    const lockKey = this.getLockKey(showId);
    const lockExpiry = Date.now() + durationMs;

    // Get existing locks for this show
    let showLocks = seatLocks.get(lockKey) || [];

    // Check if any seats are already locked by another session
    const lockedSeats = showLocks
      .filter(lock => lock.expiry > Date.now() && lock.sessionId !== sessionId)
      .flatMap(lock => lock.seats);

    for (const seat of seats) {
      const isLocked = lockedSeats.some(
        locked => locked.row === seat.row && locked.number === seat.number
      );
      if (isLocked) {
        throw new Error(`Seat ${seat.row}${seat.number} is being selected by another user`);
      }
    }

    // Remove any expired locks from this session
    showLocks = showLocks.filter(lock => 
      lock.sessionId !== sessionId || lock.expiry > Date.now()
    );

    // Add new lock
    showLocks.push({
      sessionId,
      seats,
      expiry: lockExpiry,
      lockedAt: Date.now()
    });

    seatLocks.set(lockKey, showLocks);

    return {
      success: true,
      lockedUntil: new Date(lockExpiry).toISOString(),
      seats: seats.map(s => `${s.row}${s.number}`)
    };
  }

  /**
   * Release locks for a session
   */
  async releaseSeats(showId, sessionId) {
    const lockKey = this.getLockKey(showId);
    const showLocks = seatLocks.get(lockKey) || [];
    
    const updatedLocks = showLocks.filter(lock => lock.sessionId !== sessionId);
    seatLocks.set(lockKey, updatedLocks);

    return { success: true };
  }

  /**
   * Check if seats are locked
   */
  checkLockedSeats(showId, seats, sessionId) {
    const lockKey = this.getLockKey(showId);
    const showLocks = seatLocks.get(lockKey) || [];
    
    const activeLocks = showLocks.filter(lock => lock.expiry > Date.now());
    
    for (const seat of seats) {
      const isLocked = activeLocks.some(
        lock => lock.sessionId !== sessionId &&
        lock.seats.some(s => s.row === seat.row && s.number === seat.number)
      );
      if (isLocked) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get lock status for a show
   */
  getLockStatus(showId) {
    const lockKey = this.getLockKey(showId);
    const showLocks = seatLocks.get(lockKey) || [];
    const activeLocks = showLocks.filter(lock => lock.expiry > Date.now());

    return {
      activeLocks: activeLocks.length,
      lockedSeats: activeLocks.flatMap(lock => lock.seats).map(s => `${s.row}${s.number}`)
    };
  }

  /**
   * Cleanup expired locks
   */
  cleanupExpiredLocks() {
    const now = Date.now();
    for (const [key, locks] of seatLocks) {
      const validLocks = locks.filter(lock => lock.expiry > now);
      if (validLocks.length === 0) {
        seatLocks.delete(key);
      } else {
        seatLocks.set(key, validLocks);
      }
    }
  }
}

module.exports = new SeatLockService();