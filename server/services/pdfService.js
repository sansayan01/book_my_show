/**
 * PDF Ticket Generation Service
 */
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  /**
   * Generate a booking ticket PDF
   */
  async generateBookingTicket(booking) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A5', margin: 30 });
        const buffers = [];

        doc.on('data', chunk => buffers.push(chunk));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve({
            data: pdfBuffer,
            size: pdfBuffer.length
          });
        });
        doc.on('error', reject);

        // Header
        doc.fillColor('#E53935')
          .fontSize(20)
          .font('Helvetica-Bold')
          .text('BookMyShow', { align: 'center' });

        doc.fillColor('#555')
          .fontSize(10)
          .font('Helvetica')
          .text('E-Ticket Confirmation', { align: 'center' });

        doc.moveTo(30, doc.y + 5).lineTo(390, doc.y + 5).stroke('#ddd');
        doc.moveDown(1);

        // Booking details
        doc.fillColor('#222')
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('BOOKING DETAILS', 30);

        doc.moveDown(0.5);
        doc.font('Helvetica').fillColor('#444').fontSize(10);

        const leftCol = 30;
        const rightCol = 220;

        doc.text('Booking ID:', leftCol).text('Status:', rightCol);
        doc.fillColor('#222').font('Helvetica-Bold').text(`#${booking.ticketCode || booking._id.toString().slice(-10).toUpperCase()}`, leftCol + 80);
        doc.fillColor('#2E7D32').text(booking.status.toUpperCase(), rightCol + 50);

        doc.fillColor('#444').font('Helvetica').moveDown(0.5);

        // Movie info
        doc.fillColor('#222').font('Helvetica-Bold').text('MOVIE', leftCol);
        doc.font('Helvetica').fillColor('#333').fontSize(12).text(booking.movie?.title || 'N/A', leftCol);
        doc.moveDown(0.3);
        doc.fillColor('#666').fontSize(9).font('Helvetica').text(`${booking.show?.format || '2D'} | ${booking.show?.language || 'Hindi'}`, leftCol);

        doc.moveDown(0.5);

        // Venue & Show info
        doc.fillColor('#222').font('Helvetica-Bold').text('VENUE & SHOW', leftCol);
        doc.fillColor('#333').fontSize(10).font('Helvetica');
        doc.text(`${booking.cinema?.name || 'Cinema'}`, leftCol);
        doc.fillColor('#666').fontSize(9);
        doc.text(`${booking.cinema?.address || ''}, ${booking.cinema?.city || ''}`, leftCol);
        doc.moveDown(0.3);

        const showDate = booking.showDate ? new Date(booking.showDate).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
        doc.fillColor('#333').fontSize(10).font('Helvetica-Bold').text(`${showDate}  |  ${booking.showTime || ''}  |  ${booking.screenName || 'Screen 1'}`, leftCol);

        doc.moveDown(0.5);

        // Seats
        doc.fillColor('#222').font('Helvetica-Bold').text('SEATS', leftCol);
        doc.fillColor('#333').fontSize(10).font('Helvetica');
        const seatStr = booking.seats.map(s => `${s.row}${s.number}`).join(', ');
        doc.text(seatStr);

        doc.moveDown(0.5);

        // Price breakdown
        doc.moveTo(30, doc.y).lineTo(390, doc.y).stroke('#eee');
        doc.moveDown(0.5);

        doc.fillColor('#222').font('Helvetica-Bold').text('PRICE BREAKDOWN', leftCol);
        doc.font('Helvetica').fillColor('#444').fontSize(9);

        let y = doc.y;
        booking.seats.forEach((seat, i) => {
          doc.text(`${seat.category || 'Standard'} - ${seat.row}${seat.number}`, leftCol);
          doc.text(`₹${seat.price || 0}`, 340, y + (i * 13), { width: 50, align: 'right' });
          y = doc.y;
        });

        doc.moveTo(30, y + 3).lineTo(390, y + 3).stroke('#eee');
        doc.moveDown(0.3);
        doc.fillColor('#222').font('Helvetica-Bold').fontSize(11);
        doc.text('TOTAL PAID', leftCol);
        doc.text(`₹${booking.totalAmount}`, 340, doc.y - 11, { width: 50, align: 'right' });

        doc.moveDown(1);

        // Footer
        doc.moveTo(30, doc.y).lineTo(390, doc.y).stroke('#ddd');
        doc.moveDown(0.3);
        doc.fillColor('#888').fontSize(8).font('Helvetica').text(
          'This is an electronically generated ticket. No signature required.',
          30, doc.y, { align: 'center' }
        );
        doc.text(
          'Please carry a valid photo ID along with this ticket.',
          30, doc.y + 12, { align: 'center' }
        );

        // QR code placeholder text
        doc.moveDown(1);
        doc.fillColor('#ccc').fontSize(8).text('[QR CODE: ' + (booking.ticketCode || booking._id.toString()) + ']', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new PDFService();
