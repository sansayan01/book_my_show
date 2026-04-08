import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, Menu, X, ChevronDown, Ticket, LogOut, ChevronRight, MapPin, Crown, Star, Zap, Tv } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cities } from '../../data/mockData'
import AuthModal from '../AuthModal/AuthModal'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [selectedCity, setSelectedCity] = useState(cities[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
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
      name: 'Events',
      path: '/events',
      dropdown: [
        { name: 'Concerts', path: '/events?category=concerts' },
        { name: 'Comedy', path: '/events?category=comedy' },
        { name: 'Workshops', path: '/events?category=workshops' },
        { name: 'Conferences', path: '/events?category=conferences' }
      ]
    },
    {
      name: 'Sports',
      path: '/sports',
      dropdown: [
        { name: 'Cricket', path: '/sports?sport=cricket' },
        { name: 'Football', path: '/sports?sport=football' },
        { name: 'Kabaddi', path: '/sports?sport=kabaddi' },
        { name: 'Hockey', path: '/sports?sport=hockey' }
      ]
    },
    {
      name: 'Plays',
      path: '/plays',
      dropdown: [
        { name: 'Drama', path: '/plays?genre=drama' },
        { name: 'Comedy', path: '/plays?genre=comedy' },
        { name: 'Musical', path: '/plays?genre=musical' },
        { name: 'Classical', path: '/plays?genre=classical' }
      ]
    },
    {
      name: 'Activities',
      path: '/activities',
      dropdown: [
        { name: 'Adventure', path: '/activities?category=adventure' },
        { name: 'Workshops', path: '/activities?category=workshops' },
        { name: 'Tourist Spots', path: '/activities?category=attractions' },
        { name: 'Theme Parks', path: '/activities?category=theme-parks' }
      ]
    },
    {
      name: 'Stream',
      path: '/stream',
      dropdown: [
        { name: 'Featured', path: '/stream' },
        { name: 'Netflix', path: '/stream?platform=netflix' },
        { name: 'Prime Video', path: '/stream?platform=prime' },
        { name: 'Hotstar', path: '/stream?platform=hotstar' }
      ]
    }
  ]

  const mobileNavItems = [
    { name: 'Movies', path: '/movies', icon: '🎬' },
    { name: 'Events', path: '/events', icon: '🎭' },
    { name: 'Sports', path: '/sports', icon: '⚽' },
    { name: 'Plays', path: '/plays', icon: '🎪' },
    { name: 'Activities', path: '/activities', icon: '🎯' },
    { name: 'Stream', path: '/stream', icon: '📺' }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    setShowCityDropdown(false)
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <>
      {/* Gold Membership Promo Banner */}
      <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <Crown className="w-5 h-5" />
          <span className="text-sm font-semibold">Get Gold Membership - Flat 20% OFF on all tickets! </span>
          <Link to="/register" className="text-xs font-bold underline hover:text-[#CC0033]">
            JOIN NOW
          </Link>
        </div>
      </div>

      {/* Top Bar - City Selector */}
      <div className="bg-[#333333] text-white py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-2">
          <span className="text-xs text-gray-300">Your City:</span>
          <button
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            className="flex items-center gap-1 text-sm font-medium hover:text-[#FF0040] transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{selectedCity.name}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {/* City Dropdown */}
        {showCityDropdown && (
          <div className="absolute right-4 top-8 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[60]">
            <div className="px-3 py-2 text-xs text-gray-500 font-semibold uppercase border-b border-gray-100">
              Popular Cities
            </div>
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCitySelect(city)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                  selectedCity.id === city.id 
                    ? 'bg-red-50 text-[#FF0040]' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{city.name}</span>
                {selectedCity.id === city.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100" ref={dropdownRef}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & City Selector */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-1">
                <span className="text-[#FF0040] font-bold text-2xl tracking-tight">book</span>
                <span className="text-[#333333] font-bold text-2xl tracking-tight">MyShow</span>
              </Link>

              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#FF0040] transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#FF0040]" />
                  <span className="text-sm font-medium">{selectedCity.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF0040] focus:bg-white transition-all text-sm"
                />
              </div>
            </form>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#FF0040] transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#FF0040] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown className="w-4 h-4 hidden sm:block" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FF0040]">
                        My Profile
                      </Link>
                      <Link to="/my-bookings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FF0040]">
                        My Bookings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FF0040] flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#FF0040] text-white rounded-lg hover:bg-[#CC0033] transition-colors font-medium text-sm"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-[#FF0040] lg:hidden"
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
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF0040]"
              />
            </div>
          </form>
        </div>
      </header>

      {/* Navigation Bar with Dropdowns */}
      <nav className="bg-[#222222] hidden md:block shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-12">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  className="px-4 py-2.5 text-white hover:text-[#FF0040] text-sm font-medium transition-colors relative flex items-center gap-1"
                >
                  {item.name}
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0040] group-hover:w-full transition-all duration-300" />
                </button>
                
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 absolute w-full shadow-xl z-50">
          <nav className="flex flex-col p-2">
            {mobileNavItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className="px-4 py-3.5 text-gray-700 hover:text-[#FF0040] hover:bg-gray-50 font-medium transition-colors flex items-center gap-3"
                onClick={() => setIsMenuOpen(false)}
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

      <AuthModal />
    </>
  )
}

export default Header
