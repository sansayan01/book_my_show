const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  cinema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  screen: {
    type: String,
    required: true
  },
  screenFormat: {
    type: String,
    enum: ['2D', '3D', 'IMAX', '4DX'],
    default: '2D'
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  availableSeats: {
    type: Number,
    required: true,
    default: 100
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 100
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  bookedSeats: [{
    row: String,
    number: Number
  }]
}, {
  timestamps: true
});

// Compound index for efficient querying
showSchema.index({ movie: 1, cinema: 1, date: 1, time: 1 });
showSchema.index({ cinema: 1, date: 1 });
showSchema.index({ date: 1, time: 1 });

module.exports = mongoose.model('Show', showSchema);