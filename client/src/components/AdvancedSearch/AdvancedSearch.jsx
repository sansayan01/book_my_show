import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, X, Clock, TrendingUp, Filter, Grid, List, 
  Calendar, Star, Languages, ThumbsUp, History, SlidersHorizontal,
  ChevronDown, ChevronRight
} from 'lucide-react'
import { movies } from '../../data/mockData'

// Trending searches (simulated)
const trendingSearches = [
  { term: 'Thunderbolts*', count: 12450 },
  { term: 'Jaat', count: 8920 },
  { term: 'KGF Chapter 3', count: 7650 },
  { term: 'Pushpa 2', count: 5430 },
  { term: 'Sikandar', count: 4210 },
  { term: 'Dune 3', count: 3890 },
  { term: 'The Royals', count: 3210 },
  { term: 'Captain America', count: 2980 }
]

// Search filters
const searchFilters = {
  genres: ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror', 'Sci-Fi', 'Adventure', 'Animation'],
  languages: ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'],
  years: ['2026', '2025', '2024', '2023', '2022', '2021'],
  ratings: [
    { label: '9+ Excellent', min: 9 },
    { label: '8+ Great', min: 8 },
    { label: '7+ Good', min: 7 },
    { label: '6+ Average', min: 6 }
  ]
}

// Recent Searches Manager
const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches')
    return saved ? JSON.parse(saved) : []
  })

  const addSearch = useCallback((term) => {
    if (!term.trim()) return
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== term.toLowerCase())
      const updated = [term, ...filtered].slice(0, 10)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeSearch = useCallback((term) => {
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== term)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }, [])

  return { recentSearches, addSearch, removeSearch, clearAll }
}

// Search Analytics
const useSearchAnalytics = () => {
  const [trending, setTrending] = useState(trendingSearches)
  
  const trackSearch = useCallback((term) => {
    // Simulate tracking - in real app, send to analytics
    console.log('Search tracked:', term)
  }, [])

  return { trending, trackSearch }
}

// Search Suggestion Item
const SuggestionItem = ({ movie, onSelect }) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      onClick={() => onSelect(movie.title)}
      className="flex items-center gap-3 p-3 hover:bg-[#2A2A2A] transition-colors group"
    >
      <div className="relative w-12 h-16 flex-shrink-0">
        <img 
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate group-hover:text-[#FF0040] transition-colors">
          {movie.title}
        </h4>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-green-400 fill-green-400" />
            {movie.rating}
          </span>
          <span>•</span>
          <span>{movie.language}</span>
          <span>•</span>
          <span>{movie.genre[0]}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#FF0040] transition-colors" />
    </Link>
  )
}

