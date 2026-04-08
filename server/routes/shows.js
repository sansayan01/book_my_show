const express = require('express');
const { getShows, getShow, getShowtimesByMovieAndCinema } = require('../controllers/showController');

const router = express.Router();

router.get('/theatres', getShowtimesByMovieAndCinema);
router.get('/:id', getShow);
router.get('/', getShows);

module.exports = router;