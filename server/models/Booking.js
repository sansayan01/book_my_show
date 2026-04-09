const mongoose = require('mongoose');

/**
 * Booking Schema - Movie ticket bookings
 * 
 * DATABASE INDEXING STRATEGY:
 * 
 * 1. Primary Query Pattern: Get user's booking history (paginated)
 *    Index: { user: 1, createdAt: -1 }
 *    - Used for: User dashboard, booking history
 *    - Type: Compound index (descending for recent first)
 * 
 * 2. Secondary Query Pattern: Verify booking by ticket code
 *    Index: { ticketCode: 1 } (unique)
 *    - Used for: QR code verification at venue
 *    - Type: Unique index
 * 
 * 3. Tertiary Query Pattern: Find bookings by status
 *    Index: { status: 1 }
 *    - Used for: Admin dashboards, reporting
 *    - Type: Single field index
 * 
 * 4. Additional Query Pattern: Find bookings by show
 *    Index: { show: 1, createdAt: -1 }
 *    - Used for: Show-specific reports, analytics
 * 
 * QUERY OPTIMIZATION HINTS:
 * - Always include user ID in queries (security + performance)
 * - Use projection to limit fields when full doc not needed
 * - For analytics, use aggregation with $match first
 * - Consider covering indexes for ticket verification queries
 */

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    // index covered by compound index { user: 1, createdAt: -1 }
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true
    // index covered by compound index { show: 1, createdAt: -1 }
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  cinema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  seats: [{
    row: String,
    number: Number,
    category: {
      type: String,
      enum: ['Standard', 'Premium', 'VIP'],
      default: 'Standard'
    },
    price: Number
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'expired'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    sparse: true  // Sparse index for optional field
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet'],
    default: 'card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  ticketCode: {
    type: String,
    unique: true
  },
  showDate: {
    type: Date,
    required: true
  },
  showTime: {
    type: String,
    required: true
  },
  screenName: {
    type: String,
    required: true
  },
  // Refund tracking
  refundAmount: {
    type: Number
  },
  refundPercentage: {
    type: Number
  },
  cancellationTime: {
    type: Date
  }
}, {
  timestamps: true
});

// === DATABASE INDEXES ===

// 1. Primary compound index for user booking history
// Query: "Get recent bookings for user X"
bookingSchema.index({ user: 1, createdAt: -1 });

// 2. Status index for admin/reporting queries
// Query: "Find all cancelled bookings"
bookingSchema.index({ status: 1 });

// 4. Show-index for analytics and reports
// Query: "Bookings for show X"
bookingSchema.index({ show: 1, createdAt: -1 });

// 5. Show date index for date-based reporting
// Query: "All bookings for today"
bookingSchema.index({ showDate: 1, createdAt: -1 });

// 6. Partial index for expired bookings cleanup (handled by cron)
// Query: "Find expired pending bookings older than 30 min"
// Note: Implemented in application code via cron job

// Generate ticket code before saving
bookingSchema.pre('save', async function(next) {
  if (!this.ticketCode) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.ticketCode = `BMS-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);