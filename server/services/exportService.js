/**
 * Export Service - CSV/JSON data export
 */
const Booking = require('../models/Booking');
const User = require('../models/User');
const Movie = require('../models/Movie');
const fs = require('fs');
const path = require('path');

class ExportService {
  /**
   * Convert array of objects to CSV string
   */
  toCSV(data, columns) {
    if (!data || data.length === 0) return '';

    const headers = columns.map(c => c.label || c.key);
    const keys = columns.map(c => c.key);

    const rows = data.map(item =>
      keys.map(key => {
        let val = this.getNestedValue(item, key);
        if (val === null || val === undefined) val = '';
        val = String(val).replace(/"/g, '""');
        if (val.includes(',') || val.includes('\n') || val.includes('"')) {
          val = `"${val}"`;
        }
        return val;
      }).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Export bookings
   */
  async exportBookings(format = 'json', options = {}) {
    const { from, to, limit = 1000 } = options;

    let query = {};
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('movie', 'title')
      .populate('cinema', 'name city')
      .sort({ createdAt: -1 })
      .limit(limit);

    const columns = [
      { key: '_id', label: 'Booking ID' },
      { key: 'ticketCode', label: 'Ticket Code' },
      { key: 'user.name', label: 'Customer Name' },
      { key: 'user.email', label: 'Email' },
      { key: 'user.phone', label: 'Phone' },
      { key: 'movie.title', label: 'Movie' },
      { key: 'cinema.name', label: 'Cinema' },
      { key: 'cinema.city', label: 'City' },
      { key: 'showDate', label: 'Show Date' },
      { key: 'showTime', label: 'Show Time' },
      { key: 'screenName', label: 'Screen' },
      { key: 'seats', label: 'Seats' },
      { key: 'totalAmount', label: 'Total Amount' },
      { key: 'status', label: 'Status' },
      { key: 'paymentStatus', label: 'Payment Status' },
      { key: 'createdAt', label: 'Booked At' }
    ];

    const data = bookings.map(b => ({
      ...b.toObject(),
      seats: b.seats.map(s => `${s.row}${s.number}`).join(', '),
      showDate: b.showDate ? new Date(b.showDate).toLocaleDateString() : ''
    }));

    if (format === 'csv') {
      return this.toCSV(data, columns);
    }

    return JSON.stringify({ count: data.length, data }, null, 2);
  }

  /**
   * Export users
   */
  async exportUsers(format = 'json', options = {}) {
    const { limit = 1000 } = options;

    const users = await User.find({ role: 'user' })
      .select('-password -refreshToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .limit(limit);

    const columns = [
      { key: '_id', label: 'User ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'role', label: 'Role' },
      { key: 'isActive', label: 'Active' },
      { key: 'createdAt', label: 'Registered At' }
    ];

    if (format === 'csv') {
      return this.toCSV(users, columns);
    }

    return JSON.stringify({ count: users.length, data: users }, null, 2);
  }

  /**
   * Export revenue report
   */
  async exportRevenue(format = 'json', options = {}) {
    const { from, to, limit = 1000 } = options;

    let match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const bookings = await Booking.aggregate([
      { $match: { ...match, status: { $in: ['confirmed', 'completed'] } } },
      { $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalBookings: { $sum: 1 },
        avgBookingValue: { $avg: '$totalAmount' },
        totalSeats: { $sum: { $size: '$seats' } }
      }},
      { $limit: limit }
    ]);

    const byCinema = await Booking.aggregate([
      { $match: { ...match, status: { $in: ['confirmed', 'completed'] } } },
      { $group: {
        _id: '$cinema',
        revenue: { $sum: '$totalAmount' },
        bookings: { $sum: 1 }
      }},
      { $lookup: { from: 'cinemas', localField: '_id', foreignField: '_id', as: 'cinema' }},
      { $unwind: '$cinema' },
      { $project: { _id: 1, cinema: '$cinema.name', revenue: 1, bookings: 1 }},
      { $sort: { revenue: -1 }},
      { $limit: limit }
    ]);

    const byMovie = await Booking.aggregate([
      { $match: { ...match, status: { $in: ['confirmed', 'completed'] } } },
      { $group: {
        _id: '$movie',
        revenue: { $sum: '$totalAmount' },
        bookings: { $sum: 1 }
      }},
      { $lookup: { from: 'movies', localField: '_id', foreignField: '_id', as: 'movie' }},
      { $unwind: '$movie' },
      { $project: { _id: 1, movie: '$movie.title', revenue: 1, bookings: 1 }},
      { $sort: { revenue: -1 }},
      { $limit: limit }
    ]);

    const report = {
      summary: bookings[0] || { totalRevenue: 0, totalBookings: 0, avgBookingValue: 0, totalSeats: 0 },
      byCinema,
      byMovie,
      generatedAt: new Date().toISOString(),
      period: { from, to }
    };

    if (format === 'csv') {
      return this.toCSV(report.byCinema, [
        { key: 'cinema', label: 'Cinema' },
        { key: 'bookings', label: 'Bookings' },
        { key: 'revenue', label: 'Revenue' }
      ]);
    }

    return JSON.stringify(report, null, 2);
  }

  /**
   * Export movies
   */
  async exportMovies(format = 'json', options = {}) {
    const { limit = 1000 } = options;

    const movies = await Movie.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    const columns = [
      { key: '_id', label: 'Movie ID' },
      { key: 'title', label: 'Title' },
      { key: 'genre', label: 'Genre' },
      { key: 'language', label: 'Language' },
      { key: 'duration', label: 'Duration (min)' },
      { key: 'rating', label: 'Rating' },
      { key: 'releaseDate', label: 'Release Date' },
      { key: 'isActive', label: 'Active' },
      { key: 'createdAt', label: 'Added At' }
    ];

    const data = movies.map(m => ({
      ...m.toObject(),
      releaseDate: m.releaseDate ? new Date(m.releaseDate).toLocaleDateString() : ''
    }));

    if (format === 'csv') {
      return this.toCSV(data, columns);
    }

    return JSON.stringify({ count: data.length, data }, null, 2);
  }
}

module.exports = new ExportService();
