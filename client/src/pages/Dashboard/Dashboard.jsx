import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Ticket, 
  Wallet, 
  Star, 
  TrendingUp, 
  Calendar,
  Clock,
  ChevronRight,
  Play,
  Heart,
  Share2,
  Users,
  Activity,
  Zap,
  Gift,
  MapPin,
  Film,
  Plus,
  Crown,
  Bell
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { movies } from '../../data/mockData'

const Dashboard = () => {
  const { user } = useAuth()
  const [animateStats, setAnimateStats] = useState(false)

  useEffect(() => {
    setAnimateStats(true)
  }, [])

  const stats = [
    {
      icon: Ticket,
      label: 'Total Bookings',
      value: '47',
      change: '+12%',
      changeType: 'positive',
      color: '#FF0040'
    },
    {
      icon: Star,
      label: 'Reward Points',
      value: '2,450',
      change: '+350',
      changeType: 'positive',
      color: '#FFD700'
    },
    {
      icon: Wallet,
      label: 'Wallet Balance',
      value: '₹1,250',
      change: '+500',
      changeType: 'positive',
      color: '#22C55E'
    },
    {
      icon: TrendingUp,
      label: 'Movies Watched',
      value: '28',
      change: '+5',
      changeType: 'positive',
      color: '#3B82F6'
    }
  ]

  const quickActions = [
    { icon: Film, label: 'Book Movie', path: '/movies', color: '#FF0040' },
    { icon: Ticket, label: 'My Bookings', path: '/my-bookings', color: '#FF6B35' },
    { icon: GiftCard, label: 'Gift Cards', path: '/gift-cards', color: '#22C55E' },
    { icon: Users, label: 'Refer Friends', path: '/offers', color: '#8B5CF6' }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'booking',
      title: 'Thunderbolts*',
      subtitle: 'INOX: Nexus Mall • 2 tickets',
      time: '2 hours ago',
      icon: Ticket,
      color: '#FF0040'
    },
    {
      id: 2,
      type: 'review',
      title: 'Reviewed Captain America',
      subtitle: 'Rating: 4.5/5',
      time: 'Yesterday',
      icon: Star,
      color: '#FFD700'
    },
    {
      id: 3,
      type: 'points',
      title: 'Points Earned',
      subtitle: '+150 points from booking',
      time: '2 days ago',
      icon: Zap,
      color: '#22C55E'
    },
    {
      id: 4,
      type: 'wishlist',
      title: 'Added to Watchlist',
      subtitle: 'Dune: Part Three',
      time: '3 days ago',
      icon: Heart,
      color: '#EC4899'
    }
  ]

  const recommendedMovies = movies.slice(0, 4)

  const upcomingShows = [
    { id: 1, title: 'Thunderbolts*', date: 'Today, 6:00 PM', venue: 'INOX' },
    { id: 2, title: 'Jaat', date: 'Tomorrow, 11:00 AM', venue: 'PVR' }
  ]

  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF0040] to-[#FF6B35] px-4 pt-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
                <p className="text-white/80 text-sm">Here's your entertainment hub</p>
              </div>
            </div>
            <Link 
              to="/profile"
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              aria-label="View Profile"
            >
              <Crown className="w-5 h-5" />
            </Link>
          </div>

          {/* Gold Membership Banner */}
          {user?.isGoldMember && (
            <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-black" />
                <div>
                  <p className="font-bold text-black">Gold Member</p>
                  <p className="text-sm text-black/70">20% off on all bookings</p>
                </div>
              </div>
              <Link 
                to="/offers"
                className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Claim Now
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-4xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className={`bg-[#222] rounded-xl p-4 border border-[#333] ${
                animateStats ? 'animate-fade-in-up' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <span className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-bold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="bg-[#222] rounded-xl p-4 border border-[#333] hover:bg-[#252525] hover:border-[#444] transition-all group"
              style={{ '--hover-color': action.color }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${action.color}20` }}
              >
                <action.icon className="w-6 h-6" style={{ color: action.color }} />
              </div>
              <p className="font-medium text-white text-sm">{action.label}</p>
            </Link>
          ))}
        </div>

        {/* Upcoming Shows & Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Upcoming Shows */}
          <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
            <div className="p-4 border-b border-[#333] flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FF0040]" />
                Upcoming Shows
              </h3>
              <Link 
                to="/my-bookings"
                className="text-sm text-[#FF0040] hover:underline flex items-center gap-1"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {upcomingShows.map((show) => (
                <div 
                  key={show.id}
                  className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-lg hover:bg-[#252525] transition-colors"
                >
                  <div className="w-12 h-12 bg-[#FF0040] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{show.title}</p>
                    <p className="text-xs text-gray-400">{show.date}</p>
                    <p className="text-xs text-gray-500">{show.venue}</p>
                  </div>
                  <button 
                    className="p-2 text-gray-400 hover:text-[#FF0040] transition-colors"
                    aria-label={`Get reminder for ${show.title}`}
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
            <div className="p-4 border-b border-[#333] flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#FF6B35]" />
                Recent Activity
              </h3>
            </div>
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start gap-3"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${activity.color}20` }}
                  >
                    <activity.icon className="w-4 h-4" style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{activity.title}</p>
                    <p className="text-xs text-gray-400 truncate">{activity.subtitle}</p>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Movies */}
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Recommended For You
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {recommendedMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="group"
            >
              <div className="relative rounded-xl overflow-hidden mb-2">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-full bg-[#FF0040] text-white text-xs py-2 rounded-lg font-medium flex items-center justify-center gap-1">
                    <Ticket className="w-3 h-3" /> Book Now
                  </button>
                </div>
                <span className="absolute top-2 left-2 bg-[#FF0040] text-white text-xs px-2 py-0.5 rounded font-medium">
                  {movie.rating} ★
                </span>
              </div>
              <h4 className="font-medium text-white text-sm truncate group-hover:text-[#FF0040] transition-colors">
                {movie.title}
              </h4>
              <p className="text-xs text-gray-400">{movie.genre[0]} • {movie.language}</p>
            </Link>
          ))}
        </div>

        {/* Watchlist Section */}
        <div className="bg-[#222] rounded-xl border border-[#333] p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Your Watchlist
            </h3>
            <Link 
              to="/movies"
              className="text-sm text-[#FF0040] hover:underline flex items-center gap-1"
            >
              Browse more <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[1, 2, 3].map((item) => (
              <div 
                key={item}
                className="flex-shrink-0 w-32 bg-[#1A1A1A] rounded-lg overflow-hidden"
              >
                <img 
                  src={movies[item + 5]?.poster || movies[0].poster}
                  alt="Watchlist movie"
                  className="w-full aspect-[2/3] object-cover"
                  loading="lazy"
                />
                <div className="p-2">
                  <p className="text-sm text-white truncate font-medium">
                    {movies[item + 5]?.title || movies[0].title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {movies[item + 5]?.releaseDate?.slice(0, 4) || '2026'}
                  </p>
                </div>
              </div>
            ))}
            <button 
              className="flex-shrink-0 w-32 h-full min-h-[140px] border-2 border-dashed border-[#444] rounded-lg flex flex-col items-center justify-center gap-2 hover:border-[#FF0040] hover:bg-[#FF0040]/5 transition-colors"
              aria-label="Add to watchlist"
            >
              <Plus className="w-8 h-8 text-gray-500" />
              <span className="text-sm text-gray-500">Add Movie</span>
            </button>
          </div>
        </div>

        {/* Friends Activity */}
        <div className="bg-[#222] rounded-xl border border-[#333] p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#3B82F6]" />
              Friends Activity
            </h3>
            <button className="text-sm text-[#FF0040] hover:underline">
              Find Friends
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Priya Sharma', action: 'booked tickets for', movie: 'Thunderbolts*', avatar: 1 },
              { name: 'Rahul Verma', action: 'reviewed', movie: 'Captain America', rating: 4.5, avatar: 2 },
              { name: 'Ananya Patel', action: 'added to watchlist', movie: 'Dune: Part Three', avatar: 3 }
            ].map((friend, index) => (
              <div key={index} className="flex items-center gap-3">
                <img 
                  src={`https://i.pravatar.cc/150?img=${friend.avatar + 20}`}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full"
                  loading="lazy"
                />
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-medium">{friend.name}</span>{' '}
                    <span className="text-gray-400">{friend.action}{' '}</span>
                    <span className="text-[#FF0040]">{friend.movie}</span>
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                {friend.rating && (
                  <span className="text-sm font-medium text-yellow-500">{friend.rating} ★</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
