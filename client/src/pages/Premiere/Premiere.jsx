import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, Calendar, Film, Star, Play, Info, Ticket, 
  Users, MessageCircle, Zap, ChevronRight, Bell,
  AlertCircle, TrendingUp, Sparkles
} from 'lucide-react'
import { movies } from '../../data/mockData'

// Countdown Timer Component
const CountdownTimer = ({ targetDate, event }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date()
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex items-center gap-1">
      <div className="bg-[#FF0040] text-white px-2 py-1 rounded font-mono font-bold text-xs">
        {String(timeLeft.days).padStart(2, '0')}
        <span className="text-[#FF0040]/70 ml-0.5">D</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="bg-[#FF0040] text-white px-2 py-1 rounded font-mono font-bold text-xs">
        {String(timeLeft.hours).padStart(2, '0')}
        <span className="text-[#FF0040]/70 ml-0.5">H</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="bg-[#FF0040] text-white px-2 py-1 rounded font-mono font-bold text-xs">
        {String(timeLeft.minutes).padStart(2, '0')}
        <span className="text-[#FF0040]/70 ml-0.5">M</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="bg-[#FF0040] text-white px-2 py-1 rounded font-mono font-bold text-xs">
        {String(timeLeft.seconds).padStart(2, '0')}
        <span className="text-[#FF0040]/70 ml-0.5">S</span>
      </div>
    </div>
  )
}

