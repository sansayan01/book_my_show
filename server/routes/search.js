const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  search,
  getSuggestions,
  getTrending,
  getRelated,
  getAnalytics
} = require('../controllers/searchController');

// Search movies and cinemas
router.get('/', search);

// Get search suggestions
router.get('/suggestions', getSuggestions);

// Get trending searches
router.get('/trending', getTrending);

// Get related searches
router.get('/related', getRelated);

// Get search analytics (admin only)
router.get('/analytics', protect, admin, getAnalytics);

module.exports = router;
