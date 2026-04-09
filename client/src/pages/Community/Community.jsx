import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users,
  Star,
  Heart,
  Share2,
  TrendingUp,
  MessageCircle,
  ThumbsUp,
  Trophy,
  Calendar,
  Film,
  ChevronRight,
  UserPlus,
  Search,
  Filter,
  Crown,
  Zap
} from 'lucide-react'
import { movies } from '../../data/mockData'

const Community = () => {
  const [activeTab, setActiveTab] = useState('ratings')
  const [compareMovies, setCompareMovies] = useState([])

  // Mock user ratings data
  const userRatings = [
    { movieId: '1', movieTitle: 'Thunderbolts*', userRating: 4.5, globalRating: 4.2, yourRating: 4.5 },
    { movieId: '2', movieTitle: 'Jaat', userRating: 4.2, globalRating: 4.0, yourRating: null },
    { movieId: '6', movieTitle: 'Captain America: Brave New World', userRating: 4.3, globalRating: 4.1, yourRating: 4.0 }
  ]

  // Mock friends data
  const friends = [
    { id: 1, name: 'Priya Sharma', avatar: 1, moviesWatched: 45, rating: 4.8, mutual: true },
    { id: 2, name: 'Rahul Verma', avatar: 2, moviesWatched: 32, rating: 4.5, mutual: true },
    { id: 3, name: 'Ananya Patel', avatar: 3, moviesWatched: 58, rating: 4.9, mutual: false },
    { id: 4, name: 'Vikram Singh', avatar: 4, moviesWatched: 28, rating: 4.3, mutual: true },
    { id: 5, name: 'Sneha Gupta', avatar: 5, moviesWatched: 41, rating: 4.6, mutual: false }
  ]

  // Mock activity feed
  const activityFeed = [
    {
      id: 1,
      user: { name: 'Priya Sharma', avatar: 1 },
      action: 'rated',
      target: 'Thunderbolts*',
      rating: 5,
      time: '2 mins ago',
      comment: 'Mind-blowing action sequences!'
    },
    {
      id: 2,
      user: { name: 'Rahul Verma', avatar: 2 },
      action: 'watched',
      target: 'Captain America: Brave New World',
      time: '1 hour ago'
    },
    {
      id: 3,
      user: { name: 'Ananya Patel', avatar: 3 },
      action: 'added',
      target: 'KGF: Chapter 3',
      time: '3 hours ago',
      type: 'watchlist'
    },
    {
      id: 4,
      user: { name: 'Vikram Singh', avatar: 4 },
      action: 'reviewed',
      target: 'Jaat',
      time: '5 hours ago',
      comment: 'Great action drama!'
    },
    {
      id: 5,
      user: { name: 'Sneha Gupta', avatar: 5 },
      action: 'shared',
      target: 'Dune: Part Three',
      time: 'Yesterday',
      type: 'watchlist'
    }
  ]

  // Mock leaderboard
  const leaderboard = [
    { rank: 1, user: 'Ananya Patel', avatar: 3, points: 15420, badge: 'Crown', change: '+2' },
    { rank: 2, user: 'Priya Sharma', avatar: 1, points: 14850, badge: 'Star', change: '+1' },
    { rank: 3, user: 'Sneha Gupta', avatar: 5, points: 13200, badge: 'Zap', change: '-2' },
    { rank: 4, user: 'Rahul Verma', avatar: 2, points: 11800, badge: 'Flame', change: '+3' },
    { rank: 5, user: 'Vikram Singh', avatar: 4, points: 10500, badge: 'Fire', change: '-1' }
  ]

  const toggleCompare = (movie) => {
    if (compareMovies.find(m => m.id === movie.id)) {
      setCompareMovies(compareMovies.filter(m => m.id !== movie.id))
    } else if (compareMovies.length < 3) {
      setCompareMovies([...compareMovies, movie])
    }
  }

  const getBadgeColor = (badge) => {
    const colors = {
      Crown: 'text-yellow-500',
      Star: 'text-blue-400',
      Zap: 'text-purple-400',
      Flame: 'text-orange-500',
      Fire: 'text-red-500'
    }
    return colors[badge] || 'text-gray-400'
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="w-8 h-8" />
            Community
          </h1>
          <p className="text-white/80 text-lg">Connect with movie lovers, compare ratings, and share your watchlist</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex gap-2 py-4 overflow-x-auto pb-2" role="tablist">
          {[
            { id: 'ratings', label: 'Ratings', icon: Star },
            { id: 'feed', label: 'Activity', icon: Activity },
            { id: 'friends', label: 'Friends', icon: Users },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
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

        {/* Ratings Comparison */}
        {activeTab === 'ratings' && (
          <div className="space-y-6">
            {/* Compare Section */}
            <div className="bg-[#222] rounded-xl border border-[#333] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#FF0040]" />
                  Compare Ratings
                </h3>
                <span className="text-sm text-gray-400">
                  {compareMovies.length}/3 selected
                </span>
              </div>

              {/* Compare Movies Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {movies.slice(0, 6).map((movie) => {
                  const isSelected = compareMovies.find(m => m.id === movie.id)
                  return (
                    <div
                      key={movie.id}
                      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-[#FF0040]' : 'hover:ring-2 hover:ring-[#444]'
                      }`}
                      onClick={() => toggleCompare(movie)}
                      role="checkbox"
                      aria-checked={!!isSelected}
                      tabIndex={0}
                    >
                      <img 
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-medium text-sm truncate">{movie.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-yellow-400 flex items-center gap-1">
                            <Star className="w-3 h-3" /> {movie.rating}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#FF0040] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{compareMovies.indexOf(movie) + 1}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Comparison Chart */}
              {compareMovies.length >= 2 && (
                <div className="bg-[#1A1A1A] rounded-xl p-4 mt-4">
                  <h4 className="font-semibold text-white mb-4">Rating Comparison</h4>
                  <div className="space-y-4">
                    {compareMovies.map((movie, index) => (
                      <div key={movie.id} className="flex items-center gap-4">
                        <img 
                          src={movie.poster}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-medium text-sm">{movie.title}</span>
                            <span className="text-yellow-400 text-sm font-semibold">{movie.rating}/5</span>
                          </div>
                          <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#FF0040] to-[#FF6B35] rounded-full transition-all"
                              style={{ width: `${(movie.rating / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Ratings List */}
            <div className="bg-[#222] rounded-xl border border-[#333] p-5">
              <h3 className="font-bold text-white text-lg mb-4">Your Rating History</h3>
              <div className="space-y-3">
                {userRatings.map((item) => (
                  <div 
                    key={item.movieId}
                    className="flex items-center gap-4 p-3 bg-[#1A1A1A] rounded-xl hover:bg-[#252525] transition-colors"
                  >
                    <img 
                      src={movies.find(m => m.id === item.movieId)?.poster}
                      alt={item.movieTitle}
                      className="w-14 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{item.movieTitle}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-400">
                          Global: {item.globalRating} ★
                        </span>
                        {item.yourRating && (
                          <span className="text-xs text-[#FF0040]">
                            Your: {item.yourRating} ★
                          </span>
                        )}
                      </div>
                    </div>
                    {item.yourRating ? (
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(item.yourRating) ? 'fill-current' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <button className="px-3 py-1.5 bg-[#FF0040] text-white text-xs rounded-lg font-medium">
                        Rate Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity Feed */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            <div className="bg-[#222] rounded-xl border border-[#333] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#FF6B35]" />
                  Friend Activity
                </h3>
                <button className="text-sm text-[#FF0040] hover:underline">
                  Filter
                </button>
              </div>
              <div className="space-y-4">
                {activityFeed.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex gap-3 pb-4 border-b border-[#333] last:border-0 last:pb-0"
                  >
                    <img 
                      src={`https://i.pravatar.cc/150?img=${activity.user.avatar}`}
                      alt={activity.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-white">{activity.user.name}</span>{' '}
                        <span className="text-gray-400">
                          {activity.action}{' '}
                          <span className="text-[#FF0040]">{activity.target}</span>
                          {activity.rating && (
                            <span className="text-yellow-400 ml-1">
                              {' '}{[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 inline ${i < activity.rating ? 'fill-current' : 'text-gray-600'}`} />
                              ))}
                            </span>
                          )}
                        </span>
                      </p>
                      {activity.comment && (
                        <p className="text-sm text-gray-400 mt-1 italic">"{activity.comment}"</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500">{activity.time}</span>
                        <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> Like
                        </button>
                        <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> Comment
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="space-y-6">
            {/* Find Friends */}
            <div className="bg-[#222] rounded-xl border border-[#333] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg">Suggested Friends</h3>
                <Link to="/search" className="text-sm text-[#FF0040] hover:underline flex items-center gap-1">
                  <UserPlus className="w-4 h-4" /> Find More
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {friends.filter(f => !f.mutual).slice(0, 3).map((friend) => (
                  <div 
                    key={friend.id}
                    className="bg-[#1A1A1A] rounded-xl p-4 text-center"
                  >
                    <img 
                      src={`https://i.pravatar.cc/150?img=${friend.avatar + 30}`}
                      alt={friend.name}
                      className="w-16 h-16 rounded-full mx-auto mb-2"
                    />
                    <h4 className="font-medium text-white text-sm">{friend.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {friend.moviesWatched} movies • {friend.rating} ★
                    </p>
                    <button className="mt-3 w-full bg-[#FF0040] text-white text-xs py-2 rounded-lg font-medium flex items-center justify-center gap-1">
                      <UserPlus className="w-3 h-3" /> Add Friend
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Friends List */}
            <div className="bg-[#222] rounded-xl border border-[#333] p-5">
              <h3 className="font-bold text-white text-lg mb-4">Your Friends ({friends.length})</h3>
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div 
                    key={friend.id}
                    className="flex items-center gap-4 p-3 bg-[#1A1A1A] rounded-xl hover:bg-[#252525] transition-colors"
                  >
                    <div className="relative">
                      <img 
                        src={`https://i.pravatar.cc/150?img=${friend.avatar}`}
                        alt={friend.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1A1A1A]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white flex items-center gap-2">
                        {friend.name}
                        {friend.mutual && (
                          <span className="text-xs text-[#FF0040] bg-[#FF0040]/20 px-2 py-0.5 rounded">
                            Mutual
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {friend.moviesWatched} movies watched • {friend.rating} avg rating
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-[#333] text-gray-300 rounded-lg hover:bg-[#444] transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-[#333] text-gray-300 rounded-lg hover:bg-[#444] transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
              <div className="p-5 border-b border-[#333]">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Weekly Leaderboard
                </h3>
                <p className="text-sm text-gray-400 mt-1">Top movie critics this week</p>
              </div>
              
              {/* Top 3 Podium */}
              <div className="p-6 bg-gradient-to-b from-[#1A1A1A] to-[#222]">
                <div className="flex items-end justify-center gap-4">
                  {/* 2nd Place */}
                  <div className="text-center">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${leaderboard[1].avatar}`}
                      alt={leaderboard[1].user}
                      className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-400"
                    />
                    <span className="text-2xl">🥈</span>
                    <p className="font-medium text-white text-sm mt-1">{leaderboard[1].user.split(' ')[0]}</p>
                    <p className="text-xs text-gray-400">{leaderboard[1].points.toLocaleString()} pts</p>
                    <div className="h-16 bg-gradient-to-t from-gray-600 to-transparent mt-2 rounded-t-lg w-20 mx-auto" />
                  </div>
                  
                  {/* 1st Place */}
                  <div className="text-center">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${leaderboard[0].avatar}`}
                      alt={leaderboard[0].user}
                      className="w-20 h-20 rounded-full mx-auto mb-2 border-2 border-yellow-500"
                    />
                    <span className="text-3xl">🏆</span>
                    <p className="font-bold text-white mt-1">{leaderboard[0].user.split(' ')[0]}</p>
                    <p className="text-sm text-yellow-500">{leaderboard[0].points.toLocaleString()} pts</p>
                    <div className="h-24 bg-gradient-to-t from-yellow-600 to-transparent mt-2 rounded-t-lg w-24 mx-auto" />
                  </div>
                  
                  {/* 3rd Place */}
                  <div className="text-center">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${leaderboard[2].avatar}`}
                      alt={leaderboard[2].user}
                      className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-amber-700"
                    />
                    <span className="text-2xl">🥉</span>
                    <p className="font-medium text-white text-sm mt-1">{leaderboard[2].user.split(' ')[0]}</p>
                    <p className="text-xs text-gray-400">{leaderboard[2].points.toLocaleString()} pts</p>
                    <div className="h-12 bg-gradient-to-t from-amber-700 to-transparent mt-2 rounded-t-lg w-20 mx-auto" />
                  </div>
                </div>
              </div>

              {/* Rest of Leaderboard */}
              <div className="p-4 space-y-2">
                {leaderboard.slice(3).map((user) => (
                  <div 
                    key={user.rank}
                    className="flex items-center gap-4 p-3 bg-[#1A1A1A] rounded-xl hover:bg-[#252525] transition-colors"
                  >
                    <span className="w-8 text-center font-bold text-gray-400">{user.rank}</span>
                    <img 
                      src={`https://i.pravatar.cc/150?img=${user.avatar}`}
                      alt={user.user}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-white">{user.user}</p>
                      <p className="text-xs text-gray-400">{user.points.toLocaleString()} points</p>
                    </div>
                    <span className={`text-xs font-medium ${user.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {user.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Community
