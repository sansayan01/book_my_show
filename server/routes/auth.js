const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { 
  register, 
  login, 
  getMe, 
  refreshToken, 
  logout, 
  updatePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePasswordValidation, updatePassword);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password/:resetToken', resetPasswordValidation, resetPassword);

module.exports = router;