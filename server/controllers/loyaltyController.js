/**
 * Loyalty Controller
 */
const loyaltyService = require('../services/loyaltyService');

// @desc    Get loyalty account
// @route   GET /api/v1/loyalty
// @access  Private
exports.getAccount = async (req, res, next) => {
  try {
    const account = await loyaltyService.getAccount(req.user.id);

    res.status(200).json({
      success: true,
      data: account
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Redeem points
// @route   POST /api/v1/loyalty/redeem
// @access  Private
exports.redeemPoints = async (req, res, next) => {
  try {
    const { points } = req.body;

    if (!points || points < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum redemption is 100 points'
      });
    }

    const result = await loyaltyService.redeemPoints(req.user.id, points);

    res.status(200).json({
      success: true,
      message: `${points} points redeemed successfully`,
      data: result
    });
  } catch (error) {
    if (error.message === 'Insufficient points') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/v1/loyalty/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const leaderboard = await loyaltyService.getLeaderboard(parseInt(limit));

    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tier benefits
// @route   GET /api/v1/loyalty/benefits
// @access  Public
exports.getBenefits = async (req, res, next) => {
  try {
    const benefits = {
      Bronze: {
        discount: '5%',
        birthdayBonus: '50 points',
        features: ['5% off on bookings', 'Birthday bonus: 50 points']
      },
      Silver: {
        discount: '7%',
        birthdayBonus: '100 points',
        features: ['7% off on bookings', 'Priority support', 'Birthday bonus: 100 points', 'Early access to movies']
      },
      Gold: {
        discount: '10%',
        birthdayBonus: '200 points',
        features: ['10% off on bookings', 'Priority support', 'Birthday bonus: 200 points', 'Early access', 'Free popcorn on select bookings']
      },
      Platinum: {
        discount: '15%',
        birthdayBonus: '500 points',
        features: ['15% off on bookings', 'Dedicated support', 'Birthday bonus: 500 points', 'VIP screenings', 'Free upgrades']
      },
      Diamond: {
        discount: '20%',
        birthdayBonus: '1000 points',
        features: ['20% off on bookings', 'Dedicated concierge', 'Birthday bonus: 1000 points', 'All Platinum benefits', 'Free lifetime upgrades']
      }
    };

    res.status(200).json({ success: true, data: benefits });
  } catch (error) {
    next(error);
  }
};
