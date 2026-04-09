const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const i18nService = require('../services/i18nService');
const {
  getTranslations,
  getSupportedLocales,
  setPreferredLanguage
} = require('../controllers/i18nController');

// Apply i18n middleware
router.use(i18nService.middleware());

// Public routes
router.get('/locales', getSupportedLocales);
router.get('/translations', getTranslations);

// Protected routes
router.post('/preferred', protect, setPreferredLanguage);

module.exports = router;
