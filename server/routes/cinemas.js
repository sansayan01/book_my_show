const express = require('express');
const { getCinemas, getCinema, getCities, getNearbyCinemas } = require('../controllers/cinemaController');

const router = express.Router();

router.get('/cities', getCities);
router.get('/nearby', getNearbyCinemas);
router.get('/:id', getCinema);
router.get('/', getCinemas);

module.exports = router;