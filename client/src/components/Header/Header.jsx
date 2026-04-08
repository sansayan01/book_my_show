import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, Menu, X, ChevronDown, Ticket, LogOut, ChevronRight, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cities } from '../../data/mockData'
import AuthModal from '../AuthModal/AuthModal'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [selectedCity, setSelectedCity] = useState(cities[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, openAuthModal, logout } = useAuth()
  const navigate = useNavigate()

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
      {/* Top Bar - City Selector like real BMS */}
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

      {/* Main Header - White Background like real BMS */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & City Selector */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-1">
                <span className="text-[#FF0040] font-bold text-2xl tracking-tight">book</span>
                <span className="text-[#333333] font-bold text-2xl tracking-tight">MyShow</span>
              </Link>

              {/* City Selector with Pin */}
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

            {/* Search Bar - Prominent like real BMS */}
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
                  
                  {/* User Dropdown */}
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

              {/* Mobile Menu Toggle */}
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

      {/* Navigation Bar - Dark Background like real BMS */}
      <nav className="bg-[#222222] hidden md:block shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-0.5 h-12">
            <Link to="/movies" className="px-4 py-2.5 text-white hover:text-[#FF0040] text-sm font-medium transition-colors relative group">
              Movies
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0040] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/events" className="px-4 py-2.5 text-white hover:text-[#FF0040] text-sm font-medium transition-colors relative group">
              Events
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0040] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/sports" className="px-4 py-2.5 text-white hover:text-[#FF0040] text-sm font-medium transition-colors relative group">
              Sports
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0040] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/plays" className="px-4 py-2.5 text-white hover:text-[#FF0040] text-sm font-medium transition-colors relative group">
              Plays
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0040] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/movies" className="px-4 py-2.5 text-white hover:text-[#FF0040] text-sm font-medium transition-colors relative group">
              Activities
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0040] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/movies" className="px-4 py-2.5 text-white hover:text-[#FF0040] text-sm font-medium transition-colors relative group">
              Buzz
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF0040] group-hover:w-full transition-all duration-300" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 absolute w-full shadow-xl z-50">
          <nav className="flex flex-col p-2">
            {[
              { name: 'Movies', path: '/movies', icon: '🎬' },
              { name: 'Events', path: '/events', icon: '🎭' },
              { name: 'Sports', path: '/sports', icon: '⚽' },
              { name: 'Plays', path: '/plays', icon: '🎪' },
              { name: 'Activities', path: '/movies', icon: '🎯' },
              { name: 'Buzz', path: '/movies', icon: '📰' },
            ].map((item) => (
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
          </nav>
        </div>
      )}

      <AuthModal />
    </>
  )
}

export default Header
