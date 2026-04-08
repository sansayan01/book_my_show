const express = require('express');
const {
  getPopularMovies,
  getTopCinemas,
  getDashboardStats,
  getRevenueAnalytics,
  getShowsAnalytics
} = require('../controllers/analyticsController');

const router = express.Router();

// Public analytics endpoints
router.get('/popular-movies', getPopularMovies);
router.get('/top-cinemas', getTopCinemas);
router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenueAnalytics);
router.get('/shows', getShowsAnalytics);

module.exports = router;