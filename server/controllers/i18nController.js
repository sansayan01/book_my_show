/**
 * i18n Controller
 * Handles translations and locale management
 */
const i18nService = require('../services/i18nService');

/**
 * Get translations for a locale
 */
exports.getTranslations = async (req, res) => {
  try {
    const locale = req.locale || 'en';
    const translations = i18nService.getAllTranslations(locale);
    
    res.json({
      success: true,
      locale,
      translations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get translations',
      error: error.message
    });
  }
};

/**
 * Get supported locales
 */
exports.getSupportedLocales = async (req, res) => {
  try {
    const locales = i18nService.getSupportedLocales();
    
    res.json({
      success: true,
      locales,
      currentLocale: req.locale || 'en'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get locales',
      error: error.message
    });
  }
};

/**
 * Set user preferred language
 */
exports.setPreferredLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const userId = req.user._id;
    
    if (!language || !i18nService.supportedLocales.includes(language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language code'
      });
    }
    
    // Update user preferred language
    const User = require('../models/User');
    await User.findByIdAndUpdate(userId, { preferredLanguage: language });
    
    res.json({
      success: true,
      message: 'Preferred language updated',
      language
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update preferred language',
      error: error.message
    });
  }
};
