/**
 * Popular Searches Cache Service
 * Tracks and serves trending/popular search queries
 */
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');

class PopularSearchesService {
  constructor() {
    this.searches = new Map();
    this.trending = [];
    this.lastUpdated = null;
    this.updateInterval = 5 * 60 * 1000; // 5 minutes
    this.maxTrendingItems = 20;
    this.decayFactor = 0.95; // Time decay factor
    this.recencyBoost = 10; // Boost for recent searches
  }

  /**
   * Record a search query
   */
  recordSearch(query, userId = null, type = 'movie') {
    if (!query || query.trim().length < 2) return;
    
    const normalizedQuery = query.toLowerCase().trim();
    const now = Date.now();
    
    // Get or create search entry
    let entry = this.searches.get(normalizedQuery);
    
    if (!entry) {
      entry = {
        query: normalizedQuery,
        count: 0,
        recentCount: 0,
        lastSearched: now,
        users: new Set(),
        type,
        firstSearched: now
      };
    }
    
    // Update counts
    entry.count++;
    entry.recentCount++;
    entry.lastSearched = now;
    entry.type = type;
    
    // Track user (optional)
    if (userId) {
      entry.users.add(userId);
    }
    
    this.searches.set(normalizedQuery, entry);
    
    // Recalculate trending
    this.recalculateTrending();
    
    return entry;
  }

  /**
   * Recalculate trending searches with time decay
   */
  recalculateTrending() {
    const now = Date.now();
    
    // Calculate scores with time decay
    const scored = Array.from(this.searches.values())
      .filter(entry => {
        // Only include searches from the last 7 days
        const age = now - entry.lastSearched;
        return age < 7 * 24 * 60 * 60 * 1000;
      })
      .map(entry => {
        // Calculate time decay
        const ageHours = (now - entry.lastSearched) / (1000 * 60 * 60);
        const decay = Math.pow(this.decayFactor, ageHours);
        
        // Calculate score
        const baseScore = entry.count * decay;
        const recentScore = entry.recentCount * this.recencyBoost * decay;
        const uniqueUserScore = entry.users.size * 0.5;
        
        return {
          query: entry.query,
          count: entry.count,
          recentCount: entry.recentCount,
          score: baseScore + recentScore + uniqueUserScore,
          type: entry.type,
          lastSearched: entry.lastSearched
        };
      })
      .sort((a, b) => b.score - a.score);
    
    this.trending = scored.slice(0, this.maxTrendingItems);
    this.lastUpdated = now;
    
    return this.trending;
  }

  /**
   * Get trending searches
   */
  getTrending(limit = 10, type = null) {
    let results = this.trending;
    
    if (type) {
      results = results.filter(t => t.type === type);
    }
    
    return results.slice(0, limit);
  }

  /**
   * Get search suggestions based on partial query
   */
  getSuggestions(partialQuery, limit = 5) {
    if (!partialQuery || partialQuery.length < 1) {
      return [];
    }
    
    const normalized = partialQuery.toLowerCase().trim();
    
    // Get all matching queries
    const matches = Array.from(this.searches.values())
      .filter(entry => entry.query.startsWith(normalized))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return matches.map(m => ({
      query: m.query,
      count: m.count,
      type: m.type
    }));
  }

  /**
   * Get related searches for a query
   */
  getRelatedSearches(query, limit = 5) {
    if (!query) return [];
    
    const normalized = query.toLowerCase().trim();
    const entry = this.searches.get(normalized);
    
    if (!entry) {
      // Find queries with similar terms
      const terms = normalized.split(' ');
      const related = Array.from(this.searches.values())
        .filter(e => 
          e.query !== normalized &&
          terms.some(term => e.query.includes(term))
        )
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
      
      return related.map(r => ({
        query: r.query,
        count: r.count,
        type: r.type
      }));
    }
    
    // Get trending that are similar
    return this.trending
      .filter(t => t.query !== normalized)
      .slice(0, limit)
      .map(t => ({
        query: t.query,
        count: t.count,
        type: t.type
      }));
  }

  /**
   * Search movies with auto-suggestions
   */
  async searchMovies(searchQuery, page = 1, limit = 20) {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    
    // Record the search
    if (normalizedQuery.length >= 2) {
      this.recordSearch(normalizedQuery, null, 'movie');
    }
    
    // Build search query
    const searchCondition = normalizedQuery
      ? {
          $or: [
            { title: { $regex: normalizedQuery, $options: 'i' } },
            { description: { $regex: normalizedQuery, $options: 'i' } },
            { director: { $regex: normalizedQuery, $options: 'i' } },
            { cast: { $elemMatch: { name: { $regex: normalizedQuery, $options: 'i' } } } }
          ]
        }
      : {};
    
    const skip = (page - 1) * limit;
    
    const [movies, total] = await Promise.all([
      Movie.find({ ...searchCondition, isNowShowing: true })
        .select('title poster genre language rating averageRating duration releaseDate')
        .sort({ popularity: -1, rating: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Movie.countDocuments({ ...searchCondition, isNowShowing: true })
    ]);
    
    // Get suggestions
    const suggestions = this.getSuggestions(normalizedQuery, 5);
    
    return {
      results: movies,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      suggestions,
      trending: this.getTrending(5)
    };
  }

  /**
   * Search cinemas
   */
  async searchCinemas(searchQuery, page = 1, limit = 20) {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    
    // Record the search
    if (normalizedQuery.length >= 2) {
      this.recordSearch(normalizedQuery, null, 'cinema');
    }
    
    const searchCondition = normalizedQuery
      ? {
          $or: [
            { name: { $regex: normalizedQuery, $options: 'i' } },
            { address: { $regex: normalizedQuery, $options: 'i' } },
            { city: { $regex: normalizedQuery, $options: 'i' } }
          ]
        }
      : {};
    
    const skip = (page - 1) * limit;
    
    const [cinemas, total] = await Promise.all([
      Cinema.find({ ...searchCondition, isActive: true })
        .select('name address city location amenities screens image')
        .sort({ popularity: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Cinema.countDocuments({ ...searchCondition, isActive: true })
    ]);
    
    return {
      results: cinemas,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  /**
   * Get search analytics
   */
  getAnalytics() {
    const searches = Array.from(this.searches.values());
    const now = Date.now();
    
    const analytics = {
      totalUniqueQueries: searches.length,
      totalSearches: searches.reduce((sum, s) => sum + s.count, 0),
      trending: this.getTrending(10),
      recentQueries: searches
        .filter(s => now - s.lastSearched < 24 * 60 * 60 * 1000)
        .sort((a, b) => b.lastSearched - a.lastSearched)
        .slice(0, 10)
        .map(s => ({ query: s.query, count: s.count, lastSearched: s.lastSearched })),
      byType: {
        movie: searches.filter(s => s.type === 'movie').length,
        cinema: searches.filter(s => s.type === 'cinema').length
      },
      lastUpdated: this.lastUpdated
    };
    
    return analytics;
  }

  /**
   * Reset trending data
   */
  resetTrending() {
    this.trending = [];
    this.searches.clear();
    this.lastUpdated = null;
  }

  /**
   * Remove old entries
   */
  cleanup(olderThanDays = 30) {
    const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
    let removed = 0;
    
    for (const [query, entry] of this.searches) {
      if (entry.lastSearched < cutoff) {
        this.searches.delete(query);
        removed++;
      }
    }
    
    this.recalculateTrending();
    return removed;
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      totalQueries: this.searches.size,
      trendingCount: this.trending.length,
      lastUpdated: this.lastUpdated,
      updateInterval: this.updateInterval
    };
  }
}

module.exports = new PopularSearchesService();
