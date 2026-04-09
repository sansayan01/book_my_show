const Movie = require('../models/Movie');
const Booking = require('../models/Booking');

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

// @desc    Add review/rating to movie
// @route   POST /api/movies/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const movieId = req.params.id;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check if user already reviewed
    const existingReview = movie.reviews.find(
      r => r.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this movie'
      });
    }

    // Check if user has booked this movie
    const hasBooked = await Booking.findOne({
      user: req.user.id,
      movie: movieId,
      status: { $in: ['confirmed', 'completed'] }
    });

    const isVerified = !!hasBooked;

    // Add review
    movie.reviews.push({
      user: req.user.id,
      rating,
      review,
      isVerified
    });

    // Calculate new average rating
    const totalRating = movie.reviews.reduce((sum, r) => sum + r.rating, 0);
    movie.averageRating = Math.round((totalRating / movie.reviews.length) * 10) / 10;
    movie.reviewCount = movie.reviews.length;

    await movie.save();

    res.status(201).json({
      success: true,
      message: isVerified ? 'Review added (Verified Purchase)' : 'Review added',
      data: {
        averageRating: movie.averageRating,
        reviewCount: movie.reviewCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review/rating
// @route   PUT /api/movies/:id/reviews
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const movieId = req.params.id;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const reviewIndex = movie.reviews.findIndex(
      r => r.user.toString() === req.user.id
    );

    if (reviewIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update review
    if (rating) movie.reviews[reviewIndex].rating = rating;
    if (review !== undefined) movie.reviews[reviewIndex].review = review;

    // Recalculate average rating
    const totalRating = movie.reviews.reduce((sum, r) => sum + r.rating, 0);
    movie.averageRating = Math.round((totalRating / movie.reviews.length) * 10) / 10;

    await movie.save();

    res.status(200).json({
      success: true,
      message: 'Review updated',
      data: {
        averageRating: movie.averageRating,
        reviewCount: movie.reviewCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/movies/:id/reviews
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const movieId = req.params.id;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const reviewIndex = movie.reviews.findIndex(
      r => r.user.toString() === req.user.id
    );

    if (reviewIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Remove review
    movie.reviews.splice(reviewIndex, 1);

    // Recalculate average rating
    if (movie.reviews.length > 0) {
      const totalRating = movie.reviews.reduce((sum, r) => sum + r.rating, 0);
      movie.averageRating = Math.round((totalRating / movie.reviews.length) * 10) / 10;
    } else {
      movie.averageRating = 0;
    }
    movie.reviewCount = movie.reviews.length;

    await movie.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie reviews
// @route   GET /api/movies/:id/reviews
// @access  Public
exports.getMovieReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const movie = await Movie.findById(req.params.id)
      .populate('reviews.user', 'name avatar');

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort reviews by most recent
    const sortedReviews = movie.reviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const paginatedReviews = sortedReviews.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      count: paginatedReviews.length,
      total: movie.reviews.length,
      page: pageNum,
      pages: Math.ceil(movie.reviews.length / limitNum),
      data: {
        reviews: paginatedReviews,
        averageRating: movie.averageRating,
        reviewCount: movie.reviewCount
      }
    });
  } catch (error) {
    next(error);
  }
};