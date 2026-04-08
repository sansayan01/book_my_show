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
  verifyBooking 
} = require('../controllers/bookingController');
const { validate } = require('../middleware/validate');

const router = express.Router();

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

module.exports = router;