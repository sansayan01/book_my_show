const mongoose = require('mongoose');

const showReminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
    index: true
  },
  reminderTime: {
    type: Date,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['30min', '1hr', '3hr', '1day'],
    default: '30min'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isSent: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index for efficient reminder queries
showReminderSchema.index({ isActive: 1, isSent: 1, reminderTime: 1 });
// Prevent duplicate reminders
showReminderSchema.index({ user: 1, show: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('ShowReminder', showReminderSchema);
