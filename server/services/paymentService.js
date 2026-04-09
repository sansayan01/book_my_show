/**
 * Payment Service Mock (Razorpay-like Implementation)
 * In production, integrate with actual payment gateway
 */

const crypto = require('crypto');

class PaymentService {
  constructor() {
    this.merchantId = process.env.PAYMENT_MERCHANT_ID || 'mock_merchant_123';
    this.merchantKey = process.env.PAYMENT_MERCHANT_KEY || 'mock_key_456';
    this.mockMode = process.env.PAYMENT_MOCK_MODE !== 'false';
  }

  /**
   * Create payment order
   */
  async createOrder(amount, currency = 'INR', options = {}) {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const order = {
      id: orderId,
      entity: 'order',
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      status: 'created',
      receipt: options.receipt || `rcpt_${Date.now()}`,
      created_at: Math.floor(Date.now() / 1000),
      notes: options.notes || {}
    };

    // In mock mode, just return the order
    if (this.mockMode) {
      console.log(`[MOCK PAYMENT] Created order: ${orderId}, Amount: ₹${amount}`);
      return order;
    }

    // In production, call actual payment gateway API
    // const response = await razorpay.orders.create({ amount, currency, receipt });
    return order;
  }

  /**
   * Verify payment signature
   */
  verifySignature(paymentId, orderId, signature) {
    if (this.mockMode) {
      // In mock mode, accept any signature
      console.log(`[MOCK PAYMENT] Verifying signature for payment: ${paymentId}`);
      return true;
    }

    // In production, verify actual signature
    const payload = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.merchantKey)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }

  /**
   * Process payment (mock)
   */
  async processPayment(orderId, paymentDetails) {
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payment = {
      id: paymentId,
      entity: 'payment',
      order_id: orderId,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency || 'INR',
      status: 'captured',
      method: paymentDetails.method || 'card',
      vpa: paymentDetails.vpa || null,
      bank: paymentDetails.bank || null,
      wallet: paymentDetails.wallet || null,
      captured: true,
      created_at: Math.floor(Date.now() / 1000)
    };

    if (this.mockMode) {
      console.log(`[MOCK PAYMENT] Processed payment: ${paymentId} for order: ${orderId}`);
      return payment;
    }

    // In production, call actual payment gateway
    return payment;
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId, amount, reason = '') {
    const refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const refund = {
      id: refundId,
      entity: 'refund',
      payment_id: paymentId,
      amount: Math.round(amount * 100),
      currency: 'INR',
      status: 'processed',
      reason: reason,
      created_at: Math.floor(Date.now() / 1000)
    };

    if (this.mockMode) {
      console.log(`[MOCK PAYMENT] Processed refund: ${refundId} for payment: ${paymentId}`);
      return refund;
    }

    // In production, call actual payment gateway
    return refund;
  }

  /**
   * Get payment details
   */
  async getPayment(paymentId) {
    if (this.mockMode) {
      return {
        id: paymentId,
        entity: 'payment',
        status: 'captured'
      };
    }

    // In production, fetch from actual gateway
    // return await razorpay.payments.fetch(paymentId);
  }
}

// Export singleton instance
module.exports = new PaymentService();