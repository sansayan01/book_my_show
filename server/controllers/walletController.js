/**
 * Wallet Controller
 */
const Wallet = require('../models/Wallet');
const walletService = require('../services/walletService');
const { protect } = require('../middleware/auth');

// @desc    Get wallet balance
// @route   GET /api/v1/wallet
// @access  Private
exports.getWallet = async (req, res, next) => {
  try {
    const balance = await walletService.getBalance(req.user.id);
    res.status(200).json({ success: true, data: balance });
  } catch (error) {
    next(error);
  }
};

// @desc    Top up wallet
// @route   POST /api/v1/wallet/topup
// @access  Private
exports.topUp = async (req, res, next) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (!amount || amount < 10) {
      return res.status(400).json({
        success: false,
        message: 'Minimum top-up amount is ₹10'
      });
    }

    // In production, integrate with payment gateway here
    // For mock, directly credit the wallet
    const wallet = await walletService.credit(
      req.user.id,
      amount,
      `Wallet top-up via ${paymentMethod || 'card'}`,
      null,
      'wallet_topup'
    );

    res.status(200).json({
      success: true,
      message: `₹${amount} credited to wallet successfully`,
      data: {
        balance: wallet.balance,
        bonusBalance: wallet.bonusBalance,
        total: wallet.balance + wallet.bonusBalance,
        amount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Transfer to another user
// @route   POST /api/v1/wallet/transfer
// @access  Private
exports.transfer = async (req, res, next) => {
  try {
    const { toUserId, amount, note } = req.body;

    const result = await walletService.transfer(req.user.id, toUserId, amount, note);

    res.status(200).json({
      success: true,
      message: `₹${amount} transferred successfully`,
      data: result
    });
  } catch (error) {
    if (error.message.includes('Insufficient') || error.message.includes('Minimum') || error.message.includes('Cannot')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get transaction history
// @route   GET /api/v1/wallet/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await walletService.getTransactions(req.user.id, parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Use wallet balance for booking
// @route   POST /api/v1/wallet/use
// @access  Private
exports.useForBooking = async (req, res, next) => {
  try {
    const { amount, bookingId } = req.body;

    const wallet = await walletService.debit(
      req.user.id,
      amount,
      'Booking payment',
      bookingId,
      'booking'
    );

    res.status(200).json({
      success: true,
      message: `₹${amount} deducted from wallet`,
      data: {
        balance: wallet.balance,
        bonusBalance: wallet.bonusBalance,
        total: wallet.balance + wallet.bonusBalance
      }
    });
  } catch (error) {
    if (error.message === 'Insufficient wallet balance') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};
