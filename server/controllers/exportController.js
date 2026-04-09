/**
 * Export Controller
 */
const exportService = require('../services/exportService');

// @desc    Export data
// @route   GET /api/v1/export
// @access  Private (Admin)
exports.exportData = async (req, res, next) => {
  try {
    const { type, format = 'json', from, to, limit = 1000 } = req.query;

    if (!type || !['bookings', 'users', 'revenue', 'movies'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid export type. Choose: bookings, users, revenue, movies'
      });
    }

    let result;
    const options = { from, to, limit: parseInt(limit) };

    switch (type) {
      case 'bookings':
        result = await exportService.exportBookings(format, options);
        break;
      case 'users':
        result = await exportService.exportUsers(format, options);
        break;
      case 'revenue':
        result = await exportService.exportRevenue(format, options);
        break;
      case 'movies':
        result = await exportService.exportMovies(format, options);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Unknown type' });
    }

    const filename = `${type}_export_${new Date().toISOString().split('T')[0]}.${format}`;

    res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Export bookings
// @route   GET /api/v1/export/bookings
// @access  Private (Admin)
exports.exportBookings = async (req, res, next) => {
  try {
    const { format = 'json', from, to, limit = 1000 } = req.query;
    const data = await exportService.exportBookings(format, { from, to, limit: parseInt(limit) });

    const filename = `bookings_export_${new Date().toISOString().split('T')[0]}.${format}`;
    res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Export revenue
// @route   GET /api/v1/export/revenue
// @access  Private (Admin)
exports.exportRevenue = async (req, res, next) => {
  try {
    const { format = 'json', from, to, limit = 1000 } = req.query;
    const data = await exportService.exportRevenue(format, { from, to, limit: parseInt(limit) });

    const filename = `revenue_report_${new Date().toISOString().split('T')[0]}.${format}`;
    res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Export users
// @route   GET /api/v1/export/users
// @access  Private (Admin)
exports.exportUsers = async (req, res, next) => {
  try {
    const { format = 'json', limit = 1000 } = req.query;
    const data = await exportService.exportUsers(format, { limit: parseInt(limit) });

    const filename = `users_export_${new Date().toISOString().split('T')[0]}.${format}`;
    res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
