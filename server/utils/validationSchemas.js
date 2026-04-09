/**
 * Joi Validation Schemas for Request Validation
 */

const Joi = require('joi');

// Common patterns
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// ============ AUTH SCHEMAS ============
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().trim().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Please provide your name'
  }),
  email: Joi.string().email().lowercase().required().trim().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Please provide an email address'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Please provide a password'
  }),
  phone: Joi.string().allow('').optional().trim(),
  referralCode: Joi.string().optional().trim()
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required().trim().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Please provide an email'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Please provide a password'
  })
});

const socialAuthSchema = Joi.object({
  provider: Joi.string().valid('google', 'facebook').required().messages({
    'any.only': 'Provider must be google or facebook',
    'any.required': 'Provider is required'
  }),
  providerId: Joi.string().required().messages({
    'any.required': 'Provider ID is required'
  }),
  email: Joi.string().email().lowercase().optional().trim(),
  name: Joi.string().min(2).max(50).optional().trim()
});

// ============ BOOKING SCHEMAS ============
const createBookingSchema = Joi.object({
  show: Joi.string().pattern(objectIdPattern).required().messages({
    'any.required': 'Show ID is required',
    'string.pattern.base': 'Invalid show ID format'
  }),
  seats: Joi.array().items(Joi.string().required()).min(1).required().messages({
    'array.min': 'At least one seat is required',
    'any.required': 'Seats are required'
  }),
  paymentMethod: Joi.string().valid('card', 'wallet', 'upi', 'netbanking').required()
});

const cancelBookingSchema = Joi.object({
  reason: Joi.string().max(500).optional().trim()
});

// ============ WALLET SCHEMAS ============
const addFundsSchema = Joi.object({
  amount: Joi.number().min(10).max(10000).required().messages({
    'number.min': 'Minimum amount is $10',
    'number.max': 'Maximum amount is $10,000',
    'any.required': 'Amount is required'
  }),
  paymentMethod: Joi.string().valid('card', 'upi', 'netbanking').required()
});

const withdrawFundsSchema = Joi.object({
  amount: Joi.number().min(10).max(10000).required().messages({
    'number.min': 'Minimum amount is $10',
    'number.max': 'Maximum amount is $10,000',
    'any.required': 'Amount is required'
  })
});

const transferFundsSchema = Joi.object({
  toUserId: Joi.string().pattern(objectIdPattern).required().messages({
    'string.pattern.base': 'Invalid user ID',
    'any.required': 'Recipient user ID is required'
  }),
  amount: Joi.number().min(1).max(5000).required().messages({
    'number.min': 'Minimum transfer amount is $1',
    'number.max': 'Maximum transfer amount is $5,000',
    'any.required': 'Amount is required'
  })
});

// ============ REFERRAL SCHEMAS ============
const applyReferralSchema = Joi.object({
  referralCode: Joi.string().min(3).max(20).required().trim().messages({
    'any.required': 'Referral code is required'
  })
});

// ============ LOYALTY SCHEMAS ============
const redeemPointsSchema = Joi.object({
  points: Joi.number().integer().min(100).required().messages({
    'number.min': 'Minimum redemption is 100 points',
    'any.required': 'Points to redeem are required'
  })
});

// ============ EXPORT SCHEMAS ============
const exportSchema = Joi.object({
  type: Joi.string().valid('bookings', 'payments', 'users', 'shows').required().messages({
    'any.only': 'Type must be bookings, payments, users, or shows',
    'any.required': 'Export type is required'
  }),
  format: Joi.string().valid('csv', 'json').default('json').messages({
    'any.only': 'Format must be csv or json'
  }),
  from: Joi.date().optional(),
  to: Joi.date().optional(),
  status: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(1000).default(100)
});

// ============ NOTIFICATION SCHEMAS ============
const updateNotificationSchema = Joi.object({
  isRead: Joi.boolean().optional(),
  preference: Joi.object({
    email: Joi.boolean().optional(),
    push: Joi.boolean().optional(),
    sms: Joi.boolean().optional()
  }).optional()
});

const createReminderSchema = Joi.object({
  show: Joi.string().pattern(objectIdPattern).required().messages({
    'any.required': 'Show ID is required',
    'string.pattern.base': 'Invalid show ID format'
  }),
  type: Joi.string().valid('30min', '1hr', '3hr', '1day').default('30min')
});

// ============ MOVIE SCHEMAS ============
const movieQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  genre: Joi.string().optional(),
  language: Joi.string().optional(),
  format: Joi.string().optional(),
  search: Joi.string().optional().trim(),
  sortBy: Joi.string().valid('title', 'releaseDate', 'rating', 'popularity').default('releaseDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

// ============ CINEMA SCHEMAS ============
const cinemaQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  city: Joi.string().optional().trim(),
  search: Joi.string().optional().trim(),
  lat: Joi.number().min(-90).max(90).optional(),
  lng: Joi.number().min(-180).max(180).optional(),
  radius: Joi.number().min(1).max(100).default(10)
});

// ============ SHOW SCHEMAS ============
const showQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  movie: Joi.string().pattern(objectIdPattern).optional(),
  cinema: Joi.string().pattern(objectIdPattern).optional(),
  date: Joi.date().optional(),
  format: Joi.string().optional(),
  language: Joi.string().optional()
});

// ============ REVIEW SCHEMAS ============
const createReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required().messages({
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating cannot exceed 5',
    'any.required': 'Rating is required'
  }),
  comment: Joi.string().max(1000).optional().trim()
});

// ============ PAYMENT SCHEMAS ============
const processPaymentSchema = Joi.object({
  bookingId: Joi.string().pattern(objectIdPattern).required(),
  method: Joi.string().valid('card', 'wallet', 'upi', 'netbanking').required(),
  cardToken: Joi.string().when('method', {
    is: 'card',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

// ============ PAGINATION SCHEMA ============
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

// Export all schemas
const schemas = {
  register: registerSchema,
  login: loginSchema,
  socialAuth: socialAuthSchema,
  createBooking: createBookingSchema,
  cancelBooking: cancelBookingSchema,
  addFunds: addFundsSchema,
  withdrawFunds: withdrawFundsSchema,
  transferFunds: transferFundsSchema,
  applyReferral: applyReferralSchema,
  redeemPoints: redeemPointsSchema,
  export: exportSchema,
  updateNotification: updateNotificationSchema,
  createReminder: createReminderSchema,
  movieQuery: movieQuerySchema,
  cinemaQuery: cinemaQuerySchema,
  showQuery: showQuerySchema,
  createReview: createReviewSchema,
  processPayment: processPaymentSchema,
  pagination: paginationSchema
};

/**
 * Validation middleware factory
 * @param {string} schemaName - Name of the schema to use
 * @param {string} source - Request property to validate ('body', 'query', 'params')
 */
const validate = (schemaName, source = 'body') => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: `Validation schema '${schemaName}' not found`
      });
    }

    const data = req[source];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

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

    req[source] = value;
    next();
  };
};

module.exports = {
  schemas,
  validate,
  validationMiddleware: validate
};
