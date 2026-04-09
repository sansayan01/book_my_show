import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    // Header
    searchPlaceholder: 'Search for movies, events, sports, plays...',
    movies: 'Movies',
    premiere: 'Premiere',
    collections: 'Collections',
    events: 'Events',
    plays: 'Plays',
    sports: 'Sports',
    offers: 'Offers',
    giftCards: 'Gift Cards',
    timeline: 'Timeline',
    community: 'Community',
    
    // Common
    nowShowing: 'Now Showing',
    comingSoon: 'Coming Soon',
    bookTickets: 'Book Tickets',
    readMore: 'Read More',
    viewAll: 'View All',
    
    // Movie Details
    about: 'About',
    cast: 'Cast',
    crew: 'Crew',
    reviews: 'Reviews',
    trailer: 'Trailer',
    
    // Booking
    selectSeats: 'Select Seats',
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    proceedToPayment: 'Proceed to Payment',
    total: 'Total',
    
    // Profile
    myProfile: 'My Profile',
    myBookings: 'My Bookings',
    myWatchlist: 'My Watchlist',
    settings: 'Settings',
    signOut: 'Sign Out',
    
    // Footer
    company: 'Company',
    resources: 'Resources',
    contact: 'Contact Us',
    followUs: 'Follow Us',
    downloadApp: 'Download App',
    
    // Gamification
    rewards: 'Rewards',
    points: 'Points',
    streak: 'Streak',
    achievements: 'Achievements',
    leaderboard: 'Leaderboard',
    
    // Price Alerts
    priceAlerts: 'Price Alerts',
    setAlert: 'Set Alert',
    targetPrice: 'Target Price',
    
    // Watchlist
    watchlist: 'Watchlist',
    addToWatchlist: 'Add to Watchlist',
    removeFromWatchlist: 'Remove from Watchlist',
    
    // Comparison
    compareMovies: 'Compare Movies',
    ratings: 'Ratings',
    specs: 'Specs',
    
    // Calendar
    bookingCalendar: 'Booking Calendar',
    exportCalendar: 'Export Calendar',
    
    // Language
    language: 'Language',
    english: 'English',
    hindi: 'हिंदी',
    tamil: 'தமிழ்',
    telugu: 'తెలుగు',
    malayalam: 'മലയാളം',
    kannada: 'ಕನ್ನಡ',
    
    // Theme
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    theme: 'Theme'
  },
  hi: {
    searchPlaceholder: 'फिल्मों, इवेंट्स, स्पोर्ट्स, प्लेज़ के लिए खोजें...',
    movies: 'फिल्में',
    premiere: 'प्रीमियर',
    collections: 'कलेक्शन',
    events: 'इवेंट्स',
    plays: 'प्लेज़',
    sports: 'स्पोर्ट्स',
    offers: 'ऑफर्स',
    giftCards: 'गिफ्ट कार्ड',
    timeline: 'टाइमलाइन',
    community: 'कम्युनिटी',
    
    nowShowing: 'अभी दिखा रहे हैं',
    comingSoon: 'जल्द आ रहा है',
    bookTickets: 'टिकट बुक करें',
    readMore: 'और पढ़ें',
    viewAll: 'सभी देखें',
    
    about: 'के बारे में',
    cast: 'कास्ट',
    crew: 'क्रू',
    reviews: 'समीक्षाएं',
    trailer: 'ट्रेलर',
    
    selectSeats: 'सीटें चुनें',
    selectDate: 'तारीख चुनें',
    selectTime: 'समय चुनें',
    proceedToPayment: 'भुगतान के लिए आगे बढ़ें',
    total: 'कुल',
    
    myProfile: 'मेरी प्रोफाइल',
    myBookings: 'मेरी बुकिंग',
    myWatchlist: 'मेरी वॉचलिस्ट',
    settings: 'सेटिंग्स',
    signOut: 'साइन आउट',
    
    company: 'कंपनी',
    resources: 'संसाधन',
    contact: 'संपर्क करें',
    followUs: 'हमें फॉलो करें',
    downloadApp: 'ऐप डाउनलोड करें',
    
    rewards: 'रिवॉर्ड्स',
    points: 'पॉइंट्स',
    streak: 'स्ट्रीक',
    achievements: 'अचीवमेंट्स',
    leaderboard: 'लीडरबोर्ड',
    
    priceAlerts: 'प्राइस अलर्ट्स',
    setAlert: 'अलर्ट सेट करें',
    targetPrice: 'टारगेट प्राइस',
    
    watchlist: 'वॉचलिस्ट',
    addToWatchlist: 'वॉचलिस्ट में जोड़ें',
    removeFromWatchlist: 'वॉचलिस्ट से हटाएं',
    
    compareMovies: 'फिल्में कम्पेयर करें',
    ratings: 'रेटिंग्स',
    specs: 'स्पेसिफिकेशन्स',
    
    bookingCalendar: 'बुकिंग कैलेंडर',
    exportCalendar: 'कैलेंडर एक्सपोर्ट करें',
    
    language: 'भाषा',
    english: 'English',
    hindi: 'हिंदी',
    tamil: 'தமிழ்',
    telugu: 'తెలుగు',
    malayalam: 'മലയാളം',
    kannada: 'ಕನ್ನಡ',
    
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    theme: 'थीम'
  },
  ta: {
    searchPlaceholder: 'இசை, நிகழ்வுகள், விளையாட்டுகள், நாடகங்களை தேட...',
    movies: 'படங்கள்',
    premiere: 'பிரீமியர்',
    collections: 'தொகுப்புகள்',
    events: 'நிகழ்வுகள்',
    plays: 'நாடகங்கள்',
    sports: 'விளையாட்டுகள்',
    offers: 'சலுகைகள்',
    giftCards: 'Gift Cards',
    timeline: 'காலவரிசை',
    community: 'சமூகம்',
    
    nowShowing: 'தற்போது ஓடுகிறது',
    comingSoon: 'விரைவில்',
    bookTickets: 'டிக்கெட் புக்க் செய்',
    readMore: 'இன்னும் படி',
    viewAll: 'எல்லாம் பார்',
    
    about: 'பற்றி',
    cast: 'நடிகர்கள்',
    crew: 'குழு',
    reviews: 'விமர்சனங்கள்',
    trailer: 'டிரெய்லர்',
    
    selectSeats: 'இருக்கைகளை தேர்வு செய்',
    selectDate: 'தேதியை தேர்வு செய்',
    selectTime: 'நேரத்தை தேர்வு செய்',
    proceedToPayment: 'பணம் செலுத்து',
    total: 'மொத்தம்',
    
    myProfile: 'என் சுயவிவரம்',
    myBookings: 'என் புக்க்கிங்ஸ்',
    myWatchlist: 'என் வாட்ச்லிஸ்ட்',
    settings: 'அமைப்புகள்',
    signOut: 'வெளியேறு',
    
    company: 'நிறுவனம்',
    resources: 'வளங்கள்',
    contact: 'தொடர்பு',
    followUs: 'எங்களை பின்பற்று',
    downloadApp: 'அப்ளிகேஷன் பதிவிறக்கு',
    
    rewards: 'வெகுமதிகள்',
    points: 'புள்ளிகள்',
    streak: 'ஸ்ட்ரீக்',
    achievements: 'சாதனைகள்',
    leaderboard: 'லீடர்போர்டு',
    
    priceAlerts: 'விலை எச்சரிக்கைகள்',
    setAlert: 'அலெர்ட் அமை',
    targetPrice: 'இலக்கு விலை',
    
    watchlist: 'வாட்ச்லிஸ்ட்',
    addToWatchlist: 'வாட்ச்லிஸ்ட்டுக்கு சேர்',
    removeFromWatchlist: 'வாட்ச்லிஸ்ட்டில் இருந்து நீக்கு',
    
    compareMovies: 'படங்களை ஒப்பிடு',
    ratings: 'மதிப்பீடுகள்',
    specs: 'விவரக்குறிப்புகள்',
    
    bookingCalendar: 'புக்க்கிங் கேலண்டர்',
    exportCalendar: 'கேலண்டரை ஏற்று',
    
    language: 'மொழி',
    english: 'English',
    hindi: 'हिंदी',
    tamil: 'தமிழ்',
    telugu: 'తెలుగు',
    malayalam: 'മലയാളം',
    kannada: 'ಕನ್ನಡ',
    
    darkMode: 'டார்க் மோட்',
    lightMode: 'லைட் மோட்',
    theme: 'தீம்'
  },
  te: {
    searchPlaceholder: 'సినిమాలు, ఈవెంట్‌లు, స్పోర్ట్స్, ప్లేల కోసం వెతుకు...',
    movies: 'సినిమాలు',
    premiere: 'ప్రీమియర్',
    collections: 'కలెక్షన్లు',
    events: 'ఈవెంట్‌లు',
    plays: 'ప్లేలు',
    sports: 'స్పోర్ట్స్',
    offers: 'ఆఫర్లు',
    giftCards: 'Gift Cards',
    timeline: 'టైమ్‌లైన్',
    community: 'కమ్యూనిటీ',
    
    nowShowing: 'ఇప్పుడు చూపిస్తున్నారు',
    comingSoon: 'త్వరలో వస్తుంది',
    bookTickets: 'టికెట్లు బుక్ చేయండి',
    readMore: 'ఇంకా చదవండి',
    viewAll: 'అన్నీ చూడండి',
    
    about: 'గురించి',
    cast: 'క్యాస్ట్',
    crew: 'క్రూ',
    reviews: 'రివ్యూలు',
    trailer: 'ట్రైలర్',
    
    selectSeats: 'సీట్లను ఎంచుకోండి',
    selectDate: 'తేదీని ఎంచుకోండి',
    selectTime: 'సమయం ఎంచుకోండి',
    proceedToPayment: 'చెల్లింపుకు వెళ్ళండి',
    total: 'మొత్తం',
    
    myProfile: 'నా ప్రొఫైల్',
    myBookings: 'నా బుకింగ్‌లు',
    myWatchlist: 'నా వాచ్‌లిస్ట్',
    settings: 'సెట్టింగులు',
    signOut: 'లాగ్అవుట్',
    
    company: 'కంపెనీ',
    resources: 'వనరులు',
    contact: 'సంప్రదించండి',
    followUs: 'మమ్మల్ని అనుసరించండి',
    downloadApp: 'యాప్‌ను డౌన్‌లోడ్ చేయండి',
    
    rewards: 'రివార్డ్స్',
    points: 'పాయింట్లు',
    streak: 'స్ట్రీక్',
    achievements: 'అచీవ్‌మెంట్స్',
    leaderboard: 'లీడర్‌బోర్డ్',
    
    priceAlerts: 'ధర హెచ్చరికలు',
    setAlert: 'అలర్ట్ సెట్ చేయండి',
    targetPrice: 'లక్ష్య ధర',
    
    watchlist: 'వాచ్‌లిస్ట్',
    addToWatchlist: 'వాచ్‌లిస్ట్‌కు జోడించండి',
    removeFromWatchlist: 'వాచ్‌లిస్ట్ నుండి తొలగించండి',
    
    compareMovies: 'సినిమాలను పోల్చండి',
    ratings: 'రేటింగ్‌లు',
    specs: 'స్పెసిఫికేషన్లు',
    
    bookingCalendar: 'బుకింగ్ క్యాలెండర్',
    exportCalendar: 'క్యాలెండర్‌ను ఎగుమతి చేయండి',
    
    language: 'భాష',
    english: 'English',
    hindi: 'हिंदी',
    tamil: 'தமிழ்',
    telugu: 'తెలుగు',
    malayalam: 'മലയാളം',
    kannada: 'ಕನ್ನಡ',
    
    darkMode: 'డార్క్ మోడ్',
    lightMode: 'లైట్ మోడ్',
    theme: 'థీమ్'
  }
}

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang)
      localStorage.setItem('language', lang)
    }
  }

  const t = (key) => {
    return translations[language]?.[key] || translations['en'][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
