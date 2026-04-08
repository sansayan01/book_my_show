import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Ticket, Calendar, MapPin, Clock, Download, ChevronRight, Film, Music, Trophy, Theater } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const MyBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    setBookings(savedBookings.reverse())
  }, [])

  const getTypeIcon = (type) => {
    switch(type) {
      case 'movie':
        return <Film className="w-5 h-5" />
      case 'event':
        return <Music className="w-5 h-5" />
      case 'sports':
        return <Trophy className="w-5 h-5" />
      case 'play':
        return <Theater className="w-5 h-5" />
      default:
        return <Ticket className="w-5 h-5" />
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      movie: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
      event: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
      sports: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
      play: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' }
    }
    return colors[type] || colors.movie
  }

  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(b => b.type === activeTab)

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Sign in to view your bookings</h2>
          <Link 
            to="/login" 
            className="inline-block px-6 py-2.5 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#CC0033] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Header */}
      <div className="bg-[#1F1F1F] border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-white mb-4">My Bookings</h1>
          
          {/* Tab Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Bookings', icon: Ticket },
              { id: 'movie', label: 'Movies', icon: Film },
              { id: 'event', label: 'Events', icon: Music },
              { id: 'sports', label: 'Sports', icon: Trophy },
              { id: 'play', label: 'Plays', icon: Theater }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#FF0040] text-white'
                    : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => {
              const colors = getTypeColor(booking.type || 'movie')
              const icon = getTypeIcon(booking.type || 'movie')
              
              return (
                <div 
                  key={index}
                  className="bg-[#1F1F1F] rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Poster */}
                    <div className="relative w-24 h-32 flex-shrink-0">
                      <img
                        src={booking.movie.poster || booking.event?.poster}
                        alt={booking.movie.title || booking.event?.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className={`absolute -top-2 -left-2 w-8 h-8 ${colors.bg} border ${colors.border} border-2 rounded-full flex items-center justify-center`}>
                        <span className={`${colors.text}`}>
                          {icon}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {booking.movie?.title || booking.event?.title || 'Booking'}
                          </h3>
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 ${colors.bg} ${colors.text} rounded text-xs mt-1`}>
                            {icon}
                            <span className="capitalize">{booking.type || 'movie'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[#FF0040] font-bold text-lg">
                            ₹{booking.total || booking.ticketPrice || 0}
                          </p>
                          <p className="text-green-400 text-xs flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            Confirmed
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        {booking.show && (
                          <>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(booking.show.date)}</span>
                              <Clock className="w-4 h-4 ml-2" />
                              <span>{booking.show.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{booking.show.theatre}</span>
                            </div>
                          </>
                        )}
                        
                        {booking.seats && booking.seats.length > 0 && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Ticket className="w-4 h-4" />
                            <span>
                              {booking.seats.length} {booking.seats.length === 1 ? 'ticket' : 'tickets'}:
                            </span>
                            <div className="flex gap-1">
                              {booking.seats.map((seat, i) => (
                                <span 
                                  key={i} 
                                  className="px-2 py-0.5 bg-[#2A2A2A] text-white text-xs rounded"
                                >
                                  {seat.row}{seat.number}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                    <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download Ticket</span>
                    </button>
                    <button className="flex items-center gap-1 text-[#FF0040] hover:text-white text-sm transition-colors">
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-gray-400 mb-4">Book your first ticket!</p>
            <Link 
              to="/movies" 
              className="inline-block px-6 py-2 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#CC0033] transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        )}

        {/* Stats */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-[#1F1F1F] rounded-xl p-4 border border-gray-800">
              <p className="text-gray-400 text-sm">Total Spent</p>
              <p className="text-white text-2xl font-bold mt-1">
                ₹{bookings.reduce((sum, b) => sum + (b.total || b.ticketPrice || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-[#1F1F1F] rounded-xl p-4 border border-gray-800">
              <p className="text-gray-400 text-sm">Total Tickets</p>
              <p className="text-white text-2xl font-bold mt-1">
                {bookings.reduce((sum, b) => sum + (b.seats?.length || 1), 0)}
              </p>
            </div>
            <div className="bg-[#1F1F1F] rounded-xl p-4 border border-gray-800">
              <p className="text-gray-400 text-sm">Movies</p>
              <p className="text-white text-2xl font-bold mt-1">
                {bookings.filter(b => b.type === 'movie').length}
              </p>
            </div>
            <div className="bg-[#1F1F1F] rounded-xl p-4 border border-gray-800">
              <p className="text-gray-400 text-sm">Events</p>
              <p className="text-white text-2xl font-bold mt-1">
                {bookings.filter(b => b.type !== 'movie').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings