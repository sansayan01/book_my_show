/**
 * Cinema Preference Learning Service
 * Learns and tracks user cinema preferences over time
 */
const Booking = require('../models/Booking');
const Cinema = require('../models/Cinema');

class CinemaPreferenceService {
  constructor() {
    this.preferenceCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get user's cinema preferences
   */
  async getUserCinemaPreferences(userId) {
    // Check cache
    const cached = this.preferenceCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.preferences;
    }

    try {
      const preferences = await this.learnPreferences(userId);
      
      this.preferenceCache.set(userId, {
        preferences,
        timestamp: Date.now()
      });
      
      return preferences;
    } catch (error) {
      console.error('Error learning preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Learn preferences from booking history
   */
  async learnPreferences(userId) {
    const bookings = await Booking.find({
      user: userId,
      status: { $in: ['confirmed', 'completed'] }
    })
      .populate('cinema')
      .lean();

    if (bookings.length === 0) {
      return this.getDefaultPreferences();
    }

    const preferences = {
      // City preferences
      cityPreferences: {},
      // Cinema preferences
      cinemaPreferences: {},
      preferredCinemaIds: [],
      // Screen/Amenity preferences
      amenityPreferences: {},
      // Time preferences
      timeSlotPreferences: {},
      // Seat category preferences
      seatCategoryPreferences: {},
      // Spending patterns
      avgSpending: 0,
      totalSpent: 0,
      // Booking patterns
      avgSeatsPerBooking: 0,
      totalSeats: 0,
      // Preferred days
      dayPreferences: {},
      // Loyalty to cinema chains
      chainPreferences: {},
      // Confidence scores
      confidence: {
        city: 0,
        cinema: 0,
        amenities: 0,
        time: 0,
        seat: 0
      }
    };

    for (const booking of bookings) {
      const cinema = booking.cinema;
      
      // City preferences
      if (cinema?.city) {
        preferences.cityPreferences[cinema.city] = 
          (preferences.cityPreferences[cinema.city] || 0) + 1;
      }
      
      // Cinema preferences
      if (cinema?._id) {
        preferences.cinemaPreferences[cinema._id.toString()] = 
          (preferences.cinemaPreferences[cinema._id.toString()] || 0) + 1;
      }
      
      // Amenity preferences
      if (cinema?.amenities) {
        for (const amenity of cinema.amenities) {
          preferences.amenityPreferences[amenity] = 
            (preferences.amenityPreferences[amenity] || 0) + 1;
        }
      }
      
      // Time slot preferences
      const hour = parseInt(booking.showTime?.split(':')[0] || '12');
      let timeSlot = 'matinee';
      if (hour >= 12 && hour < 17) timeSlot = 'afternoon';
      else if (hour >= 17 && hour < 21) timeSlot = 'evening';
      else if (hour >= 21) timeSlot = 'night';
      
      preferences.timeSlotPreferences[timeSlot] = 
        (preferences.timeSlotPreferences[timeSlot] || 0) + 1;
      
      // Seat category preferences
      if (booking.seats?.length > 0) {
        for (const seat of booking.seats) {
          const category = seat.category || 'Standard';
          preferences.seatCategoryPreferences[category] = 
            (preferences.seatCategoryPreferences[category] || 0) + 1;
          preferences.totalSeats++;
        }
      }
      
      // Spending
      preferences.totalSpent += booking.totalAmount || 0;
      
      // Day preferences
      const day = new Date(booking.showDate).toLocaleDateString('en-US', { weekday: 'long' });
      preferences.dayPreferences[day] = 
        (preferences.dayPreferences[day] || 0) + 1;
    }

    // Calculate averages and top preferences
    const bookingCount = bookings.length;
    preferences.avgSpending = preferences.totalSpent / bookingCount;
    preferences.avgSeatsPerBooking = preferences.totalSeats / bookingCount;
    
    // Get top preferences
    preferences.preferredCities = this.getTopN(preferences.cityPreferences, 3);
    preferences.preferredCinemas = this.getTopN(preferences.cinemaPreferences, 5);
    preferences.preferredCinemaIds = preferences.preferredCinemas.map(c => c.id);
    preferences.preferredAmenities = this.getTopN(preferences.amenityPreferences, 5);
    preferences.preferredTimeSlots = this.getTopN(preferences.timeSlotPreferences, 3);
    preferences.preferredDays = this.getTopN(preferences.dayPreferences, 3);
    preferences.preferredSeatCategory = this.getTopN(preferences.seatCategoryPreferences, 1)[0];
    
    // Calculate confidence (based on number of bookings)
    const confidenceMultiplier = Math.min(bookingCount / 10, 1);
    preferences.confidence = {
      city: this.calculateConfidence(preferences.cityPreferences, bookingCount),
      cinema: this.calculateConfidence(preferences.cinemaPreferences, bookingCount),
      amenities: this.calculateConfidence(preferences.amenityPreferences, bookingCount),
      time: this.calculateConfidence(preferences.timeSlotPreferences, bookingCount),
      seat: this.calculateConfidence(preferences.seatCategoryPreferences, bookingCount)
    };
    
    preferences.totalBookings = bookingCount;
    preferences.learnedAt = new Date();

    return preferences;
  }

  /**
   * Get top N items from preference object
   */
  getTopN(prefObject, n) {
    return Object.entries(prefObject)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, n);
  }

  /**
   * Calculate confidence score
   */
  calculateConfidence(prefObject, totalBookings) {
    if (totalBookings === 0) return 0;
    
    const topPref = Object.values(prefObject)[0] || 0;
    const consistency = topPref / totalBookings;
    const volumeBonus = Math.min(totalBookings / 10, 1);
    
    return Math.round((consistency * 0.7 + volumeBonus * 0.3) * 100);
  }

  /**
   * Get default preferences
   */
  getDefaultPreferences() {
    return {
      cityPreferences: {},
      cinemaPreferences: {},
      preferredCinemaIds: [],
      amenityPreferences: {},
      timeSlotPreferences: {},
      seatCategoryPreferences: {},
      avgSpending: 0,
      totalSpent: 0,
      avgSeatsPerBooking: 0,
      totalSeats: 0,
      dayPreferences: {},
      chainPreferences: {},
      confidence: {
        city: 0,
        cinema: 0,
        amenities: 0,
        time: 0,
        seat: 0
      },
      totalBookings: 0,
      learnedAt: new Date()
    };
  }

  /**
   * Get recommended cinemas for a user
   */
  async getRecommendedCinemas(userId, limit = 10) {
    const prefs = await this.getUserCinemaPreferences(userId);
    
    if (prefs.totalBookings === 0) {
      // Return popular cinemas for new users
      return Cinema.find({ isActive: true })
        .sort({ popularity: -1 })
        .limit(limit)
        .lean();
    }
    
    // Build query based on preferences
    const query = { isActive: true };
    
    // If user has strong city preference
    if (prefs.preferredCities?.length > 0 && prefs.confidence.city > 50) {
      query.city = prefs.preferredCities[0].id;
    }
    
    // If user has strong cinema preference
    if (prefs.preferredCinemaIds?.length > 0 && prefs.confidence.cinema > 50) {
      query._id = { $in: prefs.preferredCinemaIds };
    }
    
    let cinemas = await Cinema.find(query)
      .lean();
    
    // Score cinemas based on preferences
    cinemas = cinemas.map(cinema => ({
      ...cinema,
      matchScore: this.calculateCinemaMatchScore(cinema, prefs),
      matchedAmenities: this.getMatchedAmenities(cinema, prefs)
    }));
    
    // Sort by match score
    cinemas.sort((a, b) => b.matchScore - a.matchScore);
    
    return cinemas.slice(0, limit);
  }

  /**
   * Calculate how well a cinema matches user preferences
   */
  calculateCinemaMatchScore(cinema, prefs) {
    let score = 0;
    
    // Preferred cinema bonus
    if (prefs.preferredCinemaIds?.includes(cinema._id.toString())) {
      score += 50 * (prefs.confidence.cinema / 100);
    }
    
    // City match bonus
    if (prefs.preferredCities?.some(c => c.id === cinema.city)) {
      score += 30 * (prefs.confidence.city / 100);
    }
    
    // Amenity match bonus
    if (cinema.amenities && prefs.preferredAmenities) {
      const matchedCount = cinema.amenities.filter(a =>
        prefs.preferredAmenities.some(pa => pa.id === a)
      ).length;
      if (cinema.amenities.length > 0) {
        score += 20 * (matchedCount / cinema.amenities.length);
      }
    }
    
    return Math.round(score);
  }

  /**
   * Get matched amenities
   */
  getMatchedAmenities(cinema, prefs) {
    if (!cinema.amenities || !prefs.preferredAmenities) return [];
    
    return cinema.amenities.filter(a =>
      prefs.preferredAmenities.some(pa => pa.id === a)
    );
  }

  /**
   * Update preference on new booking
   */
  async onNewBooking(userId, booking) {
    // Clear cache to force re-learning
    this.preferenceCache.delete(userId);
    
    // In a real implementation, we might do incremental updates here
    // For now, we just invalidate the cache
    console.log(`Cinema preferences invalidated for user ${userId}`);
  }

  /**
   * Clear user preference cache
   */
  clearCache(userId) {
    this.preferenceCache.delete(userId);
  }

  /**
   * Get service stats
   */
  getStats() {
    return {
      cachedUsers: this.preferenceCache.size,
      cacheExpiry: this.cacheExpiry
    };
  }
}

module.exports = new CinemaPreferenceService();
