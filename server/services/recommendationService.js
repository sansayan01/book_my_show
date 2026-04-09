/**
 * Movie Recommendation Service
 * Content-based filtering for movie recommendations
 */
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');

class RecommendationService {
  constructor() {
    // Genre weights for different user preferences
    this.genreWeights = {
      'Action': 1.0,
      'Comedy': 1.0,
      'Drama': 1.0,
      'Horror': 1.0,
      'Thriller': 1.0,
      'Romance': 1.0,
      'Sci-Fi': 1.0,
      'Animation': 1.0,
      'Documentary': 1.0,
      'Adventure': 1.0,
      'Crime': 1.0,
      'Musical': 1.0
    };
  }

  /**
   * Get recommendations for a user
   */
  async getRecommendations(userId, limit = 10) {
    try {
      // Get user preferences from booking history
      const userPreferences = await this.getUserPreferences(userId);
      
      // Get user's watched movies
      const watchedMovieIds = await this.getWatchedMovies(userId);
      
      // Get all available movies
      const movies = await Movie.find({
        _id: { $nin: watchedMovieIds },
        isNowShowing: true
      }).lean();
      
      // Score movies based on user preferences
      const scoredMovies = movies.map(movie => ({
        movie,
        score: this.calculateScore(movie, userPreferences)
      }));
      
      // Sort by score and return top N
      scoredMovies.sort((a, b) => b.score - a.score);
      
      return scoredMovies.slice(0, limit).map(s => ({
        ...s.movie,
        recommendationScore: s.score,
        reasons: this.getRecommendationReasons(s.movie, userPreferences)
      }));
    } catch (error) {
      console.error('Recommendation error:', error);
      return this.getFallbackRecommendations(limit);
    }
  }

