import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Heart, Play, Star, Tv, Clapperboard, Flame, X, ChevronDown, ChevronRight } from 'lucide-react'
import { movies } from '../../data/mockData'
import { useToast } from '../../components/Toast/Toast'

const Stream = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [platform, setPlatform] = useState(searchParams.get('platform') || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredShows, setFeaturedShows] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const { showToast } = useToast()

  const platforms = [
    { id: 'all', name: 'All', icon: <Tv className="w-5 h-5" />, color: '#FF0040' },
    { id: 'netflix', name: 'Netflix', icon: <span className="text-lg">N</span>, color: '#E50914' },
    { id: 'prime', name: 'Prime Video', icon: <span className="text-lg">P</span>, color: '#00A8E1' },
    { id: 'hotstar', name: 'Hotstar', icon: <span className="text-lg">H</span>, color: '#0D5BBD' },
    { id: 'sonylive', name: 'SonyLIV', icon: <span className="text-lg">S</span>, color: '#2F4F4F' },
    { id: 'zee', name: 'ZEE5', icon: <span className="text-lg">Z</span>, color: '#0F4C81' }
  ]

  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
    setWatchlist(savedWatchlist)

    const shows = movies.map(m => ({
      ...m,
      platform: ['netflix', 'prime', 'hotstar', 'sonylive', 'zee'][Math.floor(Math.random() * 5)],
      streamingFrom: 'Now Streaming',
      quality: ['4K', 'HD', 'Full HD'][Math.floor(Math.random() * 3)]
    }))
    setFeaturedShows(shows)
  }, [])

  const filteredShows = featuredShows.filter(show => {
    const matchesPlatform = platform === 'all' || show.platform === platform
    const matchesSearch = show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesPlatform && matchesSearch
  })

  const toggleWatchlist = (show) => {
    let newWatchlist
    if (watchlist.includes(show.id)) {
      newWatchlist = watchlist.filter(id => id !== show.id)
      showToast('Removed from watchlist', 'info')
    } else {
      newWatchlist = [...watchlist, show.id]
      showToast('Added to watchlist', 'success')
    }
    setWatchlist(newWatchlist)
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist))
  }

  const getPlatformStyle = (platformId) => {
    const p = platforms.find(p => p.id === platformId)
    return p ? p.color : '#FF0040'
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Header Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-[#1A1A1A] via-[#2A1A2A] to-[#1A1A1A]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1200&h=400&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-8 h-full flex flex-col justify-end">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Play className="w-8 h-8 text-[#FF0040]" fill="#FF0040" />
            Stream
          </h1>
          <p className="text-gray-400">Watch exclusive shows and movies online</p>
        </div>
      </div>

      {/* Platform Filters */}
      <div className="sticky top-16 z-40 bg-[#1A1A1A] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                  platform === p.id
                    ? 'bg-[#FF0040] text-white'
                    : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                }`}
                style={platform === p.id ? { backgroundColor: p.color } : {}}
              >
                {p.icon}
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search shows, movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF0040]"
          />
        </div>
      </div>

      {/* Featured Section */}
      {platform === 'all' && (
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FF0040]" />
              Featured This Week
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredShows.slice(0, 3).map((show, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden bg-[#1F1F1F] border border-gray-800 hover:border-[#FF0040] transition-all cursor-pointer">
                <div className="relative aspect-[16/9]">
                  <img 
                    src={show.backdrop || show.poster} 
                    alt={show.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-[#FF0040]/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </div>

                  {/* Platform Badge */}
                  <span 
                    className="absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full text-white"
                    style={{ backgroundColor: getPlatformStyle(show.platform) }}
                  >
                    {platforms.find(p => p.id === show.platform)?.name}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg truncate">{show.title}</h3>
                    <div className="flex items-center gap-3 text-gray-300 text-sm mt-1">
                      <span>{show.genre[0]}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" fill="#fbbf24" />
                        {show.rating}
                      </span>
                      <span>•</span>
                      <span>{show.quality}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Watchlist Section */}
      {watchlist.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#FF0040] rounded-full" />
            <h2 className="text-xl font-bold text-white">My Watchlist</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {featuredShows.filter(s => watchlist.includes(s.id)).map((show) => (
              <Link
                key={show.id}
                to={`/movie/${show.id}`}
                className="flex-shrink-0 w-40"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#2A2A2A]">
                  <img 
                    src={show.poster} 
                    alt={show.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      toggleWatchlist(show)
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-[#FF0040] transition-colors"
                  >
                    <Heart className="w-4 h-4 text-white fill-[#FF0040]" />
                  </button>
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white text-sm font-medium truncate">{show.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Shows Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {platform === 'all' ? 'All Shows' : platforms.find(p => p.id === platform)?.name}
          </h2>
          <p className="text-gray-400 text-sm">{filteredShows.length} shows available</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredShows.map((show) => (
            <Link
              key={show.id}
              to={`/movie/${show.id}`}
              className="group"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#2A2A2A]">
                <img 
                  src={show.poster} 
                  alt={show.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Platform Badge */}
                <span 
                  className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded text-white"
                  style={{ backgroundColor: getPlatformStyle(show.platform) }}
                >
                  {platforms.find(p => p.id === show.platform)?.name}
                </span>

                {/* Watchlist Button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    toggleWatchlist(show)
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-[#FF0040] transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Heart className={`w-4 h-4 ${watchlist.includes(show.id) ? 'text-[#FF0040] fill-[#FF0040]' : 'text-white'}`} />
                </button>

                {/* Rating */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded">
                    <Star className="w-3 h-3" fill="#22c55e" />
                    {show.rating}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2">
                  <h3 className="text-white text-sm font-medium truncate text-right">{show.title}</h3>
                  <p className="text-gray-400 text-xs text-right">{show.streamingFrom}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredShows.length === 0 && (
          <div className="text-center py-16">
            <Tv className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium text-lg">No shows found</h3>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Stream
