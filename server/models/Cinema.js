const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a cinema name'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    enum: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']
  },
  location: {
    type: String,
    required: true
  },
  screens: [{
    name: String,
    capacity: Number,
    format: {
      type: String,
      enum: ['2D', '3D', 'IMAX', '4DX'],
      default: '2D'
    }
  }],
  facilities: [{
    type: String,
    enum: ['Parking', 'Food Court', 'Recliner Seats', 'VIP Lounge', 'Wheelchair Access', 'Audio Description', 'Closed Captions']
  }],
  images: [{
    type: String
  }],
  contact: {
    phone: String,
    email: String,
    website: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from name
cinemaSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

cinemaSchema.index({ city: 1 });
cinemaSchema.index({ name: 'text' });
// 2dsphere index for geospatial queries
cinemaSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Cinema', cinemaSchema);