/**
 * Custom Error Classes for robust error handling
 * Provides structured error responses with error codes and metadata
 */

class AppError extends Error {
  constructor(message, statusCode, errorCode = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
        code: this.errorCode,
        statusCode: this.statusCode
      }
    };
  }
}

// Validation Errors
class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }

  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
        code: this.errorCode,
        statusCode: this.statusCode,
        details: this.details
      }
    };
  }
}

// Authentication Errors
class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

// Resource Errors
class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

// Database Errors
class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

// Cache Errors
class CacheError extends AppError {
  constructor(message = 'Cache operation failed') {
    super(message, 500, 'CACHE_ERROR');
  }
}

// External Service Errors
class ExternalServiceError extends AppError {
  constructor(service, message = 'External service unavailable') {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR');
    this.service = service;
  }

  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
        code: this.errorCode,
        statusCode: this.statusCode,
        service: this.service
      }
    };
  }
}

// Rate Limit Error
class RateLimitError extends AppError {
  constructor(retryAfter = 60) {
    super('Too many requests, please try again later', 429, 'RATE_LIMIT_EXCEEDED');
    this.retryAfter = retryAfter;
  }

  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
        code: this.errorCode,
        statusCode: this.statusCode,
        retryAfter: this.retryAfter
      }
    };
  }
}

// Payment Error
class PaymentError extends AppError {
  constructor(message = 'Payment processing failed') {
    super(message, 402, 'PAYMENT_ERROR');
  }
}

// Booking Error
class BookingError extends AppError {
  constructor(message = 'Booking operation failed') {
    super(message, 400, 'BOOKING_ERROR');
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  CacheError,
  ExternalServiceError,
  RateLimitError,
  PaymentError,
  BookingError
};
