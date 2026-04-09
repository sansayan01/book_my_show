const express = require('express');
const { body } = require('express-validator');
const { protect, admin } = require('../middleware/auth');
const {
  createMovie,
  updateMovie,
  deleteMovie,
  createCinema,
  updateCinema,
  deleteCinema,
  createShow,
  updateShow,
  deleteShow,
  getAllBookings,
  cancelBookingAdmin,
  getDashboardStats
} = require('../controllers/adminController');

const router = express.Router();

// Apply admin middleware to all routes
router.use(protect, admin);

// ==================== MOVIE ROUTES ====================

// Movie validation
const movieValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('poster').trim().notEmpty().withMessage('Poster URL is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('language').isIn(['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Punjabi', 'Bengali']).withMessage('Invalid language')
];

router.post('/movies', movieValidation, createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

// ==================== CINEMA ROUTES ====================

// Cinema validation
const cinemaValidation = [
  body('name').trim().notEmpty().withMessage('Cinema name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').isIn(['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']).withMessage('Invalid city'),
  body('location').trim().notEmpty().withMessage('Location is required')
];

router.post('/cinemas', cinemaValidation, createCinema);
router.put('/cinemas/:id', updateCinema);
router.delete('/cinemas/:id', deleteCinema);

// ==================== SHOW ROUTES ====================

// Show validation
const showValidation = [
  body('movie').isMongoId().withMessage('Invalid movie ID'),
  body('cinema').isMongoId().withMessage('Invalid cinema ID'),
  body('screen').trim().notEmpty().withMessage('Screen name is required'),
  body('date').isISO8601().withMessage('Invalid date'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
  body('duration').isInt({ min: 30 }).withMessage('Duration must be at least 30 minutes'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('totalSeats').optional().isInt({ min: 1 }).withMessage('Total seats must be at least 1')
];

router.post('/shows', showValidation, createShow);
router.put('/shows/:id', updateShow);
router.delete('/shows/:id', deleteShow);

// ==================== BOOKING ROUTES ====================

router.get('/bookings', getAllBookings);
router.post('/bookings/:id/cancel', cancelBookingAdmin);

// ==================== DASHBOARD ====================

router.get('/dashboard', getDashboardStats);

module.exports = router;