  /**
   * Get user preferences from booking history
   */
  async getUserPreferences(userId) {
    try {
      const bookings = await Booking.find({
        user: userId,
        status: { $in: ['confirmed', 'completed'] }
      }).populate('movie').lean();
      
      const preferences = {
        genres: {},
        languages: {},
        totalSpent: 0,
        avgRating: 0,
        ratingSum: 0,
        ratingCount: 0,
        favoriteCinemas: {},
        preferredShowTimes: {}
      };
      
      for (const booking of bookings) {
        const movie = booking.movie;
        if (!movie) continue;
        
        // Track genre preferences
        if (movie.genre) {
          for (const genre of movie.genre) {
            preferences.genres[genre] = (preferences.genres[genre] || 0) + 1;
          }
        }
        
        // Track language preferences
        if (movie.language) {
          preferences.languages[movie.language] = (preferences.languages[movie.language] || 0) + 1;
        }
        
        // Track spending
        preferences.totalSpent += booking.totalAmount || 0;
        
        // Track ratings
        if (movie.averageRating > 0) {
          preferences.ratingSum += movie.averageRating;
          preferences.ratingCount++;
        }
        
        // Track cinema preferences
        if (booking.cinema) {
          preferences.favoriteCinemas[booking.cinema.toString()] = 
            (preferences.favoriteCinemas[booking.cinema.toString()] || 0) + 1;
        }
        
        // Track show time preferences
        if (booking.showTime) {
          const hour = parseInt(booking.showTime.split(':')[0]);
          let timeSlot = 'afternoon';
          if (hour >= 18) timeSlot = 'evening';
          else if (hour >= 12) timeSlot = 'afternoon';
          else timeSlot = 'matinee';
          
          preferences.preferredShowTimes[timeSlot] = 
            (preferences.preferredShowTimes[timeSlot] || 0) + 1;
        }
      }
      
      // Calculate average rating
      if (preferences.ratingCount > 0) {
        preferences.avgRating = preferences.ratingSum / preferences.ratingCount;
      }
      
      // Calculate total bookings
      preferences.totalBookings = bookings.length;
      
      return preferences;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Get watched movies for a user
   */
  async getWatchedMovies(userId) {
    try {
      const bookings = await Booking.find({
        user: userId,
        status: { $in: ['confirmed', 'completed'] }
      }).distinct('movie');
      
      return bookings;
    } catch (error) {
      console.error('Error getting watched movies:', error);
      return [];
    }
  }

  /**
   * Calculate recommendation score for a movie
   */
  calculateScore(movie, preferences) {
    let score = 0;
    
    // Genre match score (most important)
    if (movie.genre && preferences.genres) {
      const genreMatches = movie.genre.filter(g => preferences.genres[g]);
      if (genreMatches.length > 0) {
        const maxGenreScore = Math.max(...genreMatches.map(g => preferences.genres[g]));
        const totalGenreCount = Object.values(preferences.genres).reduce((a, b) => a + b, 0);
        score += (maxGenreScore / totalGenreCount) * 40; // 40% weight
      }
    }
    
    // Language match score
    if (movie.language && preferences.languages) {
      const langCount = preferences.languages[movie.language] || 0;
      const totalLangCount = Object.values(preferences.languages).reduce((a, b) => a + b, 0);
      if (totalLangCount > 0) {
        score += (langCount / totalLangCount) * 20; // 20% weight
      }
    }
    
    // Rating score
    if (movie.averageRating > 0) {
      score += (movie.averageRating / 10) * 20; // 20% weight
    }
    
    // Popularity score
    if (movie.popularity > 0) {
      score += Math.min(movie.popularity / 100, 1) * 10; // 10% weight
    }
    
    // Recency score (newer movies score higher)
    const daysSinceRelease = movie.releaseDate 
      ? (Date.now() - new Date(movie.releaseDate).getTime()) / (1000 * 60 * 60 * 24)
      : 30;
    if (daysSinceRelease < 30) {
      score += 10; // Recently released
    } else if (daysSinceRelease < 90) {
      score += 5; // Still fresh
    }
    
    return Math.round(score * 100) / 100;
  }

  /**
   * Get reasons for recommendation
   */
  getRecommendationReasons(movie, preferences) {
    const reasons = [];
    
    // Genre match reason
    if (movie.genre && preferences.genres) {
      const topGenres = Object.entries(preferences.genres)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([g]) => g);
      
      const matchingGenres = movie.genre.filter(g => topGenres.includes(g));
      if (matchingGenres.length > 0) {
        reasons.push(`Matches your love for ${matchingGenres.join(', ')}`);
      }
    }
    
    // Language match reason
    if (movie.language && preferences.languages) {
      const topLanguages = Object.entries(preferences.languages)
        .sort((a, b) => b[1] - a[1])[0];
      
      if (topLanguages && topLanguages[0] === movie.language) {
        reasons.push(`In your preferred language: ${movie.language}`);
      }
    }
    
    // High rating reason
    if (movie.averageRating >= 8) {
      reasons.push(`Highly rated: ${movie.averageRating}/10`);
    }
    
    // Popular reason
    if (movie.popularity >= 80) {
      reasons.push('Trending now');
    }
    
    // New release reason
    const daysSinceRelease = movie.releaseDate 
      ? (Date.now() - new Date(movie.releaseDate).getTime()) / (1000 * 60 * 60 * 24)
      : 30;
    if (daysSinceRelease < 7) {
      reasons.push('Just released');
    }
    
    return reasons;
  }

  /**
   * Get default preferences
   */
  getDefaultPreferences() {
    return {
      genres: {},
      languages: {},
      totalSpent: 0,
      avgRating: 0,
      totalBookings: 0,
      favoriteCinemas: {},
      preferredShowTimes: {}
    };
  }

  /**
   * Get fallback recommendations (popular movies)
   */
  async getFallbackRecommendations(limit = 10) {
    return Movie.find({ isNowShowing: true })
      .sort({ popularity: -1, rating: -1 })
      .limit(limit)
      .lean()
      .then(movies => movies.map(m => ({
        ...m,
        recommendationScore: m.popularity || 0,
        reasons: ['Popular choice']
      })));
  }

  /**
   * Get similar movies
   */
  async getSimilarMovies(movieId, limit = 5) {
    try {
      const movie = await Movie.findById(movieId);
      if (!movie) return [];
      
      const similarMovies = await Movie.find({
        _id: { $ne: movieId },
        isNowShowing: true,
        $or: [
          { genre: { $in: movie.genre } },
          { language: movie.language }
        ]
      }).lean();
      
      return similarMovies.map(m => ({
        ...m,
        similarity: this.calculateSimilarity(movie, m),
        reasons: this.getSimilarityReasons(movie, m)
      }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting similar movies:', error);
      return [];
    }
  }

  /**
   * Calculate similarity between two movies
   */
  calculateSimilarity(movie1, movie2) {
    let similarity = 0;
    
    // Genre similarity
    const commonGenres = movie1.genre.filter(g => movie2.genre.includes(g));
    similarity += (commonGenres.length / Math.max(movie1.genre.length, movie2.genre.length)) * 50;
    
    // Language similarity
    if (movie1.language === movie2.language) {
      similarity += 30;
    }
    
    // Rating similarity
    const ratingDiff = Math.abs((movie1.averageRating || 0) - (movie2.averageRating || 0));
    similarity += Math.max(0, 20 - ratingDiff * 2);
    
    return Math.round(similarity);
  }

  /**
   * Get similarity reasons
   */
  getSimilarityReasons(movie1, movie2) {
    const reasons = [];
    
    const commonGenres = movie1.genre.filter(g => movie2.genre.includes(g));
    if (commonGenres.length > 0) {
      reasons.push(`Both are ${commonGenres[0]} movies`);
    }
    
    if (movie1.language === movie2.language) {
      reasons.push(`Same language: ${movie1.language}`);
    }
    
    return reasons;
  }
}

module.exports = new RecommendationService();
