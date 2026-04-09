const mongoose = require('mongoose');

const loyaltyPointSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    required: true,
    default: 0
  },
  lifetimePoints: {
    type: Number,
    default: 0
  },
  tier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    default: 'Bronze'
  },
  tierProgress: {
    current: { type: Number, default: 0 },
    next: { type: Number, default: 1000 },
    percentage: { type: Number, default: 0 }
  },
  totalRedemptions: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  pointsToRupeeRatio: {
    type: Number,
    default: 1 // 1 point = ₹1 (can be adjusted)
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

loyaltyPointSchema.index({ user: 1 });
loyaltyPointSchema.index({ tier: 1 });

// Tier thresholds (lifetime points)
const TIER_THRESHOLDS = {
  Bronze: 0,
  Silver: 1000,
  Gold: 5000,
  Platinum: 15000,
  Diamond: 50000
};

// Award points on booking
const POINTS_PER_RUPEE = 1; // 1 rupee spent = 1 point

// Redemption rate
const REDEMPTION_RATE = 1; // 1 point = ₹1

const LoyaltyPoints = mongoose.model('LoyaltyPoints', loyaltyPointSchema);

module.exports = { LoyaltyPoints, TIER_THRESHOLDS, POINTS_PER_RUPEE, REDEMPTION_RATE };
