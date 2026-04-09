/**
 * Joi Validation Schemas for Request Validation
 */
const Joi = require('joi');

// Auth schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  phone: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const socialAuthSchema = Joi.object({
  provider: Joi.string().valid('google', 'facebook').required(),
  token: Joi.string().required(),
  name: Joi.string().optional(),
  email: Joi.string().email().optional()
});

// Booking schemas
const lockSeatsSchema = Joi.object({
  showId: Joi.string().required(),
  seats: Joi.array().items(
    Joi.object({
      row: Joi.string().required(),
      number: Joi.number().required(),
      price: Joi.number().optional(),
      category: Joi.string().optional()
    })
  ).min(1).required(),
  sessionId: Joi.string().optional()
});

const createBookingSchema = Joi.object({
  showId: Joi.string().required(),
  seats: Joi.array().items(
    Joi.object({
      row: Joi.string().required(),
      number: Joi.number().required(),
      price: Joi.number().optional(),
      category: Joi.string().optional()
    })
  ).min(1).required(),
  sessionId: Joi.string().optional(),
  paymentId: Joi.string().optional(),
  orderId: Joi.string().optional(),
  signature: Joi.string().optional(),
  paymentMethod: Joi.string().valid('card', 'wallet', 'upi', 'netbanking').optional()
});

// Wallet schemas
const walletTopUpSchema = Joi.object({
  amount: Joi.number().min(10).max(50000).required().messages({
    'number.min': 'Minimum top-up amount is ₹10',
    'number.max': 'Maximum top-up amount is ₹50,000'
  }),
  paymentMethod: Joi.string().valid('card', 'upi', 'netbanking').required()
});

const walletTransferSchema = Joi.object({
  toUserId: Joi.string().required(),
  amount: Joi.number().min(10).required(),
  note: Joi.string().max(100).optional()
});

// Referral schemas
const applyReferralSchema = Joi.object({
  code: Joi.string().min(6).max(20).required()
});

// Cinema schemas
const cinemaQuerySchema = Joi.object({
  city: Joi.string().optional(),
  lat: Joi.number().min(-90).max(90).optional(),
  lng: Joi.number().min(-180).max(180).optional(),
  radius: Joi.number().min(1).max(100).optional(), // km
  search: Joi.string().optional()
});

// Export schemas
const exportSchema = Joi.object({
  type: Joi.string().valid('bookings', 'users', 'revenue', 'movies').required(),
  format: Joi.string().valid('csv', 'json').default('json'),
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional(),
  limit: Joi.number().min(1).max(10000).default(1000)
});

// Reminder schemas
const setReminderSchema = Joi.object({
  showId: Joi.string().required(),
  remindAt: Joi.date().iso().min('now').required().messages({
    'date.min': 'Reminder time must be in the future'
  })
});

// Pagination helper
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().default('-createdAt')
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    req.body = value;
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    req.query = value;
    next();
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false, stripUnknown: true });
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    req.params = value;
    next();
  };
};

module.exports = {
  schemas: {
    register: registerSchema,
    login: loginSchema,
    socialAuth: socialAuthSchema,
    lockSeats: lockSeatsSchema,
    createBooking: createBookingSchema,
    walletTopUp: walletTopUpSchema,
    walletTransfer: walletTransferSchema,
    applyReferral: applyReferralSchema,
    cinemaQuery: cinemaQuerySchema,
    export: exportSchema,
    setReminder: setReminderSchema,
    pagination: paginationSchema
  },
  validate,
  validateQuery,
  validateParams
};
