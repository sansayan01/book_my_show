const express = require('express');
const { 
  getMovies, 
  getMovie, 
  getMovieBySlug,
  getFeaturedMovies,
  getUpcomingMovies 
} = require('../controllers/movieController');

const router = express.Router();

router.get('/featured', getFeaturedMovies);
router.get('/upcoming', getUpcomingMovies);
router.get('/slug/:slug', getMovieBySlug);
router.get('/:id', getMovie);
router.get('/', getMovies);

module.exports = router;