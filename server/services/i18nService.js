/**
 * i18n Service
 * Multi-language support for the application
 */
const fs = require('fs');
const path = require('path');

class I18nService {
  constructor() {
    this.supportedLocales = ['en', 'hi', 'es'];
    this.defaultLocale = 'en';
    this.translations = {};
    this.loadTranslations();
  }

  /**
   * Load all translation files
   */
  loadTranslations() {
    const localesPath = path.join(__dirname, '../locales');
    
    this.supportedLocales.forEach(locale => {
      try {
        const filePath = path.join(localesPath, `${locale}.json`);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          this.translations[locale] = JSON.parse(content);
        }
      } catch (error) {
        console.error(`Error loading ${locale} translations:`, error.message);
        this.translations[locale] = {};
      }
    });
  }

  /**
   * Get the best matching locale for a request
   */
  getLocale(req) {
    // Check if locale is explicitly set in query/params/body
    if (req?.query?.lang && this.supportedLocales.includes(req.query.lang)) {
      return req.query.lang;
    }
    
    // Check Accept-Language header
    const acceptLanguage = req?.headers?.['accept-language'];
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage
        .split(',')[0]
        .split('-')[0]
        .toLowerCase();
      
      if (this.supportedLocales.includes(preferredLocale)) {
        return preferredLocale;
      }
    }
    
    // Check user preference from auth token
    if (req?.user?.preferredLanguage && this.supportedLocales.includes(req.user.preferredLanguage)) {
      return req.user.preferredLanguage;
    }
    
    return this.defaultLocale;
  }

  /**
   * Get a translation by key path (e.g., 'movies.title')
   */
  t(locale, key, params = {}) {
    const translation = this.translations[locale] || this.translations[this.defaultLocale];
    
    if (!translation) {
      return key;
    }

    // Navigate to the nested key
    const keys = key.split('.');
    let value = translation;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to default locale
        value = this.translations[this.defaultLocale];
        for (const dk of keys) {
          if (value && typeof value === 'object' && dk in value) {
            value = value[dk];
          } else {
            return key; // Key not found
          }
        }
        break;
      }
    }

    // Replace parameters
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
      });
    }

    return value;
  }

  /**
   * Middleware to add translation function to request
   */
  middleware() {
    return (req, res, next) => {
      req.locale = this.getLocale(req);
      req.t = (key, params = {}) => this.t(req.locale, key, params);
      next();
    };
  }

  /**
   * Get all translations for a locale (for client-side)
   */
  getAllTranslations(locale) {
    return this.translations[locale] || this.translations[this.defaultLocale] || {};
  }

  /**
   * Change user's preferred language
   */
  setUserLocale(userId, locale) {
    if (!this.supportedLocales.includes(locale)) {
      return false;
    }
    // This would update the user model in a real implementation
    // For now, just return success
    return true;
  }

  /**
   * Get supported locales list
   */
  getSupportedLocales() {
    return this.supportedLocales.map(locale => ({
      code: locale,
      name: this.getLocaleName(locale),
      nativeName: this.getNativeName(locale)
    }));
  }

  /**
   * Get English name of locale
   */
  getLocaleName(code) {
    const names = {
      en: 'English',
      hi: 'Hindi',
      es: 'Spanish'
    };
    return names[code] || code;
  }

  /**
   * Get native name of locale
   */
  getNativeName(code) {
    const names = {
      en: 'English',
      hi: 'हिन्दी',
      es: 'Español'
    };
    return names[code] || code;
  }
}

module.exports = new I18nService();
