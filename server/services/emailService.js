/**
 * Email Notification Service (Mock Implementation)
 * In production, integrate with services like SendGrid, AWS SES, or Nodemailer
 */

class EmailService {
  constructor() {
    this.enabled = process.env.EMAIL_ENABLED === 'true';
    this.from = process.env.EMAIL_FROM || 'noreply@bookmyshow.com';
    console.log(`Email service initialized (enabled: ${this.enabled})`);
  }

  /**
   * Send email (mock implementation)
   */
  async send(to, subject, html) {
    if (!this.enabled) {
      console.log(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
      return { success: true, mock: true };
    }

    // In production, integrate with actual email service
    console.log(`[EMAIL] Sending to: ${to}, Subject: ${subject}`);
    return { success: true, messageId: `msg_${Date.now()}` };
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(booking, user) {
    const subject = 'Booking Confirmation - Your tickets are confirmed!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e5493a;">Booking Confirmed! 🎬</h2>
        <p>Dear ${user.name},</p>
        <p>Your booking has been confirmed. Here are your ticket details:</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Ticket Code:</strong> ${booking.ticketCode}</p>
          <p><strong>Movie:</strong> ${booking.movie?.title || 'N/A'}</p>
          <p><strong>Cinema:</strong> ${booking.cinema?.name || 'N/A'}</p>
          <p><strong>Date:</strong> ${new Date(booking.showDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${booking.showTime}</p>
          <p><strong>Seats:</strong> ${booking.seats.map(s => `${s.row}${s.number}`).join(', ')}</p>
          <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
        </div>
        
        <p>Please show this ticket code at the cinema counter.</p>
        <p>Enjoy your movie!</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">This is an automated email from BookMyShow.</p>
      </div>
    `;

    return this.send(user.email, subject, html);
  }

  /**
   * Send booking cancellation email with refund details
   */
  async sendCancellationEmail(booking, user, refundAmount) {
    const subject = 'Booking Cancelled - Refund Initiated';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e5493a;">Booking Cancelled</h2>
        <p>Dear ${user.name},</p>
        <p>Your booking has been successfully cancelled. Here are the details:</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Ticket Code:</strong> ${booking.ticketCode}</p>
          <p><strong>Movie:</strong> ${booking.movie?.title || 'N/A'}</p>
          <p><strong>Cinema:</strong> ${booking.cinema?.name || 'N/A'}</p>
          <p><strong>Date:</strong> ${new Date(booking.showDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${booking.showTime}</p>
          <p><strong>Seats:</strong> ${booking.seats.map(s => `${s.row}${s.number}`).join(', ')}</p>
        </div>
        
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2e7d32; margin: 0;">Refund Details</h3>
          <p><strong>Refund Amount:</strong> ₹${refundAmount.toFixed(2)}</p>
          <p><strong>Refund Status:</strong> Processing (5-7 business days)</p>
        </div>
        
        <p>We hope to see you again soon!</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">This is an automated email from BookMyShow.</p>
      </div>
    `;

    return this.send(user.email, subject, html);
  }

  /**
   * Send show reminder email
   */
  async sendShowReminder(booking, user) {
    const subject = `Reminder: ${booking.movie?.title || 'Your Movie'} starts soon!`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e5493a;">Movie Reminder 🎬</h2>
        <p>Dear ${user.name},</p>
        <p>Your movie is starting soon! Don't forget to carry your tickets.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Ticket Code:</strong> ${booking.ticketCode}</p>
          <p><strong>Movie:</strong> ${booking.movie?.title || 'N/A'}</p>
          <p><strong>Cinema:</strong> ${booking.cinema?.name || 'N/A'}</p>
          <p><strong>Address:</strong> ${booking.cinema?.address || 'N/A'}</p>
          <p><strong>Show Time:</strong> ${booking.showTime}</p>
          <p><strong>Seats:</strong> ${booking.seats.map(s => `${s.row}${s.number}`).join(', ')}</p>
        </div>
        
        <p>Enjoy your movie!</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">This is an automated email from BookMyShow.</p>
      </div>
    `;

    return this.send(user.email, subject, html);
  }
}

// Export singleton instance
module.exports = new EmailService();