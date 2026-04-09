const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getAccount,
  redeemPoints,
  getLeaderboard,
  getBenefits
} = require('../controllers/loyaltyController');

const router = express.Router();

router.get('/', protect, getAccount);
router.post('/redeem', protect, redeemPoints);
router.get('/leaderboard', getLeaderboard);
router.get('/benefits', getBenefits);

module.exports = router;
