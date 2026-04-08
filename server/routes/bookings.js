const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { 
  createBooking, 
  getBooking, 
  getUserBookings,
  cancelBooking,
  verifyBooking 
} = require('../controllers/bookingController');

const router = express.Router();

// Validation rules
const createBookingValidation = [
  body('showId').notEmpty().withMessage('Show ID is required'),
  body('seats').isArray({ min: 1 }).withMessage('At least one seat is required'),
  body('seats.*.row').notEmpty().withMessage('Seat row is required'),
  body('seats.*.number').isNumeric().withMessage('Seat number is required')
];

router.get('/verify/:ticketCode', verifyBooking);
router.get('/', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.post('/', protect, createBookingValidation, createBooking);
router.post('/:id/cancel', protect, cancelBooking);

module.exports = router;