const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  exportData,
  exportBookings,
  exportRevenue,
  exportUsers
} = require('../controllers/exportController');

const router = express.Router();

router.get('/', protect, admin, exportData);
router.get('/bookings', protect, admin, exportBookings);
router.get('/revenue', protect, admin, exportRevenue);
router.get('/users', protect, admin, exportUsers);

module.exports = router;
