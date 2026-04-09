const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { 
  getMovies, 
  getMovie, 
  getMovieBySlug,
  getFeaturedMovies,
  getUpcomingMovies,
  addReview,
  updateReview,
  deleteReview,
  getMovieReviews
} = require('../controllers/movieController');

const router = express.Router();

/**
 * @route   /api/v1/movies
 * @desc    Movie routes with caching support
 * @access  Public/Private
 * @version v1
 */

// Validation for reviews
const reviewValidation = [
  body('rating').isInt({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
  body('review').optional().isLength({ max: 1000 }).withMessage('Review cannot exceed 1000 characters')
];

// Query optimization: Use index on featured, upcoming, and use pagination
router.get('/featured', getFeaturedMovies);
router.get('/upcoming', getUpcomingMovies);
router.get('/slug/:slug', getMovieBySlug);
router.get('/:id/reviews', getMovieReviews);
router.post('/:id/reviews', protect, reviewValidation, addReview);
router.put('/:id/reviews', protect, reviewValidation, updateReview);
router.delete('/:id/reviews', protect, deleteReview);
router.get('/:id', getMovie);
router.get('/', getMovies);

module.exports = router;