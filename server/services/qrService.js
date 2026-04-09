/**
 * QR Code Generator Service
 * Uses 'qrcode' package to generate QR codes for booking confirmations
 */

const QRCode = require('qrcode');

class QRService {
  /**
   * Generate QR code as data URL (base64)
   */
  async generateQRDataURL(data) {
    try {
      const qrDataURL = await QRCode.toDataURL(JSON.stringify(data), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      return qrDataURL;
    } catch (error) {
      console.error('QR Code generation error:', error);
      throw error;
    }
  }

  /**
   * Generate QR code as SVG string
   */
  async generateQRSVG(data) {
    try {
      const svg = await QRCode.toString(JSON.stringify(data), {
        type: 'svg',
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'M'
      });
      return svg;
    } catch (error) {
      console.error('QR Code generation error:', error);
      throw error;
    }
  }

  /**
   * Generate booking confirmation QR data
   */
  generateBookingQRData(booking) {
    return {
      type: 'BOOKING_CONFIRMATION',
      ticketCode: booking.ticketCode,
      movie: booking.movie?.title,
      cinema: booking.cinema?.name,
      date: booking.showDate,
      time: booking.showTime,
      seats: booking.seats.map(s => `${s.row}${s.number}`).join(','),
      timestamp: Date.now()
    };
  }

  /**
   * Generate and return QR code for booking
   */
  async generateBookingQR(booking) {
    const qrData = this.generateBookingQRData(booking);
    const qrDataURL = await this.generateQRDataURL(qrData);
    
    return {
      data: qrData,
      dataURL: qrDataURL,
      ticketCode: booking.ticketCode
    };
  }
}

// Export singleton instance
module.exports = new QRService();