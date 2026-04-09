const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referralCode: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired'],
    default: 'pending'
  },
  rewardClaimed: {
    type: Boolean,
    default: false
  },
  rewardAmount: {
    type: Number,
    default: 50 // ₹50 for referrer when referred user completes first booking
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

referralSchema.index({ referrer: 1 });
referralSchema.index({ referredUser: 1 });
referralSchema.index({ referralCode: 1 });

// User's referral code schema
const userReferralCodeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  totalRewardsEarned: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxUses: {
    type: Number,
    default: 10
  }
}, { timestamps: true });

userReferralCodeSchema.index({ user: 1 });
userReferralCodeSchema.index({ code: 1 });

const Referral = mongoose.model('Referral', referralSchema);
const UserReferralCode = mongoose.model('UserReferralCode', userReferralCodeSchema);

module.exports = { Referral, UserReferralCode };
