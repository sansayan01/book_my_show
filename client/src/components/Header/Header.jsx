import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, Menu, X, ChevronDown, Ticket, LogOut, ChevronRight } from 'lucide-react'
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
      {/* Main Header - White Background like real BMS */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo & City Selector */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <span className="text-[#FF0040] font-bold text-2xl tracking-tight">book</span>
                <span className="text-[#333333] font-bold text-2xl tracking-tight">MyShow</span>
              </Link>

              {/* City Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="flex items-center gap-1 px-3 py-1.5 text-gray-700 hover:text-[#FF0040] transition-colors border border-gray-200 rounded-lg"
                >
                  <span className="text-sm font-medium">{selectedCity.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showCityDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-3 py-2 text-xs text-gray-500 font-semibold uppercase">Popular Cities</div>
                    {cities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between ${
                          selectedCity.id === city.id 
                            ? 'bg-red-50 text-[#FF0040]' 
                            : 'text-gray-700 hover:bg-gray-50'
                        } transition-colors`}
                      >
                        {city.name}
                        {selectedCity.id === city.id && <ChevronRight className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-6 hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for movies, events, sports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF0040] focus:bg-white transition-all"
                />
              </div>
            </form>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:text-[#FF0040] transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#FF0040] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-2 px-5 py-2 bg-[#FF0040] text-white rounded-lg hover:bg-[#CC0033] transition-colors font-medium text-sm"
                >
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF0040]"
              />
            </div>
          </form>
        </div>
      </header>

      {/* Navigation Bar - Dark Background */}
      <nav className="bg-[#222222] hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 h-11">
            <Link to="/movies" className="px-4 py-2 text-white hover:text-[#FF0040] text-sm font-medium transition-colors">
              Movies
            </Link>
            <Link to="/events" className="px-4 py-2 text-white hover:text-[#FF0040] text-sm font-medium transition-colors">
              Events
            </Link>
            <Link to="/sports" className="px-4 py-2 text-white hover:text-[#FF0040] text-sm font-medium transition-colors">
              Sports
            </Link>
            <Link to="/stream" className="px-4 py-2 text-white hover:text-[#FF0040] text-sm font-medium transition-colors">
              Stream
            </Link>
            <Link to="/plays" className="px-4 py-2 text-white hover:text-[#FF0040] text-sm font-medium transition-colors">
              Plays
            </Link>
            <Link to="/movies" className="px-4 py-2 text-white hover:text-[#FF0040] text-sm font-medium transition-colors">
              Circus
            </Link>
            <Link to="/movies" className="px-4 py-2 text-white hover:text-[#FF0040] text-sm font-medium transition-colors">
              Activities
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col p-4 gap-1">
            {['Movies', 'Events', 'Sports', 'Stream', 'Plays'].map((item) => (
              <Link 
                key={item}
                to="/movies" 
                className="px-4 py-3 text-gray-700 hover:text-[#FF0040] hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center justify-between"
              >
                {item}
                <ChevronRight className="w-4 h-4" />
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
