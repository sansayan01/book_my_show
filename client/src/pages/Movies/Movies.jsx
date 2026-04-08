import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, X, Star } from 'lucide-react'
import MovieCard from '../../components/MovieCard/MovieCard'
import { movies, genres, languages } from '../../data/mockData'

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('popularity')

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          movie.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'All' || movie.genre.includes(selectedGenre)
    const matchesLanguage = selectedLanguage === 'All' || movie.language === selectedLanguage
    return matchesSearch && matchesGenre && matchesLanguage
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'date') return new Date(b.releaseDate) - new Date(a.releaseDate)
    return 0
  })

  const clearFilters = () => {
    setSelectedGenre('All')
    setSelectedLanguage('All')
    setSearchQuery('')
  }

  const hasActiveFilters = selectedGenre !== 'All' || selectedLanguage !== 'All' || searchQuery

  return (
    <div className="bg-[#1A1A1A] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Movies</h1>
          <p className="text-gray-400 mt-2">Book tickets for the latest movies</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F84565] transition-colors"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
              showFilters || hasActiveFilters 
                ? 'bg-[#F84565] border-[#F84565] text-white' 
                : 'bg-[#2A2A2A] border-gray-700 text-gray-300 hover:border-[#F84565]'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#F84565]"
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="date">Release Date</option>
          </select>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-[#2A2A2A] rounded-xl p-6 mb-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[#F84565] text-sm hover:underline flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Genre */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Genre</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedGenre('All')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedGenre === 'All'
                        ? 'bg-[#F84565] text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    All
                  </button>
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedGenre === genre
                          ? 'bg-[#F84565] text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Language</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedLanguage('All')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedLanguage === 'All'
                        ? 'bg-[#F84565] text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    All
                  </button>
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedLanguage === lang
                          ? 'bg-[#F84565] text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} found
          </p>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-[#F84565] text-white rounded-lg hover:bg-[#d63a54] transition-colors"
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
