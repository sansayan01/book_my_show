const Cinema = require('../models/Cinema');

// @desc    Get all cinemas
// @route   GET /api/cinemas
// @access  Public
exports.getCinemas = async (req, res, next) => {
  try {
    const { city, search, lat, lng, radius = 10, page = 1, limit = 20 } = req.query;

    let query = { isActive: true };

    if (city) {
      query.city = city;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Geolocation-based search
    if (lat && lng) {
      const radiusKm = parseFloat(radius);
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radiusKm * 1000 // Convert km to meters
        }
      };
    }

    const skip = (pageNum - 1) * limitNum;

    const cinemas = await Cinema.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Cinema.countDocuments(query);

    res.status(200).json({
      success: true,
      count: cinemas.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: cinemas,
      geo: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng), radius: parseFloat(radius) } : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single cinema
// @route   GET /api/cinemas/:id
// @access  Public
exports.getCinema = async (req, res, next) => {
  try {
    const cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'Cinema not found'
      });
    }

    res.status(200).json({
      success: true,
      data: cinema
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cities with cinemas
// @route   GET /api/cinemas/cities
// @access  Public
exports.getCities = async (req, res, next) => {
  try {
    const cities = await Cinema.distinct('city', { isActive: true });

    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby cinemas
// @route   GET /api/cinemas/nearby
// @access  Public
exports.getNearbyCinemas = async (req, res, next) => {
  try {
    const { lat, lng, radius = 10, limit = 20 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const radiusKm = parseFloat(radius);
    const limitNum = parseInt(limit);

    const cinemas = await Cinema.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radiusKm * 1000
        }
      }
    }).limit(limitNum);

    // Calculate distance for each cinema
    const cinemasWithDistance = cinemas.map(cinema => {
      const dist = cinema.distance ? (cinema.distance / 1000).toFixed(1) : null;
      return { ...cinema.toObject(), distanceKm: dist };
    });

    res.status(200).json({
      success: true,
      count: cinemasWithDistance.length,
      data: cinemasWithDistance,
      params: { lat: parseFloat(lat), lng: parseFloat(lng), radius: radiusKm }
    });
  } catch (error) {
    next(error);
  }
};