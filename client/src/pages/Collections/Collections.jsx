import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, Heart, Flame, Ghost, Sword, Users, Crown, 
  Sparkles, ChevronRight, Play, Clock, Film, 
  Bookmark, Eye, ThumbsUp, Award, Filter, Grid, List
} from 'lucide-react'
import { movies } from '../../data/mockData'

// Theme Categories with Icons
const themeCategories = [
  { id: 'action', label: 'Action', icon: Sword, color: '#FF4444', gradient: 'from-red-500/20 to-transparent' },
  { id: 'romance', label: 'Romance', icon: Heart, color: '#FF69B4', gradient: 'from-pink-500/20 to-transparent' },
  { id: 'comedy', label: 'Comedy', icon: Star, color: '#FFD700', gradient: 'from-yellow-500/20 to-transparent' },
  { id: 'horror', label: 'Horror', icon: Ghost, color: '#8B5CF6', gradient: 'from-purple-500/20 to-transparent' },
  { id: 'thriller', label: 'Thriller', icon: Flame, color: '#FF6B35', gradient: 'from-orange-500/20 to-transparent' },
  { id: 'scifi', label: 'Sci-Fi', icon: Sparkles, color: '#3B82F6', gradient: 'from-blue-500/20 to-transparent' },
  { id: 'drama', label: 'Drama', icon: Film, color: '#10B981', gradient: 'from-green-500/20 to-transparent' },
  { id: 'animation', label: 'Animation', icon: Award, color: '#EC4899', gradient: 'from-pink-500/20 to-transparent' }
]

// Curated Lists
const curatedLists = [
  {
    id: 1,
    title: 'Blockbusters of 2026',
    description: 'The biggest hits dominating theaters worldwide',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
    count: 25,
    movies: movies.slice(0, 5),
    featured: true
  },
  {
    id: 2,
    title: 'Award Winners',
    description: 'Oscar, BAFTA & Golden Globe nominees and winners',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
    count: 18,
    movies: movies.slice(1, 6),
    featured: false
  },
  {
    id: 3,
    title: 'Feel-Good Comedies',
    description: 'Movies that will make you laugh out loud',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800',
    count: 20,
    movies: movies.slice(2, 7),
    featured: false
  },
  {
    id: 4,
    title: 'Mind-Bending Thrillers',
    description: 'Keep you on the edge of your seat',
    image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800',
    count: 15,
    movies: movies.slice(0, 5),
    featured: false
  },
  {
    id: 5,
    title: 'Emotional Dramas',
    description: 'Stories that touch your heart',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    count: 22,
    movies: movies.slice(1, 6),
    featured: false
  },
  {
    id: 6,
    title: 'Sci-Fi Adventures',
    description: 'Journey through space and imagination',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800',
    count: 16,
    movies: movies.slice(2, 7),
    featured: false
  }
]

// Staff Picks
const staffPicks = [
  {
    id: 1,
    movie: movies[0],
    staffName: 'Sarah M.',
    staffRole: 'Content Curator',
    staffAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    comment: 'A masterpiece of modern cinema that redefines the superhero genre.'
  },
  {
    id: 2,
    movie: movies[1],
    staffName: 'James K.',
    staffRole: 'Film Critic',
    staffAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    comment: 'Visually stunning with a story that stays with you long after.'
  },
  {
    id: 3,
    movie: movies[2],
    staffName: 'Priya R.',
    staffRole: 'Entertainment Lead',
    staffAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    comment: 'Perfect weekend watch with the family!'
  },
  {
    id: 4,
    movie: movies[3],
    staffName: 'Mike T.',
    staffRole: 'Events Director',
    staffAvatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    comment: 'Non-stop action from start to finish.'
  }
]

// Watch Again (User's history)
const watchAgain = [
  { movie: movies[0], lastWatched: '2 days ago', watchCount: 3 },
  { movie: movies[1], lastWatched: '1 week ago', watchCount: 5 },
  { movie: movies[2], lastWatched: '2 weeks ago', watchCount: 2 }
]

