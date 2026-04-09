const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getAllFlags,
  getFlag,
  createFlag,
  updateFlag,
  toggleFlag,
  deleteFlag,
  getUserFlags,
  checkFlag
} = require('../controllers/featureFlagController');

// Get flags for current user (authenticated)
router.get('/user', protect, getUserFlags);

// Check specific flag
router.get('/check/:key', protect, checkFlag);

// Admin routes - CRUD operations
router.get('/', protect, admin, getAllFlags);
router.get('/:key', protect, admin, getFlag);
router.post('/', protect, admin, createFlag);
router.put('/:key', protect, admin, updateFlag);
router.patch('/:key/toggle', protect, admin, toggleFlag);
router.delete('/:key', protect, admin, deleteFlag);

module.exports = router;
