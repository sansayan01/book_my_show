import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, Menu, X, ChevronDown, Ticket, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cities } from '../../data/mockData'
import AuthModal from '../AuthModal/AuthModal'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [selectedCity, setSelectedCity] = useState(cities[0])
  const [searchQuery, setSearchQuery] = useState('')
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

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#1F1F1F] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#F84565] rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">BookMyShow</span>
            </Link>

            {/* City Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-sm">{selectedCity.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showCityDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#2A2A2A] rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                        selectedCity.id === city.id ? 'text-[#F84565]' : ''
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for movies, events, sports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F84565] transition-colors"
                />
              </div>
            </form>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm hidden sm:block">{user.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-300 hover:text-white transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F84565] text-white rounded-lg hover:bg-[#d63a54] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-300 hover:text-white md:hidden"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F84565]"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#1A1A1A] border-t border-gray-800">
            <nav className="flex flex-col p-4 gap-2">
              <Link to="/movies" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                Movies
              </Link>
              <Link to="/events" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                Events
              </Link>
              <Link to="/sports" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                Sports
              </Link>
              {user && (
                <Link to="/profile" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  My Profile
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#1F1F1F] border-b border-gray-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 h-10">
            <Link to="/movies" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
              Movies
            </Link>
            <Link to="/events" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
              Events
            </Link>
            <Link to="/sports" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
              Sports
            </Link>
            <Link to="/stream" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
              Stream
            </Link>
            <Link to="/plays" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
              Plays
            </Link>
          </div>
        </div>
      </nav>

      <AuthModal />
    </>
  )
}

export default Header