// Movie Card
const MovieCard = ({ movie, index, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {viewMode === 'grid' ? (
        <Link to={`/movie/${movie.id}`} className="block">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#2A2A2A]">
            <img 
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#FF0040] rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 rounded-lg">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-semibold">{movie.rating}</span>
            </div>
          </div>
          <h3 className="text-white font-medium mt-2 truncate group-hover:text-[#FF0040] transition-colors">
            {movie.title}
          </h3>
        </Link>
      ) : (
        <Link 
          to={`/movie/${movie.id}`}
          className="flex gap-4 bg-[#2A2A2A] rounded-xl p-3 hover:bg-[#3A3A3A] transition-colors"
        >
          <img 
            src={movie.poster}
            alt={movie.title}
            className="w-20 h-28 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">{movie.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{movie.rating}</span>
              <span>•</span>
              <span>{movie.language}</span>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2">{movie.description}</p>
          </div>
        </Link>
      )}
    </motion.div>
  )
}

// Curated List Card
const CuratedListCard = ({ list, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/collections/${list.id}`} className="block">
        <div className="relative h-48 rounded-xl overflow-hidden bg-[#2A2A2A]">
          {/* Featured Image */}
          <img 
            src={list.image}
            alt={list.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#FF0040]" />
              <span className="text-[#FF0040] text-xs font-bold uppercase tracking-wider">Curated</span>
            </div>
            <h3 className="text-white text-lg font-bold mb-1">{list.title}</h3>
            <p className="text-gray-300 text-sm line-clamp-1">{list.description}</p>
            
            {/* Movies Preview */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex -space-x-2">
                {list.movies.slice(0, 3).map((movie, i) => (
                  <img 
                    key={i}
                    src={movie.poster}
                    alt=""
                    className="w-8 h-12 object-cover rounded border-2 border-[#1A1A1A]"
                  />
                ))}
              </div>
              <span className="text-gray-400 text-xs">{list.count} movies</span>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-[#FF0040]/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-[#FF0040]" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Staff Pick Card
const StaffPickCard = ({ pick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#2A2A2A] rounded-xl p-4 border border-gray-800 hover:border-[#FF0040]/50 transition-colors"
    >
      <div className="flex gap-4">
        <div className="relative w-20 h-28 flex-shrink-0">
          <Link to={`/movie/${pick.movie.id}`}>
            <img 
              src={pick.movie.poster}
              alt={pick.movie.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </Link>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={pick.staffAvatar}
              alt={pick.staffName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-white text-sm font-medium">{pick.staffName}</p>
              <p className="text-gray-500 text-xs">{pick.staffRole}</p>
            </div>
          </div>
          
          <Link to={`/movie/${pick.movie.id}`}>
            <h4 className="text-white font-medium hover:text-[#FF0040] transition-colors mb-1">
              {pick.movie.title}
            </h4>
          </Link>
          
          <p className="text-gray-400 text-sm line-clamp-2 italic">"{pick.comment}"</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
        <ThumbsUp className="w-4 h-4 text-[#FF0040]" />
        <span className="text-gray-500 text-xs">Staff Pick</span>
      </div>
    </motion.div>
  )
}

// Watch Again Card
const WatchAgainCard = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-4 bg-[#2A2A2A] rounded-xl p-3 hover:bg-[#3A3A3A] transition-colors"
    >
      <Link to={`/movie/${item.movie.id}`} className="relative w-16 h-24 flex-shrink-0">
        <img 
          src={item.movie.poster}
          alt={item.movie.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Play className="w-6 h-6 text-white" />
        </div>
      </Link>
      
      <div className="flex-1 min-w-0">
        <Link to={`/movie/${item.movie.id}`}>
          <h4 className="text-white font-medium truncate hover:text-[#FF0040] transition-colors">
            {item.movie.title}
          </h4>
        </Link>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Clock className="w-3 h-3" />
          <span>Last watched {item.lastWatched}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <Eye className="w-3 h-3" />
          <span>Watched {item.watchCount} times</span>
        </div>
      </div>
      
      <button className="px-3 py-1.5 bg-[#FF0040] text-white text-xs font-medium rounded-lg hover:bg-[#E6003A] transition-colors">
        <Play className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

// Theme Filter Chip
const ThemeChip = ({ theme, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
      active 
        ? 'bg-gradient-to-r from-[#FF0040] to-[#FF6B35] text-white shadow-lg shadow-[#FF0040]/30' 
        : 'bg-[#2A2A2A] text-gray-400 hover:text-white'
    }`}
  >
    <theme.icon className="w-4 h-4" style={{ color: active ? 'white' : theme.color }} />
    {theme.label}
  </button>
)

// Tab Button
const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
      active ? 'text-[#FF0040]' : 'text-gray-400 hover:text-white'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
    {count !== undefined && (
      <span className={`px-1.5 py-0.5 text-xs rounded ${active ? 'bg-[#FF0040] text-white' : 'bg-[#2A2A2A] text-gray-500'}`}>
        {count}
      </span>
    )}
    {active && (
      <motion.div 
        layoutId="collectionsTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF0040]"
      />
    )}
  </button>
)