// Filter Chip
const FilterChip = ({ label, active, onClick, color }) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
      active 
        ? 'bg-[#FF0040] text-white' 
        : 'bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#3A3A3A]'
    }`}
  >
    {label}
  </motion.button>
)

const AdvancedSearch = ({ isOpen, onClose, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Filters
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedRating, setSelectedRating] = useState(null)
  
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const { recentSearches, addSearch, removeSearch, clearAll } = useRecentSearches()
  const { trending } = useSearchAnalytics()

  // Get suggestions based on query
  const suggestions = query.length >= 2 
    ? movies.filter(m => 
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.genre.some(g => g.toLowerCase().includes(query.toLowerCase()) ||
        m.director.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : []

  // Search with filters
  const performSearch = useCallback(() => {
    if (!query.trim() && selectedGenres.length === 0 && selectedLanguages.length === 0 && !selectedYear && !selectedRating) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    
    let results = [...movies]
    
    // Text search
    if (query.trim()) {
      results = results.filter(m => 
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.director.toLowerCase().includes(query.toLowerCase()) ||
        m.cast.some(c => c.name.toLowerCase().includes(query.toLowerCase()))
      )
    }
    
    // Genre filter
    if (selectedGenres.length > 0) {
      results = results.filter(m => 
        m.genre.some(g => selectedGenres.includes(g))
      )
    }
    
    // Language filter
    if (selectedLanguages.length > 0) {
      results = results.filter(m => 
        selectedLanguages.includes(m.language)
      )
    }
    
    // Year filter
    if (selectedYear) {
      results = results.filter(m => 
        m.releaseDate.startsWith(selectedYear)
      )
    }
    
    // Rating filter
    if (selectedRating) {
      results = results.filter(m => 
        m.rating >= selectedRating.min
      )
    }
    
    setTimeout(() => {
      setSearchResults(results)
      setIsSearching(false)
    }, 300)
  }, [query, selectedGenres, selectedLanguages, selectedYear, selectedRating])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    performSearch()
  }, [performSearch])

  const handleSelectSuggestion = (term) => {
    addSearch(term)
    setQuery(term)
    setShowSuggestions(false)
    performSearch()
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (query.trim()) {
      addSearch(query)
      setShowSuggestions(false)
      performSearch()
    }
  }

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const toggleLanguage = (lang) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    )
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedLanguages([])
    setSelectedYear(null)
    setSelectedRating(null)
  }

  const activeFiltersCount = selectedGenres.length + selectedLanguages.length + (selectedYear ? 1 : 0) + (selectedRating ? 1 : 0)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          ref={containerRef}
          className="bg-[#1A1A1A] max-w-4xl mx-auto rounded-b-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Search Header */}
          <div className="p-4 border-b border-gray-800">
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setShowSuggestions(e.target.value.length >= 2)
                }}
                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                placeholder="Search movies, directors, actors..."
                className="w-full pl-12 pr-12 py-4 bg-[#2A2A2A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0040] text-lg"
              />
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-[#FF0040] text-white'
                    : 'bg-[#3A3A3A] text-gray-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#FF0040] rounded-full text-xs font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setSearchResults([])
                    inputRef.current?.focus()
                  }}
                  className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-4 right-4 mt-2 bg-[#2A2A2A] rounded-xl shadow-xl border border-gray-700 overflow-hidden z-50"
                >
                  <div className="p-2">
                    <p className="text-gray-500 text-xs px-3 py-2 uppercase tracking-wider font-semibold">
                      Suggestions
                    </p>
                    {suggestions.map(movie => (
                      <SuggestionItem
                        key={movie.id}
                        movie={movie}
                        onSelect={handleSelectSuggestion}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-gray-800 overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {/* Genres */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white text-sm font-semibold flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#FF0040] rounded-full" />
                        Genre
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchFilters.genres.map(genre => (
                        <FilterChip
                          key={genre}
                          label={genre}
                          active={selectedGenres.includes(genre)}
                          onClick={() => toggleGenre(genre)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white text-sm font-semibold flex items-center gap-2">
                        <Languages className="w-4 h-4 text-blue-400" />
                        Language
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchFilters.languages.map(lang => (
                        <FilterChip
                          key={lang}
                          label={lang}
                          active={selectedLanguages.includes(lang)}
                          onClick={() => toggleLanguage(lang)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Year */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white text-sm font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-400" />
                        Release Year
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchFilters.years.map(year => (
                        <FilterChip
                          key={year}
                          label={year}
                          active={selectedYear === year}
                          onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white text-sm font-semibold flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        Rating
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchFilters.ratings.map(rating => (
                        <FilterChip
                          key={rating.min}
                          label={rating.label}
                          active={selectedRating?.min === rating.min}
                          onClick={() => setSelectedRating(selectedRating?.min === rating.min ? null : rating)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <div className="flex justify-end">
                      <button
                        onClick={clearFilters}
                        className="text-[#FF0040] text-sm hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">
                    {searchResults.length} results found
                  </h3>
                  <div className="flex gap-1 bg-[#2A2A2A] rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#FF0040] text-white' : 'text-gray-400'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#FF0040] text-white' : 'text-gray-400'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
                  : 'space-y-3'
                }>
                  {searchResults.map((movie, idx) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {viewMode === 'grid' ? (
                        <Link to={`/movie/${movie.id}`} className="block group">
                          <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#2A2A2A] mb-2">
                            <img 
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/70 rounded">
                              <Star className="w-3 h-3 text-green-400 fill-green-400" />
                              <span className="text-white text-xs font-semibold">{movie.rating}</span>
                            </div>
                          </div>
                          <h4 className="text-white text-sm font-medium truncate group-hover:text-[#FF0040] transition-colors">
                            {movie.title}
                          </h4>
                          <p className="text-gray-500 text-xs">{movie.language} • {movie.genre[0]}</p>
                        </Link>
                      ) : (
                        <Link 
                          to={`/movie/${movie.id}`}
                          className="flex gap-4 bg-[#2A2A2A] rounded-xl p-3 hover:bg-[#3A3A3A] transition-colors"
                        >
                          <img src={movie.poster} alt={movie.title} className="w-16 h-24 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">{movie.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Star className="w-4 h-4 text-green-400 fill-green-400" />
                              <span>{movie.rating}</span>
                              <span>•</span>
                              <span>{movie.language}</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1 line-clamp-1">{movie.description}</p>
                          </div>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Initial State - Trending & Recent */}
            {searchResults.length === 0 && !isSearching && (
              <div className="p-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <History className="w-4 h-4 text-gray-400" />
                        Recent Searches
                      </h3>
                      <button 
                        onClick={clearAll}
                        className="text-[#FF0040] text-sm hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => handleSelectSuggestion(term)}
                          className="flex items-center gap-2 px-3 py-2 bg-[#2A2A2A] rounded-full text-gray-300 hover:bg-[#3A3A3A] hover:text-white transition-colors group"
                        >
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span>{term}</span>
                          <X 
                            className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-[#FF0040]"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSearch(term)
                            }}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[#FF0040]" />
                    Trending Searches
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {trending.map((item, idx) => (
                      <motion.button
                        key={item.term}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleSelectSuggestion(item.term)}
                        className="flex items-center gap-3 p-3 bg-[#2A2A2A] rounded-xl hover:bg-[#3A3A3A] transition-colors text-left"
                      >
                        <span className="w-6 h-6 bg-[#FF0040]/20 rounded-full flex items-center justify-center text-[#FF0040] text-xs font-bold">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.term}</p>
                          <p className="text-gray-500 text-xs">{item.count.toLocaleString()} searches</p>
                        </div>
                        <ThumbsUp className="w-4 h-4 text-gray-500" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quick Filters */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Quick Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Action', 'Hindi', '9+ Rating', '2026'].map((filter, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (filter === '9+ Rating') {
                            setSelectedRating({ min: 9, label: '9+ Excellent' })
                          } else if (['Action', 'Drama', 'Comedy', 'Thriller'].includes(filter)) {
                            toggleGenre(filter)
                          } else if (['English', 'Hindi', 'Tamil'].includes(filter)) {
                            toggleLanguage(filter)
                          } else {
                            setSelectedYear(filter)
                          }
                          setShowFilters(true)
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-[#FF0040]/20 to-transparent border border-[#FF0040]/30 rounded-full text-gray-300 hover:text-white hover:border-[#FF0040] transition-colors text-sm"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="p-8 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FF0040] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* No Results */}
            {searchResults.length === 0 && query && !isSearching && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">No results found</h3>
                <p className="text-gray-400 text-sm mb-4">Try different keywords or adjust your filters</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-[#FF0040] text-white rounded-lg text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AdvancedSearch