// New Release Card
const NewReleaseCard = ({ movie, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#2A2A2A]">
          <img 
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {/* Play Button */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: isHovered ? 1 : 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#FF0040] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#E6003A] transition-colors"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.div>

            {/* Quick Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-[#FF0040] text-white text-xs font-bold rounded flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  PREMIERE
                </span>
                {movie.imax && (
                  <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded">IMAX</span>
                )}
              </div>
              <p className="text-white text-sm line-clamp-2">{movie.description}</p>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 rounded-lg">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-semibold">{movie.rating}</span>
          </div>

          {/* Premiere Label */}
          <div className="absolute top-3 right-3">
            <div className="px-2 py-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded text-black text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              NEW
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-white font-semibold truncate group-hover:text-[#FF0040] transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-3 h-3 text-gray-500" />
            <span className="text-gray-400 text-sm">Releasing {movie.releaseDate}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-gray-400 text-sm">{movie.duration}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Early Access Screening
const EarlyAccessCard = ({ screening }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] rounded-xl p-4 border border-[#3A3A3A] hover:border-[#FF0040]/50 transition-colors"
    >
      <div className="flex gap-4">
        <div className="relative w-24 h-32 flex-shrink-0">
          <img 
            src={screening.poster}
            alt={screening.title}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg" />
          <div className="absolute bottom-2 left-2 right-2">
            <span className="text-[#FFD700] text-xs font-bold">EARLY ACCESS</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">{screening.title}</h3>
          <p className="text-gray-400 text-sm mb-2">{screening.type}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#FF0040]" />
            <span className="text-white text-sm">{screening.date}</span>
            <span className="text-gray-500">•</span>
            <Clock className="w-4 h-4 text-[#FF0040]" />
            <span className="text-white text-sm">{screening.time}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400 text-xs">{screening.seatsLeft} seats left</span>
            </div>
            <div className="flex gap-2">
              <Link 
                to={`/movie/${screening.movieId}`}
                className="px-3 py-1.5 text-[#FF0040] text-sm font-medium border border-[#FF0040] rounded-lg hover:bg-[#FF0040] hover:text-white transition-colors"
              >
                Details
              </Link>
              <Link 
                to={`/book/${screening.showId}`}
                className="px-3 py-1.5 bg-[#FF0040] text-white text-sm font-medium rounded-lg hover:bg-[#E6003A] transition-colors flex items-center gap-1"
              >
                <Ticket className="w-4 h-4" />
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Q&A Session Card
const QASessionCard = ({ session, index }) => {
  const [isLive, setIsLive] = useState(false)
  const [notify, setNotify] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-gray-800 hover:border-[#FF0040]/50 transition-all group"
    >
      {/* Director Image */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={session.directorImage}
          alt={session.director}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        
        {/* Live Badge */}
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full" />
            LIVE NOW
          </div>
        )}

        {/* Countdown */}
        {!isLive && (
          <div className="absolute top-3 left-3">
            <CountdownTimer targetDate={session.dateTime} />
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={session.moviePoster}
              alt=""
              className="w-8 h-12 object-cover rounded"
            />
            <div>
              <p className="text-white text-sm font-medium">{session.movie}</p>
              <p className="text-gray-400 text-xs">Q&A Session</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-[#FF0040] rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{session.director}</h3>
            <p className="text-gray-400 text-sm">Director</p>
          </div>
        </div>

        <h4 className="text-white font-medium mb-2 line-clamp-2">{session.title}</h4>
        
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(session.dateTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(session.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Attendees */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {session.attendees?.slice(0, 4).map((attendee, i) => (
              <img 
                key={i}
                src={attendee.avatar}
                alt=""
                className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] object-cover"
              />
            ))}
            <div className="w-8 h-8 rounded-full bg-[#FF0040] border-2 border-[#1A1A1A] flex items-center justify-center text-white text-xs font-bold">
              +{session.attendeeCount}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setNotify(!notify)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                notify 
                  ? 'bg-[#FF0040] text-white' 
                  : 'border border-gray-600 text-gray-400 hover:border-[#FF0040] hover:text-[#FF0040]'
              }`}
            >
              <Bell className="w-4 h-4" />
              {notify ? 'Remind Me' : 'Notify Me'}
            </button>
            <button className="px-3 py-1.5 bg-[#2A2A2A] text-gray-400 rounded-lg text-sm font-medium hover:bg-[#3A3A3A] transition-colors flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              Ask
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Upcoming Premiere Section
const UpcomingPremiere = ({ movie }) => {
  const [notify, setNotify] = useState(false)

  return (
    <div className="bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] rounded-xl p-6 border border-gray-800">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-48 h-64 flex-shrink-0">
          <img 
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-xl" />
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1 text-[#FFD700]">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold">{movie.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-[#FF0040] text-white text-xs font-bold rounded flex items-center gap-1">
              <Zap className="w-3 h-3" />
              COMING SOON
            </span>
            {movie.imax && (
              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded">IMAX</span>
            )}
          </div>

          <h2 className="text-white text-2xl font-bold mb-2">{movie.title}</h2>
          <p className="text-gray-400 text-sm mb-4">{movie.language} • {movie.genre.join(', ')}</p>

          <div className="flex items-center gap-6 mb-4">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Release Date</p>
              <p className="text-white font-medium">{movie.releaseDate}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Duration</p>
              <p className="text-white font-medium">{movie.duration}</p>
            </div>
          </div>

          <div className="bg-[#222222] rounded-lg p-3 mb-4">
            <p className="text-gray-400 text-sm mb-2">Opens in</p>
            <CountdownTimer targetDate={movie.releaseDate} event={movie.title} />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotify(!notify)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                notify 
                  ? 'bg-[#FF0040] text-white' 
                  : 'border border-[#FF0040] text-[#FF0040] hover:bg-[#FF0040] hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              {notify ? 'Reminded!' : 'Remind Me'}
            </button>
            <Link 
              to={`/movie/${movie.id}`}
              className="px-4 py-2 bg-[#2A2A2A] text-white rounded-lg font-medium hover:bg-[#3A3A3A] transition-colors flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tab Component
const TabButton = ({ active, onClick, icon: Icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
      active ? 'text-[#FF0040]' : 'text-gray-400 hover:text-white'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
    {badge && (
      <span className="px-1.5 py-0.5 bg-[#FF0040] text-white text-[10px] font-bold rounded">
        {badge}
      </span>
    )}
    {active && (
      <motion.div 
        layoutId="premiereTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF0040]"
      />
    )}
  </button>
)

// Main Premiere Page
const Premiere = () => {
  const [activeTab, setActiveTab] = useState('newReleases')
  const [filter, setFilter] = useState('all')

  // Mock data
  const newReleases = movies.filter(m => m.isNewRelease).slice(0, 8)
  
  const earlyAccessScreenings = [
    {
      id: 1,
      movieId: 1,
      showId: 'ea1',
      title: 'Thunderbolts*',
      type: 'Early Access Screening',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300',
      date: 'Apr 15, 2026',
      time: '10:00 AM',
      seatsLeft: 45
    },
    {
      id: 2,
      movieId: 2,
      showId: 'ea2',
      title: 'Sikandar',
      type: 'Exclusive Preview',
      poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300',
      date: 'Apr 16, 2026',
      time: '12:30 PM',
      seatsLeft: 28
    },
    {
      id: 3,
      movieId: 3,
      showId: 'ea3',
      title: 'Dune: Part Three',
      type: 'IMAX Early Access',
      poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300',
      date: 'Apr 18, 2026',
      time: '11:00 AM',
      seatsLeft: 12
    }
  ]

  const qaSessions = [
    {
      id: 1,
      movie: 'Thunderbolts*',
      moviePoster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300',
      director: 'Jake Schreier',
      directorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      title: 'Behind the Scenes: Crafting the Perfect Anti-Hero Team',
      dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      attendeeCount: 1247,
      attendees: [
        { avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/women/4.jpg' }
      ]
    },
    {
      id: 2,
      movie: 'Sikandar',
      moviePoster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300',
      director: 'Sanjay Leela Bhansali',
      directorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      title: 'The Grand Vision: Creating Epic Cinema',
      dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      attendeeCount: 892,
      attendees: [
        { avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/women/8.jpg' }
      ]
    },
    {
      id: 3,
      movie: 'Dune: Part Three',
      moviePoster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300',
      director: 'Denis Villeneuve',
      directorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      title: 'Building Worlds: From Page to Screen',
      dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      attendeeCount: 2341,
      attendees: [
        { avatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/women/10.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
        { avatar: 'https://randomuser.me/api/portraits/women/12.jpg' }
      ]
    }
  ]

  const upcomingPremiere = {
    id: 100,
    title: 'Avengers: Secret Wars',
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    rating: 9.5,
    language: 'English, Hindi',
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    releaseDate: 'May 7, 2026',
    duration: '3h 15min',
    imax: true
  }

  const tabs = [
    { id: 'newReleases', label: 'New Releases', icon: Sparkles },
    { id: 'earlyAccess', label: 'Early Access', icon: Zap, badge: earlyAccessScreenings.length },
    { id: 'qaSessions', label: 'Q&A Sessions', icon: MessageCircle, badge: qaSessions.length }
  ]

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'thisWeek', label: 'This Week' },
    { id: 'nextWeek', label: 'Next Week' },
    { id: 'imax', label: 'IMAX' }
  ]

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#FF0040] to-[#FF6B35] py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">Premiere</h1>
              <p className="text-white/80 text-sm">Exclusive early access, new releases & director Q&As</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            <span className="px-3 py-1.5 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm">
              {newReleases.length} New Releases
            </span>
            <span className="px-3 py-1.5 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm">
              {earlyAccessScreenings.length} Early Access
            </span>
            <span className="px-3 py-1.5 bg-white/20 text-white text-sm rounded-full backdrop-blur-sm">
              {qaSessions.length} Q&A Sessions
            </span>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Upcoming */}
        {activeTab === 'newReleases' && filter === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF0040]" />
              Most Anticipated
            </h2>
            <UpcomingPremiere movie={upcomingPremiere} />
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-800">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
                label={tab.label}
                badge={tab.badge}
              />
            ))}
          </div>
        </div>

        {/* Filters */}
        {activeTab === 'newReleases' && (
          <div className="flex items-center gap-2 mb-6">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f.id 
                    ? 'bg-[#FF0040] text-white' 
                    : 'bg-[#2A2A2A] text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'newReleases' && (
            <motion.div
              key="newReleases"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Featured */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newReleases.map((movie, idx) => (
                  <NewReleaseCard key={movie.id} movie={movie} index={idx} />
                ))}
              </div>

              {newReleases.length === 0 && (
                <div className="text-center py-16">
                  <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No new releases available</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'earlyAccess' && (
            <motion.div
              key="earlyAccess"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {earlyAccessScreenings.map((screening, idx) => (
                <motion.div
                  key={screening.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <EarlyAccessCard screening={screening} />
                </motion.div>
              ))}

              {earlyAccessScreenings.length === 0 && (
                <div className="text-center py-16">
                  <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No early access screenings available</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'qaSessions' && (
            <motion.div
              key="qaSessions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {qaSessions.map((session, idx) => (
                <QASessionCard key={session.id} session={session} index={idx} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 border border-gray-700 text-white rounded-lg font-medium hover:border-[#FF0040] hover:text-[#FF0040] transition-colors inline-flex items-center gap-2">
            Load More
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Spacing for Mobile Nav */}
      <div className="h-20" />
    </div>
  )
}

export default Premiere
