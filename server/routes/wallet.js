const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getWallet,
  topUp,
  transfer,
  getTransactions,
  useForBooking
} = require('../controllers/walletController');
const { validate, schemas } = require('../utils/validationSchemas');

const router = express.Router();

router.get('/', protect, getWallet);
router.post('/topup', protect, validate(schemas.walletTopUp), topUp);
router.post('/transfer', protect, validate(schemas.walletTransfer), transfer);
router.post('/use', protect, validate(schemas.pagination), useForBooking);
router.get('/transactions', protect, getTransactions);

module.exports = router;
