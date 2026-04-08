const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a movie title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  poster: {
    type: String,
    required: true
  },
  backdrop: {
    type: String
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    required: [true, 'Please provide movie duration in minutes']
  },
  genre: [{
    type: String,
    enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance', 'Sci-Fi', 'Animation', 'Documentary', 'Adventure', 'Crime', 'Musical']
  }],
  language: {
    type: String,
    required: true,
    enum: ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Punjabi', 'Bengali']
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  voteCount: {
    type: Number,
    default: 0
  },
  popularity: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNowShowing: {
    type: Boolean,
    default: true
  },
  cast: [{
    name: String,
    role: String,
    image: String
  }],
  director: {
    type: String
  },
  trailer: {
    type: String
  },
  officialWebsite: {
    type: String
  }
}, {
  timestamps: true
});

// Create slug from title
movieSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for search
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ rating: -1 });

module.exports = mongoose.model('Movie', movieSchema);