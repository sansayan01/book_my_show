const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const User = require('../models/User');
const seatLockService = require('../services/seatLockService');
const emailService = require('../services/emailService');
const paymentService = require('../services/paymentService');
const qrService = require('../services/qrService');

// @desc    Lock seats temporarily during checkout
// @route   POST /api/bookings/lock-seats
// @access  Private
exports.lockSeats = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { showId, seats, sessionId } = req.body;
    const userId = req.user?.id;

    // Validate show exists
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Check seat availability
    for (const seat of seats) {
      const isBooked = show.bookedSeats.some(
        booked => booked.row === seat.row && booked.number === seat.number
      );
      if (isBooked) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat.row}${seat.number} is already booked`
        });
      }
    }

    // Lock seats using session ID
    const lockResult = await seatLockService.lockSeats(
      showId,
      seats,
      sessionId || userId,
      5 * 60 * 1000 // 5 minute lock
    );

    res.status(200).json({
      success: true,
      data: lockResult,
      message: 'Seats locked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Release locked seats
// @route   POST /api/bookings/release-seats
// @access  Private
exports.releaseSeats = async (req, res, next) => {
  try {
    const { showId, sessionId } = req.body;
    const userId = req.user?.id;

    await seatLockService.releaseSeats(showId, sessionId || userId);

    res.status(200).json({
      success: true,
      message: 'Seats released successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { showId, seats, sessionId } = req.body;

    // Check if show exists
    const show = await Show.findById(showId)
      .populate('movie', 'title')
      .populate('cinema', 'name city');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Validate seats
    if (!seats || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one seat'
      });
    }

    // Check if seats are locked (if using session-based locking)
    const userId = req.user.id;
    if (sessionId && seatLockService.checkLockedSeats(showId, seats, sessionId)) {
      // Release the stale locks first
      await seatLockService.releaseSeats(showId, sessionId);
    }

    // Check seat availability (double-check)
    for (const seat of seats) {
      const isBooked = show.bookedSeats.some(
        booked => booked.row === seat.row && booked.number === seat.number
      );
      if (isBooked) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat.row}${seat.number} is already booked`
        });
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    const bookingSeats = seats.map(seat => {
      const price = seat.price || show.price;
      totalAmount += price;
      return {
        row: seat.row,
        number: seat.number,
        category: seat.category || 'Standard',
        price
      };
    });

    // Handle payment if paymentId provided
    let paymentStatus = 'pending';
    let paymentId = null;
    
    if (req.body.paymentId) {
      // Verify and process payment
      const isValidPayment = paymentService.verifySignature(
        req.body.paymentId,
        req.body.orderId,
        req.body.signature
      );
      
      if (!isValidPayment) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed'
        });
      }
      
      paymentStatus = 'completed';
      paymentId = req.body.paymentId;
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      show: showId,
      movie: show.movie._id,
      cinema: show.cinema._id,
      seats: bookingSeats,
      totalAmount,
      showDate: show.date,
      showTime: show.time,
      screenName: show.screen,
      status: paymentStatus === 'completed' ? 'confirmed' : 'pending',
      paymentId,
      paymentMethod: req.body.paymentMethod || 'card',
      paymentStatus
    });

    // Update show with booked seats
    await Show.findByIdAndUpdate(showId, {
      $push: { bookedSeats: { $each: seats.map(s => ({ row: s.row, number: s.number })) } },
      $inc: { availableSeats: -seats.length }
    });

    // Release any seat locks
    if (sessionId) {
      await seatLockService.releaseSeats(showId, sessionId);
    }

    // Generate QR code for confirmation
    const qrCode = await qrService.generateBookingQR(booking);

    // Populate booking for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title poster')
      .populate('cinema', 'name address city')
      .populate('show', 'date time screen');

    // Send confirmation email (async, don't wait)
    try {
      const user = await User.findById(req.user.id);
      if (user && user.email) {
        emailService.sendBookingConfirmation(populatedBooking, user).catch(err => 
          console.error('Failed to send confirmation email:', err)
        );
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.status(201).json({
      success: true,
      data: {
        ...populatedBooking.toObject(),
        qrCode: qrCode.dataURL
      },
      message: 'Booking created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title poster duration language')
      .populate('cinema', 'name address city')
      .populate('show', 'date time screen');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(query)
      .populate('movie', 'title poster')
      .populate('cinema', 'name city')
      .populate('show', 'date time screen')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking with refund calculation
// @route   POST /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title')
      .populate('cinema', 'name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if can be cancelled
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'This booking cannot be cancelled'
      });
    }

    // Check show time and calculate refund
    const show = await Show.findById(booking.show);
    const showDateTime = new Date(show.date);
    const [hours, minutes] = show.time.split(':').map(Number);
    showDateTime.setHours(hours, minutes, 0, 0);
    
    const hoursUntilShow = (showDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
    
    // Refund policy:
    // - More than 24 hours before show: 100% refund
    // - 12-24 hours before show: 75% refund
    // - 2-12 hours before show: 50% refund
    // - Less than 2 hours: No refund
    let refundPercentage = 0;
    let refundMessage = '';

    if (hoursUntilShow >= 24) {
      refundPercentage = 100;
      refundMessage = 'Full refund (100%)';
    } else if (hoursUntilShow >= 12) {
      refundPercentage = 75;
      refundMessage = '75% refund (25% cancellation fee)';
    } else if (hoursUntilShow >= 2) {
      refundPercentage = 50;
      refundMessage = '50% refund (50% cancellation fee)';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking within 2 hours of show time'
      });
    }

    const refundAmount = (booking.totalAmount * refundPercentage) / 100;

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.refundAmount = refundAmount;
    booking.refundPercentage = refundPercentage;
    booking.cancellationTime = new Date();
    await booking.save();

    // Release seats
    await Show.findByIdAndUpdate(booking.show, {
      $pull: { bookedSeats: { $in: booking.seats.map(s => ({ row: s.row, number: s.number })) } },
      $inc: { availableSeats: booking.seats.length }
    });

    // Send cancellation email (async)
    try {
      const user = await User.findById(req.user.id);
      if (user && user.email) {
        emailService.sendCancellationEmail(booking, user, refundAmount).catch(err => 
          console.error('Failed to send cancellation email:', err)
        );
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    res.status(200).json({
      success: true,
      data: {
        booking,
        refund: {
          amount: refundAmount,
          percentage: refundPercentage,
          message: refundMessage,
          processingTime: '5-7 business days'
        }
      },
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify booking by ticket code
// @route   GET /api/bookings/verify/:ticketCode
// @access  Public
exports.verifyBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ ticketCode: req.params.ticketCode })
      .populate('movie', 'title poster')
      .populate('cinema', 'name address city')
      .populate('show', 'date time screen');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};