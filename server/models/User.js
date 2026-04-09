const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshToken: {
    type: String,
    select: false
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpire: {
    type: Date,
    select: false
  },
  // Social login
  socialLogin: {
    provider: { type: String, enum: ['google', 'facebook', null], default: null },
    providerId: { type: String, default: null }
  },
  // Referral fields
  referralCode: {
    type: String,
    sparse: true,
    index: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  referralCount: {
    type: Number,
    default: 0
  },
  referralCreditsEarned: {
    type: Number,
    default: 0
  },
  // Wallet fields
  walletBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  walletCurrency: {
    type: String,
    default: 'USD'
  },
  // Loyalty points
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  loyaltyTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  // Preferred language for i18n
  preferredLanguage: {
    type: String,
    enum: ['en', 'hi', 'es'],
    default: 'en'
  }
}, {
  timestamps: true
});

// Indexes (email has implicit index from unique, referralCode uses sparse index on field)

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate referral code before saving
userSchema.pre('save', async function(next) {
  if (!this.referralCode) {
    this.referralCode = 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