// Main Collections Page
const Collections = () => {
  const [activeTab, setActiveTab] = useState('curated')
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('popularity')

  const tabs = [
    { id: 'curated', label: 'Curated Lists', icon: Sparkles, count: curatedLists.length },
    { id: 'themes', label: 'Browse by Theme', icon: Filter, count: themeCategories.length },
    { id: 'staffPicks', label: 'Staff Picks', icon: Crown, count: staffPicks.length },
    { id: 'watchAgain', label: 'Watch Again', icon: Bookmark, count: watchAgain.length }
  ]

  // Filter movies by theme
  const filteredMovies = selectedTheme
    ? movies.filter(m => m.genre.some(g => g.toLowerCase().includes(selectedTheme)))
    : movies

  // Sort movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return new Date(b.releaseDate) - new Date(a.releaseDate)
      case 'popularity':
      default:
        return b.rating * 100 - a.rating * 100 // Simplified popularity
    }
  })

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#222222] to-[#1A1A1A] py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF0040] to-[#FF6B35] rounded-full flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">Collections</h1>
              <p className="text-gray-400 text-sm">Curated movie lists for every mood</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            <span className="px-3 py-1.5 bg-[#FF0040]/20 text-[#FF0040] text-sm rounded-full">
              {curatedLists.length} Curated Lists
            </span>
            <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-sm rounded-full">
              {themeCategories.length} Themes
            </span>
            <span className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
              {staffPicks.length} Staff Picks
            </span>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
                label={tab.label}
                count={tab.count}
              />
            ))}
          </div>
          
          {/* View Mode Toggle (for movies view) */}
          {activeTab === 'themes' && (
            <div className="flex items-center gap-1 bg-[#2A2A2A] rounded-lg p-1">
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
          )}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Curated Lists */}
          {activeTab === 'curated' && (
            <motion.div
              key="curated"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Featured List */}
              <div className="mb-8">
                <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FFD700]" />
                  Featured Collection
                </h2>
                <CuratedListCard list={curatedLists[0]} index={0} />
              </div>

              {/* All Lists */}
              <h2 className="text-white text-xl font-bold mb-4">All Collections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {curatedLists.slice(1).map((list, idx) => (
                  <CuratedListCard key={list.id} list={list} index={idx + 1} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Browse by Theme */}
          {activeTab === 'themes' && (
            <motion.div
              key="themes"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Theme Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedTheme(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedTheme 
                      ? 'bg-[#FF0040] text-white shadow-lg shadow-[#FF0040]/30' 
                      : 'bg-[#2A2A2A] text-gray-400 hover:text-white'
                  }`}
                >
                  All Genres
                </button>
                {themeCategories.map(theme => (
                  <ThemeChip
                    key={theme.id}
                    theme={theme}
                    active={selectedTheme === theme.id}
                    onClick={() => setSelectedTheme(selectedTheme === theme.id ? null : theme.id)}
                  />
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 text-sm">
                  {sortedMovies.length} movies
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#2A2A2A] text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-[#FF0040]"
                >
                  <option value="popularity">Sort by Popularity</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="newest">Sort by Newest</option>
                </select>
              </div>

              {/* Movies Grid/List */}
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
                : 'space-y-3'
              }>
                {sortedMovies.map((movie, idx) => (
                  <MovieCard key={movie.id} movie={movie} index={idx} viewMode={viewMode} />
                ))}
              </div>

              {sortedMovies.length === 0 && (
                <div className="text-center py-16">
                  <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No movies found for this theme</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Staff Picks */}
          {activeTab === 'staffPicks' && (
            <motion.div
              key="staffPicks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staffPicks.map((pick, idx) => (
                  <StaffPickCard key={pick.id} pick={pick} index={idx} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Watch Again */}
          {activeTab === 'watchAgain' && (
            <motion.div
              key="watchAgain"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {watchAgain.length > 0 ? (
                <div className="space-y-3">
                  {watchAgain.map((item, idx) => (
                    <WatchAgainCard key={item.movie.id} item={item} index={idx} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">No watch history yet</p>
                  <p className="text-gray-500 text-sm">Start watching movies to see them here</p>
                  <Link 
                    to="/movies"
                    className="inline-block mt-4 px-6 py-2 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#E6003A] transition-colors"
                  >
                    Browse Movies
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Spacing for Mobile Nav */}
      <div className="h-20" />
    </div>
  )
}

export default Collections
