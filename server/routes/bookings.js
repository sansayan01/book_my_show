const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { 
  lockSeats,
  releaseSeats,
  createBooking, 
  getBooking, 
  getUserBookings,
  cancelBooking,
  verifyBooking,
  downloadTicket
} = require('../controllers/bookingController');
const { validate } = require('../middleware/validate');

const router = express.Router();

/**
 * @route   /api/v1/bookings
 * @desc    Booking routes with WebSocket seat updates
 * @access  Private (most endpoints)
 * @version v1
 * @note    Uses compound indexes on (user, createdAt) for user bookings
 *          Uses index on ticketCode for verification
 *          Uses index on status for admin queries
 */

// Validation rules for seat locking
const lockSeatsValidation = [
  body('showId').notEmpty().withMessage('Show ID is required'),
  body('seats').isArray({ min: 1 }).withMessage('At least one seat is required'),
  body('seats.*.row').notEmpty().withMessage('Seat row is required'),
  body('seats.*.number').isNumeric().withMessage('Seat number is required'),
  body('sessionId').optional().isString().withMessage('Session ID must be a string')
];

// Validation rules for creating booking
const createBookingValidation = [
  body('showId').notEmpty().withMessage('Show ID is required'),
  body('seats').isArray({ min: 1 }).withMessage('At least one seat is required'),
  body('seats.*.row').notEmpty().withMessage('Seat row is required'),
  body('seats.*.number').isNumeric().withMessage('Seat number is required'),
  body('sessionId').optional().isString().withMessage('Session ID must be a string')
];

// Public endpoints
router.get('/verify/:ticketCode', verifyBooking);

// Protected endpoints
router.get('/', protect, getUserBookings);
router.get('/:id', protect, getBooking);

// Seat locking endpoints
router.post('/lock-seats', protect, lockSeatsValidation, validate, lockSeats);
router.post('/release-seats', protect, releaseSeats);

// Booking endpoints
router.post('/', protect, createBookingValidation, validate, createBooking);
router.post('/:id/cancel', protect, cancelBooking);
router.get('/:id/ticket.pdf', protect, downloadTicket);

module.exports = router;