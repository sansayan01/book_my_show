const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');

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

    const { showId, seats } = req.body;

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
      screenName: show.screen
    });

    // Update show with booked seats
    await Show.findByIdAndUpdate(showId, {
      $push: { bookedSeats: { $each: seats.map(s => ({ row: s.row, number: s.number })) } },
      $inc: { availableSeats: -seats.length }
    });

    res.status(201).json({
      success: true,
      data: booking,
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

// @desc    Cancel booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

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

    // Check show time (cannot cancel within 2 hours of show)
    const show = await Show.findById(booking.show);
    const showTime = new Date(show.date);
    showTime.setHours(parseInt(show.time.split(':')[0]), parseInt(show.time.split(':')[1]));
    
    if (showTime.getTime() - Date.now() < 2 * 60 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking within 2 hours of show'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Release seats
    await Show.findByIdAndUpdate(booking.show, {
      $pull: { bookedSeats: { $in: booking.seats.map(s => ({ row: s.row, number: s.number })) } },
      $inc: { availableSeats: booking.seats.length }
    });

    res.status(200).json({
      success: true,
      data: booking,
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