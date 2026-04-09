const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getRecommendations,
  getSimilarMovies,
  getUserPreferences
} = require('../controllers/recommendationController');

// Get personalized recommendations (requires auth)
router.get('/', protect, getRecommendations);

// Get user preferences (requires auth)
router.get('/preferences', protect, getUserPreferences);

// Get similar movies to a specific movie (public)
router.get('/similar/:movieId', getSimilarMovies);

module.exports = router;
