/**
 * Recommendation Controller
 * Handles movie recommendations
 */
const recommendationService = require('../services/recommendationService');
const featureFlagService = require('../services/featureFlagService');

/**
 * Get movie recommendations for current user
 */
exports.getRecommendations = async (req, res) => {
  try {
    // Check if recommendation feature is enabled
    const isEnabled = await featureFlagService.isEnabled(
      'new_recommendation_engine',
      req.user,
      process.env.NODE_ENV
    );
    
    const limit = parseInt(req.query.limit) || 10;
    
    if (!isEnabled && !req.user) {
      // Return popular movies for anonymous users
      const recommendations = await recommendationService.getFallbackRecommendations(limit);
      return res.json({
        success: true,
        recommendations,
        source: 'popular'
      });
    }
    
    const recommendations = await recommendationService.getRecommendations(
      req.user._id,
      limit
    );
    
    res.json({
      success: true,
      count: recommendations.length,
      recommendations,
      source: 'personalized'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: error.message
    });
  }
};

/**
 * Get similar movies to a specific movie
 */
exports.getSimilarMovies = async (req, res) => {
  try {
    const { movieId } = req.params;
    const limit = parseInt(req.query.limit) || 5;
    
    const similarMovies = await recommendationService.getSimilarMovies(movieId, limit);
    
    res.json({
      success: true,
      count: similarMovies.length,
      movies: similarMovies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get similar movies',
      error: error.message
    });
  }
};

/**
 * Get user preferences (for debugging/display)
 */
exports.getUserPreferences = async (req, res) => {
  try {
    const preferences = await recommendationService.getUserPreferences(req.user._id);
    
    res.json({
      success: true,
      preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get preferences',
      error: error.message
    });
  }
};
