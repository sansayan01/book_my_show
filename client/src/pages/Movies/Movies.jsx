import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, SlidersHorizontal, Grid, List, ChevronDown, Star, Clock, X } from 'lucide-react'
import MovieCard from '../../components/MovieCard/MovieCard'
import { movies } from '../../data/mockData'

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('popularity')
  
  // Filters
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedFormats, setSelectedFormats] = useState([])
  const [selectedPrice, setSelectedPrice] = useState('all')

  // Filter options
  const languages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam']
  const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Sci-Fi', 'Adventure']
  const formats = ['2D', '3D', 'IMAX', '4DX']
  const priceRanges = [
    { label: 'All', value: 'all' },
    { label: 'Below ₹200', value: '0-200' },
    { label: '₹200 - ₹500', value: '200-500' },
    { label: 'Above ₹500', value: '500-9999' }
  ]

  // Filter and sort movies
  const filteredMovies = movies.filter(movie => {
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

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Header Section */}
      <div className="bg-[#1F1F1F] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white mb-4">Movies</h1>
          
          {/* Search and Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF0040]"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-[#FF0040] border-[#FF0040] text-white'
                    : 'bg-[#2A2A2A] border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-white text-[#FF0040] rounded-full text-xs flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

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

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-[#1F1F1F] border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-6">
              {/* Language */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-3">Language</h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => toggleFilter(lang, selectedLanguages, setSelectedLanguages)}
                      className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                        selectedLanguages.includes(lang)
                          ? 'bg-[#FF0040] text-white'
                          : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-3">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => toggleFilter(genre, selectedGenres, setSelectedGenres)}
                      className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                        selectedGenres.includes(genre)
                          ? 'bg-[#FF0040] text-white'
                          : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-3">Format</h3>
                <div className="flex flex-wrap gap-2">
                  {formats.map(format => (
                    <button
                      key={format}
                      onClick={() => toggleFilter(format, selectedFormats, setSelectedFormats)}
                      className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                        selectedFormats.includes(format)
                          ? 'bg-[#FF0040] text-white'
                          : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-1.5 text-[#FF0040] hover:bg-[#FF0040]/10 rounded-full text-sm transition-colors self-end"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} found
          </p>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
            : 'flex flex-col gap-4'
          }>
            {filteredMovies.map(movie => (
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
  )
}

export default Movies
