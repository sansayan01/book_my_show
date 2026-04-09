import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar,
  Play,
  ChevronRight,
  Filter,
  X,
  Clock,
  Star,
  MapPin,
  Megaphone,
  Film,
  Zap,
  Share2,
  Heart,
  Bell,
  TrendingUp,
  Ticket
} from 'lucide-react'
import { movies, genres } from '../../data/mockData'

const Timeline = () => {
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [showFilter, setShowFilter] = useState(false)
  const [activeTab, setActiveTab] = useState('upcoming')

  const months = ['All', 'April', 'May', 'June', 'July', 'August']

  const upcomingMovies = useMemo(() => {
    return movies.filter(movie => {
      const monthMatch = selectedMonth === 'All' || 
        movie.releaseDate?.includes(`2026-0${months.indexOf(selectedMonth)}`) ||
        movie.releaseDate?.includes(`2026-${months.indexOf(selectedMonth) < 10 ? '0' + months.indexOf(selectedMonth) : months.indexOf(selectedMonth)}`)
      const genreMatch = selectedGenre === 'All' || movie.genre?.includes(selectedGenre)
      return monthMatch && genreMatch
    }).sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate))
  }, [selectedGenre, selectedMonth])

  const announcements = [
    {
      id: 1,
      type: 'announcement',
      title: 'IMAX 70mm Coming to Mumbai',
      description: 'Experience movies like never before with our new IMAX 70mm screen at INOX: Phoenix Mall.',
      date: 'April 10, 2026',
      icon: Zap,
      color: '#FF0040'
    },
    {
      id: 2,
      type: 'announcement',
      title: 'Summer Blockbuster Sale',
      description: 'Get up to 40% off on all bookings this summer. Use code SUMMER40.',
      date: 'April 15, 2026',
      icon: TrendingUp,
      color: '#22C55E'
    },
    {
      id: 3,
      type: 'announcement',
      title: 'New Multiplex Opening',
      description: 'PVR Cinemas opens its 500th screen in Bangalore. Grand opening offers!',
      date: 'April 20, 2026',
      icon: MapPin,
      color: '#3B82F6'
    }
  ]

  const trailers = [
    {
      id: 1,
      movieId: '1',
      title: 'Thunderbolts*',
      thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop',
      views: '2.5M',
      releaseDate: 'April 3, 2026'
    },
    {
      id: 2,
      movieId: '8',
      title: 'KGF: Chapter 3',
      thumbnail: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=225&fit=crop',
      views: '5.1M',
      releaseDate: 'Coming Soon'
    },
    {
      id: 3,
      movieId: '9',
      title: 'Dune: Part Three',
      thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=225&fit=crop',
      views: '3.8M',
      releaseDate: 'April 15, 2026'
    },
    {
      id: 4,
      movieId: '10',
      title: 'Pushpa 2: The Rule',
      thumbnail: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=400&h=225&fit=crop',
      views: '8.2M',
      releaseDate: 'April 20, 2026'
    }
  ]

  const clearFilters = () => {
    setSelectedGenre('All')
    setSelectedMonth('All')
  }

  const hasActiveFilters = selectedGenre !== 'All' || selectedMonth !== 'All'

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getDaysUntilRelease = (dateString) => {
    if (!dateString) return null
    const releaseDate = new Date(dateString)
    const today = new Date()
    const diffTime = releaseDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1A1A1A] via-[#222] to-[#1A1A1A] px-4 py-8 border-b border-[#333]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Film className="w-8 h-8 text-[#FF0040]" />
            Movie Timeline
          </h1>
          <p className="text-gray-400">Stay updated with upcoming releases, trailers & announcements</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2" role="tablist">
          {[
            { id: 'upcoming', label: 'Upcoming', icon: Calendar },
            { id: 'trailers', label: 'Trailers', icon: Play },
            { id: 'announcements', label: 'Announcements', icon: Megaphone }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#FF0040] text-white'
                  : 'bg-[#222] text-gray-300 hover:bg-[#333]'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        {activeTab === 'upcoming' && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                showFilter || hasActiveFilters
                  ? 'bg-[#FF0040] text-white'
                  : 'bg-[#222] text-gray-300 hover:bg-[#333]'
              }`}
              aria-expanded={showFilter}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
                  2
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}

            {/* Quick Genre Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
              {['All', 'Action', 'Drama', 'Sci-Fi', 'Horror', 'Comedy'].map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedGenre === genre
                      ? 'bg-[#FF0040] text-white'
                      : 'bg-[#222] text-gray-300 hover:bg-[#333]'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expanded Filter Panel */}
        {showFilter && activeTab === 'upcoming' && (
          <div className="bg-[#222] rounded-xl border border-[#333] p-4 mb-6 animate-fade-in">
            <h3 className="font-semibold text-white mb-3">Filter by Genre</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre === selectedGenre ? 'All' : genre)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedGenre === genre
                      ? 'bg-[#FF0040] text-white'
                      : 'bg-[#333] text-gray-300 hover:bg-[#444]'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            <h3 className="font-semibold text-white mb-3">Filter by Month</h3>
            <div className="flex flex-wrap gap-2">
              {months.map(month => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedMonth === month
                      ? 'bg-[#FF0040] text-white'
                      : 'bg-[#333] text-gray-300 hover:bg-[#444]'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Movies Grid */}
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {upcomingMovies.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Film className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">No movies found for the selected filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-[#FF0040] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              upcomingMovies.map((movie) => {
                const daysUntil = getDaysUntilRelease(movie.releaseDate)
                return (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="group"
                  >
                    <div className="relative rounded-xl overflow-hidden mb-3">
                      <img 
                        src={movie.poster} 
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      {/* Days until release badge */}
                      {daysUntil !== null && daysUntil <= 30 && (
                        <div className="absolute top-2 right-2 bg-[#FF0040] text-white text-xs px-2 py-1 rounded-lg font-semibold">
                          {daysUntil === 0 ? 'Today!' : `${daysUntil} days`}
                        </div>
                      )}

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 bg-[#FF0040] rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>

                      {/* Bottom info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#22C55E] text-white text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <Star className="w-3 h-3" /> {movie.rating}
                          </span>
                          {movie.imax && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-medium">
                              IMAX
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <h3 className="font-bold text-white group-hover:text-[#FF0040] transition-colors truncate">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(movie.releaseDate)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{movie.genre?.slice(0, 2).join(', ')}</p>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="flex-1 bg-[#FF0040] text-white text-xs py-2 rounded-lg font-medium flex items-center justify-center gap-1 hover:bg-[#E6003A]"
                        aria-label={`Book tickets for ${movie.title}`}
                      >
                        <Ticket className="w-3 h-3" /> Book
                      </button>
                      <button 
                        className="p-2 bg-[#333] text-gray-300 rounded-lg hover:bg-[#444] hover:text-pink-500 transition-colors"
                        aria-label={`Add ${movie.title} to watchlist`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 bg-[#333] text-gray-300 rounded-lg hover:bg-[#444] hover:text-[#FF0040] transition-colors"
                        aria-label={`Set reminder for ${movie.title}`}
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        )}

        {/* Trailers Tab */}
        {activeTab === 'trailers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {trailers.map((trailer) => (
              <div 
                key={trailer.id}
                className="bg-[#222] rounded-xl border border-[#333] overflow-hidden group"
              >
                <div className="relative">
                  <img 
                    src={trailer.thumbnail}
                    alt={`${trailer.title} trailer`}
                    className="w-full aspect-video object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-[#FF0040] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      Watch Trailer
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1">{trailer.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {trailer.releaseDate}
                    </span>
                    <span>{trailer.views} views</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button 
                      className="flex-1 bg-[#FF0040] text-white text-sm py-2 rounded-lg font-medium flex items-center justify-center gap-1 hover:bg-[#E6003A]"
                      aria-label={`Book tickets for ${trailer.title}`}
                    >
                      <Ticket className="w-4 h-4" /> Book Now
                    </button>
                    <button 
                      className="p-2 bg-[#333] text-gray-300 rounded-lg hover:bg-[#444] transition-colors"
                      aria-label="Share trailer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="space-y-4 mb-8">
            {announcements.map((announcement) => (
              <div 
                key={announcement.id}
                className="bg-[#222] rounded-xl border border-[#333] p-5 hover:bg-[#252525] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${announcement.color}20` }}
                  >
                    <announcement.icon className="w-6 h-6" style={{ color: announcement.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white text-lg mb-1">{announcement.title}</h3>
                        <p className="text-gray-400">{announcement.description}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{announcement.date}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="px-4 py-2 bg-[#FF0040] text-white text-sm rounded-lg font-medium hover:bg-[#E6003A] transition-colors">
                        Learn More
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Timeline
