const mongoose = require('mongoose');

/**
 * Show Schema - Cinema showtimes for movies
 * 
 * DATABASE INDEXING STRATEGY:
 * 
 * 1. Primary Query Pattern: Find shows by movie, cinema, date, and time
 *    Index: { movie: 1, cinema: 1, date: 1, time: 1 }
 *    - Used for: Searching shows by movie in specific cinema on specific date
 *    - Type: Compound index (high cardinality fields)
 * 
 * 2. Secondary Query Pattern: Find all shows at a cinema on a date
 *    Index: { cinema: 1, date: 1 }
 *    - Used for: Cinema showtime listings
 *    - Type: Compound index
 * 
 * 3. Tertiary Query Pattern: Find shows by date/time range
 *    Index: { date: 1, time: 1 }
 *    - Used for: Time-based queries, upcoming shows
 *    - Type: Compound index (supports date range queries)
 * 
 * QUERY OPTIMIZATION HINTS:
 * - Always filter by date first (date has highest selectivity)
 * - Use .select() to limit returned fields
 * - For seat availability, only query when needed
 * - Consider caching popular show queries (e.g., today's shows)
 */

const showSchema = new mongoose.Schema({
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
  screen: {
    type: String,
    required: true
  },
  screenFormat: {
    type: String,
    enum: ['2D', '3D', 'IMAX', '4DX'],
    default: '2D'
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  availableSeats: {
    type: Number,
    required: true,
    default: 100
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 100
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  bookedSeats: [{
    row: String,
    number: Number
  }]
}, {
  timestamps: true
});

// === DATABASE INDEXES ===

// 1. Primary compound index for movie-cinema-date-time queries
// Query: "Find all screenings of Movie X at Cinema Y on Date Z"
showSchema.index({ movie: 1, cinema: 1, date: 1, time: 1 });

// 2. Cinema-date compound index for cinema showtimes
// Query: "What shows are at Cinema X today?"
showSchema.index({ cinema: 1, date: 1 });

// 3. Date-time compound index for time-based queries
// Query: "Find all shows after 7 PM today"
showSchema.index({ date: 1, time: 1 });

// 4. Index for finding shows by movie across all cinemas
// Query: "Where is Movie X playing today?"
showSchema.index({ movie: 1, date: 1 });

module.exports = mongoose.model('Show', showSchema);