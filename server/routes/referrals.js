const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getMyCode,
  applyCode,
  getStats,
  getReferrals,
  getShareLink
} = require('../controllers/referralController');
const { validate, schemas } = require('../validators');

const router = express.Router();

router.get('/code', protect, getMyCode);
router.post('/apply', protect, validate(schemas.applyReferral), applyCode);
router.get('/stats', protect, getStats);
router.get('/share', protect, getShareLink);
router.get('/', protect, getReferrals);

module.exports = router;
