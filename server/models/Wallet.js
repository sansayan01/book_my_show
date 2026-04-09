const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reference: {
    type: String // booking ID, top-up ID, etc.
  },
  referenceType: {
    type: String,
    enum: ['booking', 'topup', 'refund', 'referral_bonus', 'transfer', 'loyalty_redemption', 'cashback']
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'completed'
  }
}, { timestamps: true });

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  bonusBalance: {
    type: Number,
    default: 0 // Bonus/reward balance that can only be used for bookings
  },
  isActive: {
    type: Boolean,
    default: true
  },
  transactions: [walletTransactionSchema]
}, {
  timestamps: true
});

// user already has unique:true which creates the index
walletSchema.index({ 'transactions.createdAt': -1 });

module.exports = mongoose.model('Wallet', walletSchema);
