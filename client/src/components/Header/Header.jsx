import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, Menu, X, ChevronDown, Ticket, LogOut, ChevronRight, MapPin, Crown, Star, Zap, Tv, Sparkles, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cities } from '../../data/mockData'
import AuthModal from '../AuthModal/AuthModal'
import AdvancedSearch from '../AdvancedSearch/AdvancedSearch'
import Notifications, { NotificationBell } from '../Notifications/Notifications'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [selectedCity, setSelectedCity] = useState(cities[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { user, openAuthModal, logout } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const navItems = [
    {
      name: 'Movies',
      path: '/movies',
      dropdown: [
        { name: 'Now Showing', path: '/movies' },
        { name: 'Coming Soon', path: '/movies?filter=coming' },
        { name: 'Exclusive', path: '/movies?filter=exclusive' },
        { name: 'Top Rated', path: '/movies?filter=top' },
        { name: 'Stream', path: '/stream' }
      ]
    },
    {
      name: 'Premiere',
      path: '/premiere',
      icon: Zap,
      dropdown: [
        { name: 'New Releases', path: '/premiere?tab=newReleases' },
        { name: 'Early Access', path: '/premiere?tab=earlyAccess' },
        { name: 'Q&A Sessions', path: '/premiere?tab=qaSessions' }
      ]
    },
    {
      name: 'Collections',
      path: '/collections',
      icon: Sparkles,
      dropdown: [
        { name: 'Curated Lists', path: '/collections?tab=curated' },
        { name: 'Browse by Theme', path: '/collections?tab=themes' },
        { name: 'Staff Picks', path: '/collections?tab=staffPicks' },
        { name: 'Watch Again', path: '/collections?tab=watchAgain' }
      ]
    },
    {
      name: 'Events',
      path: '/events',
      dropdown: [
        { name: 'Music', path: '/events?category=music' },
        { name: 'Comedy', path: '/events?category=comedy' },
        { name: 'Workshops', path: '/events?category=workshops' },
        { name: 'Parties', path: '/events?category=parties' }
      ]
    },
    {
      name: 'Plays',
      path: '/plays',
      dropdown: [
        { name: 'Drama', path: '/plays?category=drama' },
        { name: 'Comedy', path: '/plays?category=comedy' },
        { name: 'Musical', path: '/plays?category=musical' },
        { name: 'Kids', path: '/plays?category=kids' }
      ]
    },
    {
      name: 'Sports',
      path: '/sports',
      dropdown: [
        { name: 'Cricket', path: '/sports?category=cricket' },
        { name: 'Football', path: '/sports?category=football' },
        { name: 'Tennis', path: '/sports?category=tennis' },
        { name: 'E-Sports', path: '/sports?category=esports' }
      ]
    },
    { name: 'Offers', path: '/offers' },
    { name: 'Gift Cards', path: '/gift-cards' },
    { name: 'Timeline', path: '/timeline' },
    { name: 'Community', path: '/community' }
  ]

  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity')
    if (savedCity) {
      const city = cities.find(c => c.name === savedCity)
      if (city) setSelectedCity(city)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCityChange = (city) => {
    setSelectedCity(city)
    localStorage.setItem('selectedCity', city.name)
    setShowCityDropdown(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        {/* Top Bar */}
        <div className="bg-[#FF0040] text-white text-xs py-1.5 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Movies, Events, Plays & Sports</span>
              <span className="opacity-50">|</span>
              <Link to="/offers" className="hover:underline">Unlock Special Offers!</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/offers" className="flex items-center gap-1 hover:underline">
                <Star className="w-3 h-3" />
                <span>Unlock Gold: Get 20% off</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1">
              <div className="w-10 h-10 bg-[#FF0040] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">BMS</span>
              </div>
              <span className="text-gray-800 font-bold text-lg hidden sm:block">Book<span className="text-[#FF0040]">My</span>Show</span>
            </Link>

            {/* City Selector */}
            <div className="hidden md:flex items-center">
              <button 
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#FF0040] transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#FF0040]" />
                <span className="text-sm font-medium">{selectedCity.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* City Dropdown */}
              {showCityDropdown && (
                <div className="absolute top-20 bg-white shadow-xl border border-gray-200 rounded-lg py-2 w-64 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Select Your City</p>
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCityChange(city)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 transition-colors flex items-center justify-between ${
                        selectedCity.id === city.id ? 'text-[#FF0040] font-medium' : 'text-gray-700'
                      }`}
                    >
                      <span>{city.name}</span>
                      {selectedCity.id === city.id && <span className="w-2 h-2 bg-[#FF0040] rounded-full" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-6 hidden lg:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for movies, events, sports, plays..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowAdvancedSearch(true)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF0040] focus:bg-white transition-all text-sm"
                />
              </div>
            </form>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Search Button (Mobile) */}
              <button
                onClick={() => setShowAdvancedSearch(true)}
                className="p-2.5 text-gray-700 hover:text-[#FF0040] transition-colors lg:hidden"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* Notifications Bell */}
              <div className="relative">
                <NotificationBell 
                  onClick={() => setShowNotifications(!showNotifications)}
                  unreadCount={3}
                />
                <Notifications 
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              </div>
              
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#FF0040] transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#FF0040] to-[#FF6B35] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.name?.charAt(0) || 'U'}</span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-white shadow-xl border border-gray-200 rounded-lg py-2 min-w-56 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {user.isGoldMember && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-xs font-bold rounded-full mt-1">
                            <Crown className="w-3 h-3" />
                            Gold Member
                          </span>
                        )}
                      </div>
                      <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#FF0040] transition-colors">
                        My Profile
                      </Link>
                      <Link to="/my-bookings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#FF0040] transition-colors">
                        My Bookings
                      </Link>
                      <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#FF0040] transition-colors">
                        Dashboard
                      </Link>
                      <Link to="/support" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#FF0040] transition-colors">
                        Help & Support
                      </Link>
                      <Link to="/offers" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#FF0040] transition-colors">
                        Offers
                      </Link>
                      <Link to="/privacy" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#FF0040] transition-colors">
                        Privacy Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#FF0040] transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => openAuthModal('register')}
                    className="px-4 py-2.5 bg-[#FF0040] text-white text-sm font-medium rounded-lg hover:bg-[#E6003A] transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 text-gray-700 hover:text-[#FF0040] transition-colors md:hidden"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="pb-3 lg:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowAdvancedSearch(true)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF0040]"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-white z-30 overflow-y-auto md:hidden">
            <nav className="px-4 py-4">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 text-gray-800 hover:text-[#FF0040] text-base font-medium border-b border-gray-100 flex items-center justify-between"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              
              {/* Gold Membership CTA in Mobile */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <Link 
                  to="/register"
                  className="mx-2 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Crown className="w-5 h-5" />
                  <span className="font-bold">Get Gold Membership</span>
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">20% OFF</span>
                </Link>
              </div>
            </nav>
          </div>
        )}

        {/* Navigation Bar with Dropdowns */}
        <nav className="bg-[#222222] hidden md:block shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-12">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.path}
                    onClick={() => item.dropdown && setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    className="px-4 py-2.5 text-white hover:text-[#FF0040] text-sm font-medium transition-colors relative flex items-center gap-1"
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.name}
                    {item.dropdown && <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0040] transition-all duration-300 group-hover:w-full" />
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {activeDropdown === item.name && item.dropdown && (
                    <div 
                      className="absolute top-full left-0 bg-white shadow-xl border border-gray-200 rounded-lg py-2 min-w-48 z-50"
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.dropdown.map((subItem, idx) => (
                        <Link
                          key={idx}
                          to={subItem.path}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#FF0040] transition-colors flex items-center justify-between"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.name}
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Advanced Search Modal */}
        <AdvancedSearch 
          isOpen={showAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
          initialQuery={searchQuery}
        />
      </header>
      <AuthModal />
    </>
  )
}

export default Header
