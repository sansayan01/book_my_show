const Movie = require('../models/Movie');
const Booking = require('../models/Booking');

// Mock data fallback when MongoDB is unavailable
const mockMovies = [
  { _id: "1", title: "Avatar 3", genre: ["Action", "Sci-Fi"], language: "English", format: ["3D", "IMAX"], rating: 8.5, releaseDate: "2026-06-15", poster: "https://picsum.photos/seed/avatar3/300/450", director: "James Cameron", cast: ["Sam Worthington", "Zoe Saldana"], duration: 162, isNowShowing: true, isFeatured: true, popularity: 95, description: "Jake Sully and Neytiri form a family and continue their journey to protect Pandora." },
  { _id: "2", title: "Dhoom 4", genre: ["Action", "Thriller"], language: "Hindi", format: ["2D", "3D"], rating: 7.8, releaseDate: "2026-05-20", poster: "https://picsum.photos/seed/dhoom4/300/450", director: "Sanjay Gadhvi", cast: ["Hrithik Roshan", "Deepika Padukone"], duration: 148, isNowShowing: true, isFeatured: true, popularity: 88, description: "The ultimate heist continues as a new mastermind enters the game." },
  { _id: "3", title: "War 2", genre: ["Action", "Spy"], language: "Hindi", format: ["2D", "IMAX"], rating: 8.2, releaseDate: "2026-07-10", poster: "https://picsum.photos/seed/war2/300/450", director: "Ayan Mukerji", cast: ["Hrithik Roshan", "Nargis Fakhri"], duration: 155, isNowShowing: true, isFeatured: true, popularity: 92, description: "The spy universe expands with a new international threat." },
  { _id: "4", title: "Pushpa 3", genre: ["Action", "Drama"], language: "Telugu", format: ["2D", "3D"], rating: 7.5, releaseDate: "2026-08-05", poster: "https://picsum.photos/seed/pushpa3/300/450", director: "Sukumar", cast: ["Allu Arjun", "Rashmika Mandanna"], duration: 175, isNowShowing: true, isFeatured: false, popularity: 85, description: "Pushpa Raj returns with an even bigger empire and enemies." },
  { _id: "5", title: "KGF 3", genre: ["Action", "Drama"], language: "Kannada", format: ["2D", "Dubbed"], rating: 8.7, releaseDate: "2026-09-12", poster: "https://picsum.photos/seed/kgf3/300/450", director: "Prashanth Neel", cast: ["Yash", "Srinidhi"], duration: 165, isNowShowing: true, isFeatured: true, popularity: 94, description: "The Rocky Bhai saga reaches its epic conclusion." },
  { _id: "6", title: "Jawan 2", genre: ["Action", "Thriller"], language: "Hindi", format: ["2D", "4DX"], rating: 7.9, releaseDate: "2026-04-25", poster: "https://picsum.photos/seed/jawan2/300/450", director: "Atlee", cast: ["Shah Rukh Khan", "Nayanthara"], duration: 152, isNowShowing: true, isFeatured: false, popularity: 87, description: "A high-octane action thriller with a powerful message." },
  { _id: "7", title: "Tiger 5", genre: ["Action", "Spy"], language: "Hindi", format: ["2D", "IMAX"], rating: 7.6, releaseDate: "2026-03-18", poster: "https://picsum.photos/seed/tiger5/300/450", director: "Ali Abbas Zafar", cast: ["Salman Khan", "Katrina Kaif"], duration: 140, isNowShowing: true, isFeatured: false, popularity: 82, description: "The spy who loves his country returns for another mission." },
  { _id: "8", title: "Spider-Man 4", genre: ["Action", "Sci-Fi"], language: "English", format: ["3D", "IMAX", "4DX"], rating: 9.0, releaseDate: "2026-07-04", poster: "https://picsum.photos/seed/spider4/300/450", director: "Jon Watts", cast: ["Tom Holland", "Zendaya"], duration: 148, isNowShowing: true, isFeatured: true, popularity: 98, description: "Peter Parker faces his greatest challenge yet as a new villain emerges." },
];

// Check if MongoDB is connected
const isMongoConnected = () => {
  return Movie.db && Movie.db.readyState === 1;
};

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  try {
    // Use mock data if MongoDB is not connected
    if (!isMongoConnected()) {
      const { sort, genre, language, search } = req.query;
      let filtered = [...mockMovies];
      
      if (genre) {
        filtered = filtered.filter(m => m.genre.some(g => g.toLowerCase().includes(genre.toLowerCase())));
      }
      if (language) {
        filtered = filtered.filter(m => m.language.toLowerCase() === language.toLowerCase());
      }
      if (search) {
        filtered = filtered.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));
      }
      if (sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'popularity') {
        filtered.sort((a, b) => b.popularity - a.popularity);
      }
      
      return res.status(200).json({
        success: true,
        count: filtered.length,
        total: filtered.length,
        page: 1,
        pages: 1,
        data: filtered
      });
    }

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
    // Use mock data if MongoDB is not connected
    if (!isMongoConnected()) {
      const featured = mockMovies.filter(m => m.isFeatured).sort((a, b) => b.popularity - a.popularity).slice(0, 10);
      return res.status(200).json({
        success: true,
        count: featured.length,
        data: featured
      });
    }

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
    // Use mock data if MongoDB is not connected
    if (!isMongoConnected()) {
      const movie = mockMovies.find(m => m._id === req.params.id);
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: movie
      });
    }

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
    // Use mock data if MongoDB is not connected
    if (!isMongoConnected()) {
      const upcoming = mockMovies.filter(m => !m.isNowShowing).sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)).slice(0, 12);
      return res.status(200).json({
        success: true,
        count: upcoming.length,
        data: upcoming
      });
    }

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