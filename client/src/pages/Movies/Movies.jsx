import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, SlidersHorizontal, Grid, List, ChevronDown, Star, Clock, X, Calendar, MapPin, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import MovieCard from '../../components/MovieCard/MovieCard'
import { movies } from '../../data/mockData'

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('popularity')
  const [activeTab, setActiveTab] = useState('nowShowing')
  
  // Infinite scroll
  const [displayedMovies, setDisplayedMovies] = useState(12)
  const [isLoading, setIsLoading] = useState(false)
  const loaderRef = useRef(null)
  
  // Autocomplete
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [autocompleteResults, setAutocompleteResults] = useState([])
  
  // Filters
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedFormats, setSelectedFormats] = useState([])
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [selectedCity, setSelectedCity] = useState('All')

  // Filter options
  const languages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam']
  const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Sci-Fi', 'Adventure', 'Animation']
  const formats = ['2D', '3D', 'IMAX', '4DX', 'MX4D']
  const cities = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad']
  const priceRanges = [
    { label: 'All', value: 'all' },
    { label: 'Below ₹200', value: '0-200' },
    { label: '₹200 - ₹500', value: '200-500' },
    { label: '₹500 - ₹1000', value: '500-1000' },
    { label: 'Above ₹1000', value: '1000-9999' }
  ]

  // Split movies into now showing and coming soon
  const nowShowingMovies = movies.filter(m => new Date(m.releaseDate) <= new Date())
  const comingSoonMovies = movies.filter(m => new Date(m.releaseDate) > new Date())

  const currentMovies = activeTab === 'nowShowing' ? nowShowingMovies : comingSoonMovies

  // Filter and sort movies
  const filteredMovies = currentMovies.filter(movie => {
    // Search filter
    if (searchQuery && !movie.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    // Language filter
    if (selectedLanguages.length > 0 && !selectedLanguages.includes(movie.language)) {
      return false
    }
    // Genre filter
    if (selectedGenres.length > 0 && !movie.genre.some(g => selectedGenres.includes(g))) {
      return false
    }
    // Format filter
    if (selectedFormats.length > 0 && !movie.format?.some(f => selectedFormats.some(sf => f.includes(sf)))) {
      return false
    }
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'date':
        return new Date(b.releaseDate) - new Date(a.releaseDate)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'price':
        return 250 - 250 // simplified
      default:
        return 0
    }
  })

  const toggleFilter = (value, selected, setSelected) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  const clearFilters = () => {
    setSelectedLanguages([])
    setSelectedGenres([])
    setSelectedFormats([])
    setSelectedPrice('all')
  }

  const activeFiltersCount = selectedLanguages.length + selectedGenres.length + selectedFormats.length + (selectedPrice !== 'all' ? 1 : 0)

  // Infinite scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && displayedMovies < filteredMovies.length) {
          setIsLoading(true)
          setTimeout(() => {
            setDisplayedMovies(prev => Math.min(prev + 12, filteredMovies.length))
            setIsLoading(false)
          }, 500)
        }
      },
      { threshold: 0.1 }
    )
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }
    
    return () => observer.disconnect()
  }, [isLoading, displayedMovies, filteredMovies.length])
  
  // Reset displayed movies when filters change
  useEffect(() => {
    setDisplayedMovies(12)
  }, [selectedLanguages, selectedGenres, selectedFormats, selectedPrice, activeTab, searchQuery])
  
  // Autocomplete search
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = movies.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
      setAutocompleteResults(results)
      setShowAutocomplete(true)
    } else {
      setShowAutocomplete(false)
    }
  }, [searchQuery])

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Header Section */}
      <div className="bg-[#1F1F1F] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white mb-4">Movies</h1>
          
          {/* Tabs - Real BMS Style */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('nowShowing')}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                activeTab === 'nowShowing' 
                  ? 'bg-[#FF0040] text-white' 
                  : 'bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#3A3A3A]'
              }`}
            >
              Now Showing
            </button>
            <button
              onClick={() => setActiveTab('comingSoon')}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                activeTab === 'comingSoon' 
                  ? 'bg-[#FF0040] text-white' 
                  : 'bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#3A3A3A]'
              }`}
            >
              Coming Soon
            </button>
          </div>
          
          {/* Search and Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowAutocomplete(true)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF0040]"
              />
              
              {/* Autocomplete Dropdown */}
              {showAutocomplete && autocompleteResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#2A2A2A] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  {autocompleteResults.map(movie => (
                    <Link
                      key={movie.id}
                      to={`/movie/${movie.id}`}
                      onClick={() => {
                        setShowAutocomplete(false)
                        setSearchQuery(movie.title)
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-[#3A3A3A] transition-colors"
                    >
                      <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded" />
                      <div>
                        <p className="text-white font-medium">{movie.title}</p>
                        <p className="text-gray-400 text-sm">{movie.language} | {movie.genre[0]}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-3 flex-wrap">
              {/* City Filter */}
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-[#2A2A2A] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-[#FF0040] cursor-pointer"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-10 bg-[#2A2A2A] border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-[#FF0040] cursor-pointer"
                >
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="date">Release Date</option>
                  <option value="title">Title</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-[#FF0040] text-white' : 'bg-[#2A2A2A] text-gray-400 hover:text-white'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-[#FF0040] text-white' : 'bg-[#2A2A2A] text-gray-400 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar - Real BMS Style */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-[#1F1F1F] rounded-xl p-5 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[#FF0040] text-sm hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Language Filter */}
              <div className="mb-6">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#FF0040] rounded-full" />
                  Language
                </h3>
                <div className="flex flex-col gap-2">
                  {languages.map(lang => (
                    <label key={lang} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(lang)}
                        onChange={() => toggleFilter(lang, selectedLanguages, setSelectedLanguages)}
                        className="w-4 h-4 rounded border-gray-600 bg-[#2A2A2A] text-[#FF0040] focus:ring-[#FF0040] focus:ring-offset-0"
                      />
                      <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Genre Filter */}
              <div className="mb-6">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-green-500 rounded-full" />
                  Genre
                </h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => toggleFilter(genre, selectedGenres, setSelectedGenres)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        selectedGenres.includes(genre)
                          ? 'bg-[#FF0040] text-white'
                          : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A] hover:text-white'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Filter */}
              <div className="mb-6">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded-full" />
                  Format
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formats.map(format => (
                    <button
                      key={format}
                      onClick={() => toggleFilter(format, selectedFormats, setSelectedFormats)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        selectedFormats.includes(format)
                          ? 'bg-[#FF0040] text-white'
                          : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A] hover:text-white'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-yellow-500 rounded-full" />
                  Price
                </h3>
                <div className="flex flex-col gap-2">
                  {priceRanges.map(range => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPrice === range.value}
                        onChange={() => setSelectedPrice(range.value)}
                        className="w-4 h-4 border-gray-600 bg-[#2A2A2A] text-[#FF0040] focus:ring-[#FF0040] focus:ring-offset-0"
                      />
                      <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400 text-sm">
                {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} found in {activeTab === 'nowShowing' ? 'Now Showing' : 'Coming Soon'}
              </p>
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedLanguages.map(lang => (
                    <span key={lang} className="px-2 py-1 bg-[#FF0040]/20 text-[#FF0040] text-xs rounded-full flex items-center gap-1">
                      {lang}
                      <button onClick={() => toggleFilter(lang, selectedLanguages, setSelectedLanguages)} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedGenres.map(genre => (
                    <span key={genre} className="px-2 py-1 bg-[#FF0040]/20 text-[#FF0040] text-xs rounded-full flex items-center gap-1">
                      {genre}
                      <button onClick={() => toggleFilter(genre, selectedGenres, setSelectedGenres)} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Movies Grid */}
            {filteredMovies.length > 0 ? (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                  : 'flex flex-col gap-4'
                }>
                  {filteredMovies.slice(0, displayedMovies).map(movie => (
                    viewMode === 'grid' ? (
                      <MovieCard key={movie.id} movie={movie} />
                    ) : (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="flex gap-4 bg-[#1F1F1F] rounded-xl p-3 hover:bg-[#2A2A2A] transition-colors"
                      >
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-24 h-36 object-cover rounded-lg"
                        />
                        <div className="flex-1 py-2">
                          <h3 className="text-white font-semibold text-lg">{movie.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-green-400 fill-green-400" />
                              {movie.rating}
                            </span>
                            <span>•</span>
                            <span>{movie.language}</span>
                            <span>•</span>
                            <span>{movie.duration} min</span>
                          </div>
                          <p className="text-gray-500 text-sm mt-2 line-clamp-2">{movie.description}</p>
                          <div className="flex gap-2 mt-3">
                            {movie.genre.slice(0, 3).map((g, i) => (
                              <span key={i} className="px-2 py-0.5 bg-[#2A2A2A] text-gray-400 text-xs rounded">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button className="self-center px-6 py-2.5 bg-[#FF0040] text-white rounded-lg font-semibold text-sm hover:bg-[#CC0033] transition-colors">
                          Book Now
                        </button>
                      </Link>
                    )
                  ))}
                </div>
                
                {/* Infinite Scroll Loader */}
                {displayedMovies < filteredMovies.length && (
                  <div ref={loaderRef} className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-[#FF0040] animate-spin" />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">No movies found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search query</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#CC0033] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Movies