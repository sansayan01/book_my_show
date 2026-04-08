import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Ticket, Settings, LogOut, Calendar, MapPin, Clock, ChevronRight, CreditCard, Bell, Globe, Edit2, Save, X, Star, Filter, Download, Heart, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [bookingFilter, setBookingFilter] = useState('all')
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({})
  const [savedCards, setSavedCards] = useState([])
  const [preferences, setPreferences] = useState({
    language: 'English',
    emailNotifications: true,
    smsNotifications: true,
    offersNotifications: true
  })

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    setBookings(savedBookings.reverse())
    
    const cards = JSON.parse(localStorage.getItem('savedCards') || '[]')
    if (cards.length === 0) {
      const defaultCards = [
        { id: '1', type: 'Visa', last4: '4532', expiry: '12/27', name: 'John Doe', isDefault: true },
        { id: '2', type: 'Mastercard', last4: '8890', expiry: '06/26', name: 'John Doe', isDefault: false }
      ]
      setSavedCards(defaultCards)
      localStorage.setItem('savedCards', JSON.stringify(defaultCards))
    } else {
      setCards(cards)
    }

    if (user) {
      setEditedUser({ ...user })
    }
  }, [user])

  const setCards = (cards) => setSavedCards(cards)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
  }

  const deleteCard = (cardId) => {
    const newCards = savedCards.filter(c => c.id !== cardId)
    setSavedCards(newCards)
    localStorage.setItem('savedCards', JSON.stringify(newCards))
  }

  const filteredBookings = bookingFilter === 'all' 
    ? bookings 
    : bookings.filter(b => {
      if (bookingFilter === 'upcoming') return new Date(b.show?.date) >= new Date()
      if (bookingFilter === 'past') return new Date(b.show?.date) < new Date()
      return true
    })

  if (!user) {
    return (
      <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in to view your profile</h2>
          <Link to="/" className="text-[#FF0040]">Go to Home</Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'bookings', name: 'My Bookings', icon: Ticket },
    { id: 'cards', name: 'Saved Cards', icon: CreditCard },
    { id: 'preferences', name: 'Preferences', icon: Settings }
  ]

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#FF0040] to-[#FF6B35] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedUser.name || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    value={editedUser.email || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Email"
                  />
                  <input
                    type="tel"
                    value={editedUser.phone || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/20 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Phone"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{user.name}</h2>
                  <p className="text-white/80">{user.email}</p>
                  {user.phone && <p className="text-white/80">{user.phone}</p>}
                </>
              )}
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <button onClick={handleSaveProfile} className="p-2 bg-white text-[#FF0040] rounded-lg hover:bg-gray-100">
                  <Save className="w-5 h-5" />
                </button>
                <button onClick={() => setIsEditing(false)} className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="p-2 bg-white text-[#FF0040] rounded-lg hover:bg-gray-100">
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#1F1F1F] border-b border-gray-800 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-[#FF0040] border-[#FF0040]'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            {/* Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              {['all', 'upcoming', 'past'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setBookingFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    bookingFilter === filter
                      ? 'bg-[#FF0040] text-white'
                      : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Bookings List */}
            {filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((booking, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-4 p-4 bg-[#1F1F1F] rounded-xl border border-gray-800 hover:border-[#FF0040] transition-colors">
                    <img 
                      src={booking.movie?.poster} 
                      alt={booking.movie?.title}
                      className="w-full md:w-24 h-32 md:h-full object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg">{booking.movie?.title || 'Movie Booking'}</h4>
                      <p className="text-gray-400 text-sm mt-1">{booking.show?.theatre || 'Theatre'}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(booking.show?.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{booking.show?.time || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.show?.location || 'N/A'}</span>
                        </div>
                      </div>
                      {booking.seats && booking.seats.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {booking.seats.map((seat, j) => (
                            <span key={j} className="px-2 py-0.5 bg-[#2A2A2A] text-white text-xs rounded">
                              {seat.row}{seat.number}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <div className="text-right">
                        <p className="text-[#FF0040] font-bold text-lg">₹{booking.total || 0}</p>
                        <p className="text-green-500 text-xs mt-1">Confirmed</p>
                      </div>
                      <div className="flex gap-2 mt-2 md:mt-0">
                        <button className="p-2 bg-[#2A2A2A] text-gray-400 rounded-lg hover:text-[#FF0040] transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-[#2A2A2A] text-gray-400 rounded-lg hover:text-[#FF0040] transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-white font-medium text-lg">No bookings found</h4>
                <p className="text-gray-400 text-sm mt-1 mb-4">
                  {bookingFilter === 'upcoming' ? "You have no upcoming bookings" : 
                   bookingFilter === 'past' ? "You have no past bookings" : 
                   "You haven't booked anything yet"}
                </p>
                <Link 
                  to="/movies" 
                  className="inline-block px-6 py-2 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#d63a54] transition-colors"
                >
                  Browse Movies
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Saved Cards Tab */}
        {activeTab === 'cards' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400 text-sm">{savedCards.length} cards saved</p>
              <button className="text-[#FF0040] text-sm font-medium hover:underline">
                + Add New Card
              </button>
            </div>

            {savedCards.length > 0 ? (
              <div className="space-y-3">
                {savedCards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-4 bg-[#1F1F1F] rounded-xl border border-gray-800 hover:border-[#FF0040] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        {card.type === 'Visa' ? 'VISA' : 'MC'}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          •••• •••• •••• {card.last4}
                          {card.isDefault && (
                            <span className="ml-2 px-2 py-0.5 bg-[#FF0040]/20 text-[#FF0040] text-xs rounded-full">Default</span>
                          )}
                        </p>
                        <p className="text-gray-500 text-sm">{card.name} • Exp {card.expiry}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteCard(card.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-white font-medium text-lg">No saved cards</h4>
                <p className="text-gray-400 text-sm mt-1">Add a card for faster checkout</p>
              </div>
            )}
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            {/* Language */}
            <div className="p-4 bg-[#1F1F1F] rounded-xl border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FF0040]/20 rounded-lg">
                  <Globe className="w-5 h-5 text-[#FF0040]" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Language</h4>
                  <p className="text-gray-500 text-sm">Select your preferred language</p>
                </div>
              </div>
              <select 
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full px-4 py-2 bg-[#2A2A2A] text-white rounded-lg border border-gray-700 focus:border-[#FF0040] focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
              </select>
            </div>

            {/* Notifications */}
            <div className="p-4 bg-[#1F1F1F] rounded-xl border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Notifications</h4>
                  <p className="text-gray-500 text-sm">Manage your notification preferences</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive booking confirmations via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Get SMS alerts for bookings and updates' },
                  { key: 'offersNotifications', label: 'Offers & Deals', desc: 'Receive special offers and discounts' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setPreferences({ ...preferences, [item.key]: !preferences[item.key] })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        preferences[item.key] ? 'bg-[#FF0040]' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        preferences[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-8 flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/30 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Profile
