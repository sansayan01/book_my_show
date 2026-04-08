const express = require('express');
const { getCinemas, getCinema, getCities } = require('../controllers/cinemaController');

const router = express.Router();

router.get('/cities', getCities);
router.get('/:id', getCinema);
router.get('/', getCinemas);

module.exports = router;