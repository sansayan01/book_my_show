/**
 * Loyalty Points Service
 */
const { LoyaltyPoints, TIER_THRESHOLDS, POINTS_PER_RUPEE } = require('../models/Loyalty');
const notificationService = require('./notificationService');

class LoyaltyService {
  /**
   * Get or create loyalty account for user
   */
  async getOrCreateAccount(userId) {
    let account = await LoyaltyPoints.findOne({ user: userId });
    if (!account) {
      account = await LoyaltyPoints.create({ user: userId });
    }
    return account;
  }

  /**
   * Award points for a booking
   */
  async awardPointsForBooking(userId, amount) {
    const points = Math.floor(amount * POINTS_PER_RUPEE);
    if (points <= 0) return null;

    const account = await this.getOrCreateAccount(userId);
    const previousTier = account.tier;

    account.points += points;
    account.lifetimePoints += points;
    account.totalEarned += points;
    account.lastUpdated = new Date();

    // Update tier
    this.updateTier(account);

    await account.save();

    // Send notification
    await notificationService.sendLoyaltyPointsEarned(userId, points, account.points);

    // Check tier upgrade
    if (account.tier !== previousTier) {
      await notificationService.sendLoyaltyUpgrade(userId, account.tier);
    }

    return { points, total: account.points, tier: account.tier };
  }

  /**
   * Update tier based on lifetime points
   */
  updateTier(account) {
    const tiers = Object.entries(TIER_THRESHOLDS).sort((a, b) => b[1] - a[1]);
    for (const [tier, threshold] of tiers) {
      if (account.lifetimePoints >= threshold) {
        account.tier = tier;
        break;
      }
    }

    // Update progress to next tier
    const nextTierEntry = tiers.find(([t]) => {
      const tThreshold = TIER_THRESHOLDS[t];
      return account.lifetimePoints < tThreshold;
    });

    if (nextTierEntry) {
      const [, nextThreshold] = nextTierEntry;
      const currentThreshold = TIER_THRESHOLDS[account.tier];
      const range = nextThreshold - currentThreshold;
      const progress = account.lifetimePoints - currentThreshold;
      account.tierProgress = {
        current: progress,
        next: range,
        percentage: Math.round((progress / range) * 100)
      };
    } else {
      // Max tier
      account.tierProgress = { current: 0, next: 0, percentage: 100 };
    }
  }

  /**
   * Redeem points
   */
  async redeemPoints(userId, points) {
    const account = await this.getOrCreateAccount(userId);

    if (account.points < points) {
      throw new Error('Insufficient points');
    }

    account.points -= points;
    account.totalRedemptions += 1;
    account.lastUpdated = new Date();
    await account.save();

    return { pointsRedeemed: points, remainingPoints: account.points };
  }

  /**
   * Get loyalty account details
   */
  async getAccount(userId) {
    const account = await this.getOrCreateAccount(userId);
    return {
      points: account.points,
      lifetimePoints: account.lifetimePoints,
      tier: account.tier,
      tierProgress: account.tierProgress,
      pointsToRupeeRatio: account.pointsToRupeeRatio,
      totalEarned: account.totalEarned,
      totalRedemptions: account.totalRedemptions,
      tierBenefits: this.getTierBenefits(account.tier)
    };
  }

  /**
   * Get tier benefits
   */
  getTierBenefits(tier) {
    const benefits = {
      Bronze: ['5% off on bookings', 'Birthday bonus: 50 points'],
      Silver: ['7% off on bookings', 'Priority support', 'Birthday bonus: 100 points', 'Early access to movies'],
      Gold: ['10% off on bookings', 'Priority support', 'Birthday bonus: 200 points', 'Early access', 'Free popcorn on select bookings'],
      Platinum: ['15% off on bookings', 'Dedicated support', 'Birthday bonus: 500 points', 'VIP screenings', 'Free upgrades'],
      Diamond: ['20% off on bookings', 'Dedicated concierge', 'Birthday bonus: 1000 points', 'All Platinum benefits', 'Free lifetime upgrades']
    };
    return benefits[tier] || benefits.Bronze;
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit = 10) {
    const users = await LoyaltyPoints.find()
      .populate('user', 'name avatar')
      .sort({ lifetimePoints: -1 })
      .limit(limit);

    return users.map((u, i) => ({
      rank: i + 1,
      name: u.user?.name || 'Anonymous',
      avatar: u.user?.avatar,
      points: u.lifetimePoints,
      tier: u.tier
    }));
  }
}

module.exports = new LoyaltyService();
