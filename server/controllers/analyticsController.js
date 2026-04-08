const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const Show = require('../models/Show');

/**
 * Get analytics data for the platform
 */

// @desc    Get popular movies (by booking count)
// @route   GET /api/analytics/popular-movies
// @access  Public
exports.getPopularMovies = async (req, res, next) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Aggregate bookings by movie
    const movieStats = await Booking.aggregate([
      { $match: { ...dateFilter, status: { $in: ['confirmed', 'completed'] } } },
      {
        $group: {
          _id: '$movie',
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalSeats: { $sum: { $size: '$seats' } }
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'movies',
          localField: '_id',
          foreignField: '_id',
          as: 'movie'
        }
      },
      { $unwind: '$movie' },
      {
        $project: {
          _id: '$movie._id',
          title: '$movie.title',
          poster: '$movie.poster',
          releaseDate: '$movie.releaseDate',
          bookingCount: 1,
          totalRevenue: 1,
          totalSeats: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: movieStats.length,
      data: movieStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top cinemas (by booking count and revenue)
// @route   GET /api/analytics/top-cinemas
// @access  Public
exports.getTopCinemas = async (req, res, next) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Aggregate bookings by cinema
    const cinemaStats = await Booking.aggregate([
      { $match: { ...dateFilter, status: { $in: ['confirmed', 'completed'] } } },
      {
        $group: {
          _id: '$cinema',
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalSeats: { $sum: { $size: '$seats' } }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'cinemas',
          localField: '_id',
          foreignField: '_id',
          as: 'cinema'
        }
      },
      { $unwind: '$cinema' },
      {
        $project: {
          _id: '$cinema._id',
          name: '$cinema.name',
          address: '$cinema.address',
          city: '$cinema.city',
          bookingCount: 1,
          totalRevenue: 1,
          totalSeats: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: cinemaStats.length,
      data: cinemaStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overall dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Public
exports.getDashboardStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get total stats
    const [totalStats, movieCount, cinemaCount, showCount, recentBookings] = await Promise.all([
      Booking.aggregate([
        { $match: { ...dateFilter, status: { $in: ['confirmed', 'completed'] } } },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
            totalSeats: { $sum: { $size: '$seats' } }
          }
        }
      ]),
      Movie.countDocuments({ isActive: true }),
      Cinema.countDocuments({ isActive: true }),
      Show.countDocuments({ date: { $gte: new Date() } }),
      Booking.find({ ...dateFilter, status: { $in: ['confirmed', 'completed'] } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('movie', 'title')
        .populate('cinema', 'name')
    ]);

    const stats = totalStats[0] || {
      totalBookings: 0,
      totalRevenue: 0,
      totalSeats: 0
    };

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalBookings: stats.totalBookings,
          totalRevenue: stats.totalRevenue,
          totalSeatsSold: stats.totalSeats,
          activeMovies: movieCount,
          activeCinemas: cinemaCount,
          activeShows: showCount
        },
        recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue analytics by date range
// @route   GET /api/analytics/revenue
// @access  Public
exports.getRevenueAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Determine group format
    let dateFormat;
    switch (groupBy) {
      case 'month':
        dateFormat = '%Y-%m';
        break;
      case 'week':
        dateFormat = '%Y-W%V';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    const revenueData = await Booking.aggregate([
      { $match: { ...dateFilter, status: { $in: ['confirmed', 'completed'] } } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 },
          seats: { $sum: { $size: '$seats' } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shows analytics (occupancy rates)
// @route   GET /api/analytics/shows
// @access  Public
exports.getShowsAnalytics = async (req, res, next) => {
  try {
    const { limit = 10, date } = req.query;

    const dateFilter = date ? { date: new Date(date) } : { date: { $gte: new Date() } };

    const showStats = await Show.aggregate([
      { $match: dateFilter },
      {
        $project: {
          movie: 1,
          cinema: 1,
          screen: 1,
          date: 1,
          time: 1,
          totalSeats: 1,
          availableSeats: 1,
          occupancy: {
            $multiply: [
              { $divide: [{ $subtract: ['$totalSeats', '$availableSeats'] }, '$totalSeats'] },
              100
            ]
          }
        }
      },
      { $sort: { occupancy: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'movies',
          localField: 'movie',
          foreignField: '_id',
          as: 'movie'
        }
      },
      { $unwind: '$movie' },
      {
        $lookup: {
          from: 'cinemas',
          localField: 'cinema',
          foreignField: '_id',
          as: 'cinema'
        }
      },
      { $unwind: '$cinema' },
      {
        $project: {
          movie: '$movie.title',
          cinema: '$cinema.name',
          screen: 1,
          date: 1,
          time: 1,
          occupancy: { $round: ['$occupancy', 2] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: showStats.length,
      data: showStats
    });
  } catch (error) {
    next(error);
  }
};