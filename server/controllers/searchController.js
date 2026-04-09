/**
 * Search Controller
 * Handles search functionality with popular searches
 */
const popularSearchesService = require('../services/popularSearchesService');
const featureFlagService = require('../services/featureFlagService');

/**
 * Search movies and cinemas
 */
exports.search = async (req, res) => {
  try {
    const { q, type, page = 1, limit = 20 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }
    
    // Check if popular searches feature is enabled
    const isPopularEnabled = await featureFlagService.isEnabled(
      'popular_searches',
      req.user,
      process.env.NODE_ENV
    );
    
    let results = { movies: [], cinemas: [] };
    let suggestions = [];
    let trending = [];
    
    // Search movies
    if (!type || type === 'movie') {
      const movieResults = await popularSearchesService.searchMovies(q, page, limit);
      results.movies = movieResults.results;
      if (isPopularEnabled) {
        suggestions = movieResults.suggestions;
        trending = movieResults.trending || [];
      }
    }
    
    // Search cinemas
    if (!type || type === 'cinema') {
      const cinemaResults = await popularSearchesService.searchCinemas(q, page, limit);
      results.cinemas = cinemaResults.results;
    }
    
    res.json({
      success: true,
      query: q,
      results,
      suggestions,
      trending,
      popularSearchesEnabled: isPopularEnabled
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

/**
 * Get search suggestions
 */
exports.getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 1) {
      return res.json({
        success: true,
        suggestions: []
      });
    }
    
    const suggestions = popularSearchesService.getSuggestions(q, 5);
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions',
      error: error.message
    });
  }
};

/**
 * Get trending searches
 */
exports.getTrending = async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;
    
    const trending = popularSearchesService.getTrending(parseInt(limit), type);
    
    res.json({
      success: true,
      trending
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get trending searches',
      error: error.message
    });
  }
};

/**
 * Get related searches
 */
exports.getRelated = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q) {
      return res.json({
        success: true,
        related: []
      });
    }
    
    const related = popularSearchesService.getRelatedSearches(q, parseInt(limit));
    
    res.json({
      success: true,
      related
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get related searches',
      error: error.message
    });
  }
};

/**
 * Get search analytics (admin only)
 */
exports.getAnalytics = async (req, res) => {
  try {
    const analytics = popularSearchesService.getAnalytics();
    
    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: error.message
    });
  }
};
