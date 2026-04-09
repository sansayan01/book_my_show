const express = require('express');
const { body } = require('express-validator');
const { protect, admin } = require('../middleware/auth');
const paymentService = require('../services/paymentService');

const router = express.Router();

// @desc    Create payment order
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, async (req, res, next) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount'
      });
    }

    const order = await paymentService.createOrder(amount, currency, {
      receipt,
      notes: notes || {}
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Verify payment signature
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, async (req, res, next) => {
  try {
    const { paymentId, orderId, signature } = req.body;

    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Please provide paymentId, orderId, and signature'
      });
    }

    const isValid = paymentService.verifySignature(paymentId, orderId, signature);

    res.status(200).json({
      success: true,
      data: { valid: isValid }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
router.post('/process', protect, async (req, res, next) => {
  try {
    const { orderId, paymentDetails } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide order ID'
      });
    }

    const payment = await paymentService.processPayment(orderId, paymentDetails);

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Refund payment
// @route   POST /api/payments/refund
// @access  Private (Admin only in production)
router.post('/refund', protect, async (req, res, next) => {
  try {
    const { paymentId, amount, reason } = req.body;

    if (!paymentId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide paymentId and amount'
      });
    }

    const refund = await paymentService.refundPayment(paymentId, amount, reason);

    res.status(200).json({
      success: true,
      data: refund
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;