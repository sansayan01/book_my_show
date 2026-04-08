import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Ticket, Settings, LogOut, Calendar, MapPin, Clock, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    setBookings(savedBookings.reverse()) // Most recent first
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in to view your profile</h2>
          <Link to="/" className="text-[#F84565]">Go to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-[#2A2A2A] rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-[#F84565] rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
              {user.phone && <p className="text-gray-400">{user.phone}</p>}
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-xl border border-gray-700 hover:border-[#F84565] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F84565]/20 rounded-lg">
                <Ticket className="w-5 h-5 text-[#F84565]" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-medium">My Bookings</h3>
                <p className="text-gray-400 text-sm">{bookings.length} tickets</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-xl border border-gray-700 hover:border-[#F84565] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2A9D8F]/20 rounded-lg">
                <Settings className="w-5 h-5 text-[#2A9D8F]" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-medium">Settings</h3>
                <p className="text-gray-400 text-sm">Account & Preferences</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* My Bookings */}
        <div className="bg-[#2A2A2A] rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">My Bookings</h3>
          
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking, i) => (
                <div key={i} className="flex gap-4 p-4 bg-[#1A1A1A] rounded-xl">
                  <img 
                    src={booking.movie.poster} 
                    alt={booking.movie.title}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{booking.movie.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{booking.show.theatre}</p>
                    <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(booking.show.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{booking.show.time}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {booking.seats.map((seat, j) => (
                        <span key={j} className="px-2 py-0.5 bg-gray-700 text-white text-xs rounded">
                          {seat.row}{seat.number}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#F84565] font-bold">₹{booking.total}</p>
                    <p className="text-green-500 text-xs mt-1">Confirmed</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h4 className="text-white font-medium">No bookings yet</h4>
              <p className="text-gray-400 text-sm mt-1">Book your first movie ticket!</p>
              <Link 
                to="/movies" 
                className="inline-block mt-4 px-6 py-2 bg-[#F84565] text-white rounded-lg font-medium hover:bg-[#d63a54] transition-colors"
              >
                Browse Movies
              </Link>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/30 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Profile
