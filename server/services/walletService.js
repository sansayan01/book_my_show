/**
 * Wallet Service
 */
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Wallet').schema.virtual('transactions').get ? Wallet : null;
const notificationService = require('./notificationService');

class WalletService {
  /**
   * Get or create wallet for user
   */
  async getOrCreateWallet(userId) {
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      wallet = await Wallet.create({ user: userId, balance: 0, bonusBalance: 0 });
    }
    return wallet;
  }

  /**
   * Credit wallet
   */
  async credit(userId, amount, description, reference = null, referenceType = 'topup') {
    const wallet = await this.getOrCreateWallet(userId);

    const isBonus = referenceType === 'referral_bonus' || referenceType === 'cashback';
    
    wallet.balance += isBonus ? 0 : amount;
    if (isBonus) wallet.bonusBalance += amount;

    wallet.transactions.push({
      type: 'credit',
      amount,
      description,
      reference,
      referenceType,
      balanceAfter: wallet.balance + wallet.bonusBalance,
      status: 'completed'
    });

    await wallet.save();

    // Send notification
    await notificationService.send(
      userId,
      referenceType === 'wallet_topup' ? 'wallet_topup' : 'general',
      isBonus ? 'Bonus Credited!' : 'Wallet Top-Up Successful',
      `${description} - ₹${amount}`,
      { amount, reference }
    );

    return wallet;
  }

  /**
   * Debit wallet
   */
  async debit(userId, amount, description, reference = null, referenceType = 'booking') {
    const wallet = await this.getOrCreateWallet(userId);
    const totalBalance = wallet.balance + wallet.bonusBalance;

    if (totalBalance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    // Deduct from main balance first, then bonus
    let fromBonus = 0;
    let fromMain = amount;

    if (wallet.balance < amount) {
      fromMain = wallet.balance;
      fromBonus = amount - wallet.balance;
    }

    wallet.balance -= fromMain;
    wallet.bonusBalance -= fromBonus;

    wallet.transactions.push({
      type: 'debit',
      amount,
      description,
      reference,
      referenceType,
      balanceAfter: wallet.balance + wallet.bonusBalance,
      status: 'completed'
    });

    await wallet.save();
    return wallet;
  }

  /**
   * Get wallet balance
   */
  async getBalance(userId) {
    const wallet = await this.getOrCreateWallet(userId);
    return {
      balance: wallet.balance,
      bonusBalance: wallet.bonusBalance,
      total: wallet.balance + wallet.bonusBalance,
      currency: wallet.currency
    };
  }

  /**
   * Get transaction history
   */
  async getTransactions(userId, page = 1, limit = 20) {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return { transactions: [], total: 0, page, limit, pages: 0 };

    const skip = (page - 1) * limit;
    const transactions = wallet.transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + limit);

    return {
      transactions,
      total: wallet.transactions.length,
      page,
      limit,
      pages: Math.ceil(wallet.transactions.length / limit)
    };
  }

  /**
   * Transfer to another user
   */
  async transfer(fromUserId, toUserId, amount, note = '') {
    if (fromUserId.toString() === toUserId.toString()) {
      throw new Error('Cannot transfer to yourself');
    }

    if (amount < 10) {
      throw new Error('Minimum transfer amount is ₹10');
    }

    // Debit from sender
    await this.debit(fromUserId, amount, `Transfer to user`, toUserId, 'transfer');

    // Credit to receiver
    await this.credit(toUserId, amount, `Received from user`, fromUserId, 'transfer');

    return { success: true, amount, toUserId };
  }

  /**
   * Process refund to wallet
   */
  async refund(userId, amount, bookingId) {
    return this.credit(userId, amount, 'Booking refund', bookingId, 'refund');
  }
}

module.exports = new WalletService();
