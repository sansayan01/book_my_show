const Movie = require('../models/Movie');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  try {
    const { 
      language, 
      genre, 
      format,
      search, 
      sort,
      page = 1,
      limit = 12 
    } = req.query;

    // Build query
    let query = { isNowShowing: true };

    if (language) {
      query.language = language;
    }

    if (genre) {
      query.genre = { $in: genre.split(',') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'releaseDate') {
      sortOption = { releaseDate: -1 };
    } else if (sort === 'popularity') {
      sortOption = { popularity: -1 };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Movie.countDocuments(query);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured movies
// @route   GET /api/movies/featured
// @access  Public
exports.getFeaturedMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ isFeatured: true, isNowShowing: true })
      .sort({ popularity: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
exports.getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Increment popularity
    await Movie.findByIdAndUpdate(req.params.id, { $inc: { popularity: 1 } });

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie by slug
// @route   GET /api/movies/slug/:slug
// @access  Public
exports.getMovieBySlug = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ slug: req.params.slug });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming movies
// @route   GET /api/movies/upcoming
// @access  Public
exports.getUpcomingMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({
      releaseDate: { $gt: new Date() },
      isNowShowing: false
    })
      .sort({ releaseDate: 1 })
      .limit(12);

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    next(error);
  }
};