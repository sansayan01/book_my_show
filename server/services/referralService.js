/**
 * Referral Service
 */
const crypto = require('crypto');
const User = require('../models/User');
const { Referral, UserReferralCode } = require('../models/Referral');
const walletService = require('./walletService');
const notificationService = require('./notificationService');

class ReferralService {
  /**
   * Generate a unique referral code
   */
  generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `BMS${code}`;
  }

  /**
   * Create referral code for user
   */
  async createReferralCode(userId) {
    let existing = await UserReferralCode.findOne({ user: userId });
    if (existing) return existing;

    const code = this.generateCode();
    const referralCode = await UserReferralCode.create({
      user: userId,
      code,
      isActive: true
    });
    return referralCode;
  }

  /**
   * Get user's referral code
   */
  async getReferralCode(userId) {
    return UserReferralCode.findOne({ user: userId });
  }

  /**
   * Apply referral code during registration
   */
  async applyReferral(newUserId, referralCode) {
    const refCode = await UserReferralCode.findOne({ code: referralCode.toUpperCase() });
    if (!refCode || !refCode.isActive) {
      throw new Error('Invalid referral code');
    }

    if (refCode.user.toString() === newUserId.toString()) {
      throw new Error('Cannot use your own referral code');
    }

    if (refCode.usageCount >= refCode.maxUses) {
      throw new Error('Referral code usage limit reached');
    }

    // Check if already referred
    const existingRef = await Referral.findOne({ referredUser: newUserId });
    if (existingRef) {
      throw new Error('Referral already applied');
    }

    // Create referral record
    await Referral.create({
      referrer: refCode.user,
      referredUser: newUserId,
      referralCode: refCode.code,
      status: 'pending'
    });

    // Increment usage count
    refCode.usageCount += 1;
    await refCode.save();

    // Give ₹25 signup bonus to referred user
    await walletService.credit(newUserId, 25, 'Referral signup bonus', refCode._id, 'referral_bonus');
    await notificationService.send(newUserId, 'referral_reward', 'Referral Bonus! 🎉',
      `You received ₹25 as a signup bonus for using a referral code!`);

    return { success: true, message: 'Referral code applied successfully' };
  }

  /**
   * Award referrer when referred user completes first booking
   */
  async awardOnFirstBooking(newUserId, bookingAmount) {
    const referral = await Referral.findOne({ referredUser: newUserId, status: 'pending' });
    if (!referral) return;

    const refCode = await UserReferralCode.findOne({ code: referral.referralCode });
    if (!refCode) return;

    // Award ₹50 to referrer
    await walletService.credit(referral.referrer, refCode.rewardAmount, 
      `Referral bonus for ${refCode.code}`, newUserId, 'referral_bonus');

    // Update referral
    referral.status = 'completed';
    referral.rewardClaimed = true;
    referral.completedAt = new Date();
    await referral.save();

    // Update referrer stats
    refCode.totalRewardsEarned += refCode.rewardAmount;
    await refCode.save();

    // Notify referrer
    const referredUser = await User.findById(newUserId);
    await notificationService.sendReferralReward(
      referral.referrer,
      refCode.rewardAmount,
      referredUser?.name || 'your friend'
    );

    return referral;
  }

  /**
   * Get referral stats for user
   */
  async getReferralStats(userId) {
    const [code, referrals] = await Promise.all([
      UserReferralCode.findOne({ user: userId }),
      Referral.find({ referrer: userId })
    ]);

    const pending = referrals.filter(r => r.status === 'pending').length;
    const completed = referrals.filter(r => r.status === 'completed').length;

    return {
      code: code?.code || null,
      totalReferrals: referrals.length,
      pendingReferrals: pending,
      completedReferrals: completed,
      totalRewardsEarned: code?.totalRewardsEarned || 0,
      maxUses: code?.maxUses || 10,
      usageCount: code?.usageCount || 0
    };
  }

  /**
   * Get referrals list for user
   */
  async getReferrals(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [referrals, total] = await Promise.all([
      Referral.find({ referrer: userId })
        .populate('referredUser', 'name email createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Referral.countDocuments({ referrer: userId })
    ]);

    return { referrals, total, page, limit, pages: Math.ceil(total / limit) };
  }
}

module.exports = new ReferralService();
