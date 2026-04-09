const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const User = require('../models/User');

// ==================== MOVIE MANAGEMENT ====================

// @desc    Create new movie
// @route   POST /api/admin/movies
// @access  Private/Admin
exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      data: movie,
      message: 'Movie created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/admin/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
      message: 'Movie updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/admin/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check if movie has upcoming shows
    const upcomingShows = await Show.countDocuments({
      movie: movie._id,
      date: { $gte: new Date() }
    });

    if (upcomingShows > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete movie with upcoming shows'
      });
    }

    await movie.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== CINEMA MANAGEMENT ====================

// @desc    Create new cinema
// @route   POST /api/admin/cinemas
// @access  Private/Admin
exports.createCinema = async (req, res, next) => {
  try {
    const cinema = await Cinema.create(req.body);

    res.status(201).json({
      success: true,
      data: cinema,
      message: 'Cinema created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cinema
// @route   PUT /api/admin/cinemas/:id
// @access  Private/Admin
exports.updateCinema = async (req, res, next) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'Cinema not found'
      });
    }

    res.status(200).json({
      success: true,
      data: cinema,
      message: 'Cinema updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete cinema
// @route   DELETE /api/admin/cinemas/:id
// @access  Private/Admin
exports.deleteCinema = async (req, res, next) => {
  try {
    const cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'Cinema not found'
      });
    }

    // Check if cinema has upcoming shows
    const upcomingShows = await Show.countDocuments({
      cinema: cinema._id,
      date: { $gte: new Date() }
    });

    if (upcomingShows > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete cinema with upcoming shows'
      });
    }

    await cinema.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Cinema deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== SHOW MANAGEMENT ====================

// @desc    Create new show
// @route   POST /api/admin/shows
// @access  Private/Admin
exports.createShow = async (req, res, next) => {
  try {
    const { movie, cinema, screen, date, time, duration, price, screenFormat, totalSeats } = req.body;

    // Check for timing conflicts
    const conflictCheck = await checkShowConflicts(cinema, screen, date, time, duration);
    
    if (conflictCheck.hasConflict) {
      return res.status(400).json({
        success: false,
        message: conflictCheck.message,
        conflictingShow: conflictCheck.conflictingShow
      });
    }

    const show = await Show.create({
      movie,
      cinema,
      screen,
      screenFormat: screenFormat || '2D',
      date,
      time,
      duration,
      price,
      availableSeats: totalSeats || 100,
      totalSeats: totalSeats || 100
    });

    await show.populate('movie', 'title');
    await show.populate('cinema', 'name');

    res.status(201).json({
      success: true,
      data: show,
      message: 'Show created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update show
// @route   PUT /api/admin/shows/:id
// @access  Private/Admin
exports.updateShow = async (req, res, next) => {
  try {
    const { time, duration, price, screenFormat, isAvailable } = req.body;
    const showId = req.params.id;

    // If updating time or duration, check for conflicts
    if (time || duration) {
      const existingShow = await Show.findById(showId);
      const newTime = time || existingShow.time;
      const newDuration = duration || existingShow.duration;

      const conflictCheck = await checkShowConflicts(
        existingShow.cinema,
        existingShow.screen,
        existingShow.date,
        newTime,
        newDuration,
        showId
      );

      if (conflictCheck.hasConflict) {
        return res.status(400).json({
          success: false,
          message: conflictCheck.message
        });
      }
    }

    const show = await Show.findByIdAndUpdate(
      showId,
      req.body,
      { new: true, runValidators: true }
    ).populate('movie', 'title').populate('cinema', 'name');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    res.status(200).json({
      success: true,
      data: show,
      message: 'Show updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show
// @route   DELETE /api/admin/shows/:id
// @access  Private/Admin
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Check if show has bookings
    const bookingCount = await Booking.countDocuments({
      show: show._id,
      status: { $in: ['confirmed', 'completed'] }
    });

    if (bookingCount > 0) {
      // Instead of deleting, mark as unavailable
      show.isAvailable = false;
      await show.save();
      
      return res.status(200).json({
        success: true,
        message: 'Show marked as unavailable (has existing bookings)'
      });
    }

    await show.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Show deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== BOOKING MANAGEMENT ====================

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { ticketCode: { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('movie', 'title')
      .populate('cinema', 'name city')
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

// @desc    Cancel booking (admin)
// @route   POST /api/admin/bookings/:id/cancel
// @access  Private/Admin
exports.cancelBookingAdmin = async (req, res, next) => {
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

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking already cancelled'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.refundAmount = booking.totalAmount;
    booking.refundPercentage = 100;
    booking.cancellationTime = new Date();
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

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get various stats
    const [
      totalMovies,
      totalCinemas,
      totalShows,
      totalBookings,
      todayBookings,
      totalRevenue,
      activeUsers
    ] = await Promise.all([
      Movie.countDocuments(),
      Cinema.countDocuments({ isActive: true }),
      Show.countDocuments({ date: { $gte: today } }),
      Booking.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Booking.aggregate([
        { $match: { status: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      User.countDocuments({ isActive: true })
    ]);

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('movie', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalMovies,
        totalCinemas,
        totalShows,
        totalBookings,
        todayBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeUsers,
        recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function for conflict checking
const checkShowConflicts = async (cinemaId, screen, date, time, duration, excludeShowId = null) => {
  const [hours, minutes] = time.split(':').map(Number);
  const showStartMinutes = hours * 60 + minutes;
  const showEndMinutes = showStartMinutes + duration;
  const bufferMinutes = 30;
  
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  const query = {
    cinema: cinemaId,
    screen: screen,
    date: { $gte: startDate, $lte: endDate },
    isAvailable: true
  };
  
  if (excludeShowId) {
    query._id = { $ne: excludeShowId };
  }
  
  const existingShows = await Show.find(query);
  
  for (const show of existingShows) {
    const [existingHours, existingMinutes] = show.time.split(':').map(Number);
    const existingStartMinutes = existingHours * 60 + existingMinutes;
    const existingEndMinutes = existingStartMinutes + show.duration;
    
    const hasOverlap = (
      (showStartMinutes >= existingStartMinutes - bufferMinutes && 
       showStartMinutes < existingEndMinutes + bufferMinutes) ||
      (showEndMinutes > existingStartMinutes - bufferMinutes && 
       showEndMinutes <= existingEndMinutes + bufferMinutes) ||
      (showStartMinutes <= existingStartMinutes - bufferMinutes && 
       showEndMinutes >= existingEndMinutes + bufferMinutes)
    );
    
    if (hasOverlap) {
      return {
        hasConflict: true,
        conflictingShow: show,
        message: `Time slot conflicts with existing show at ${show.time}`
      };
    }
  }
  
  return { hasConflict: false };
};