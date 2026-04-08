const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');

// @desc    Get shows
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
  try {
    const { movieId, cinemaId, date, page = 1, limit = 50 } = req.query;

    let query = { isAvailable: true };

    if (movieId) {
      query.movie = movieId;
    }

    if (cinemaId) {
      query.cinema = cinemaId;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    } else {
      // Default to today and future
      query.date = { $gte: new Date() };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const shows = await Show.find(query)
      .populate('movie', 'title poster duration language')
      .populate('cinema', 'name location city')
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Show.countDocuments(query);

    // Group shows by date
    const groupedShows = {};
    shows.forEach(show => {
      const dateKey = show.date.toISOString().split('T')[0];
      if (!groupedShows[dateKey]) {
        groupedShows[dateKey] = [];
      }
      groupedShows[dateKey].push(show);
    });

    res.status(200).json({
      success: true,
      count: shows.length,
      total,
      groupedByDate: groupedShows,
      data: shows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get show by ID
// @route   GET /api/shows/:id
// @access  Public
exports.getShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie', 'title poster duration language genre')
      .populate('cinema', 'name location city address screens');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    res.status(200).json({
      success: true,
      data: show
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get showtime by movie and cinema
// @route   GET /api/shows/theatres
// @access  Public
exports.getShowtimesByMovieAndCinema = async (req, res, next) => {
  try {
    const { movieId, cinemaId } = req.query;

    if (!movieId || !cinemaId) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID and Cinema ID are required'
      });
    }

    const shows = await Show.find({
      movie: movieId,
      cinema: cinemaId,
      isAvailable: true,
      date: { $gte: new Date() }
    })
      .populate('cinema', 'name location')
      .sort({ date: 1, time: 1 });

    // Group by date
    const groupedByDate = {};
    shows.forEach(show => {
      const dateStr = show.date.toISOString().split('T')[0];
      if (!groupedByDate[dateStr]) {
        groupedByDate[dateStr] = [];
      }
      groupedByDate[dateStr].push(show);
    });

    res.status(200).json({
      success: true,
      count: shows.length,
      groupedByDate,
      data: shows
    });
  } catch (error) {
    next(error);
  }
};