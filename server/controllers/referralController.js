/**
 * Referral Controller
 */
const referralService = require('../services/referralService');

// @desc    Get user's referral code
// @route   GET /api/v1/referrals/code
// @access  Private
exports.getMyCode = async (req, res, next) => {
  try {
    let code = await referralService.getReferralCode(req.user.id);

    if (!code) {
      code = await referralService.createReferralCode(req.user.id);
    }

    res.status(200).json({
      success: true,
      data: { code: code.code }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply referral code
// @route   POST /api/v1/referrals/apply
// @access  Private
exports.applyCode = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Referral code is required'
      });
    }

    const result = await referralService.applyReferral(req.user.id, code);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message.includes('Invalid') || error.message.includes('Cannot') || error.message.includes('already') || error.message.includes('limit')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get referral stats
// @route   GET /api/v1/referrals/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const stats = await referralService.getReferralStats(req.user.id);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get referrals list
// @route   GET /api/v1/referrals
// @access  Private
exports.getReferrals = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await referralService.getReferrals(req.user.id, parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Share referral (generate shareable link)
// @route   GET /api/v1/referrals/share
// @access  Private
exports.getShareLink = async (req, res, next) => {
  try {
    let code = await referralService.getReferralCode(req.user.id);

    if (!code) {
      code = await referralService.createReferralCode(req.user.id);
    }

    const shareLink = `${process.env.FRONTEND_URL || 'https://bookmyshow.com'}/auth/register?ref=${code.code}`;
    const shareText = `Book movie tickets on BookMyShow! Use my referral code ${code.code} to get ₹25 off on your first booking!`;

    res.status(200).json({
      success: true,
      data: {
        code: code.code,
        shareLink,
        shareText,
        rewardsPerReferral: 50
      }
    });
  } catch (error) {
    next(error);
  }
};
