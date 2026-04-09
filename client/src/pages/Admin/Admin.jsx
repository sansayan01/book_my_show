import { useState } from 'react'
import { 
  LayoutDashboard, Film, Building, Clock, Users, CreditCard, 
  TrendingUp, Calendar, DollarSign, Eye, Edit2, Trash2, Plus,
  BarChart3, ChevronRight, Search, Filter, Upload, X, Check
} from 'lucide-react'
import { movies } from '../../data/mockData'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(null)

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'movies', icon: Film, label: 'Movies' },
    { id: 'cinemas', icon: Building, label: 'Cinemas' },
    { id: 'shows', icon: Clock, label: 'Shows' },
    { id: 'bookings', icon: CreditCard, label: 'Bookings' },
    { id: 'users', icon: Users, label: 'Users' },
  ]

  // Mock data for stats
  const stats = {
    totalBookings: 12458,
    totalRevenue: 4567890,
    totalUsers: 8934,
    todayBookings: 234,
    revenueGrowth: 12.5,
    bookingGrowth: 8.3,
  }

  const handleOpenModal = (type) => {
    setModalType(type)
    setShowModal(true)
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1F1F1F] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#FF0040]/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[#FF0040]" />
            </div>
            <span className="text-green-400 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +{stats.bookingGrowth}%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.totalBookings.toLocaleString()}</h3>
          <p className="text-gray-400 mt-1">Total Bookings</p>
        </div>

        <div className="bg-[#1F1F1F] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-green-400 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +{stats.revenueGrowth}%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white">₹{(stats.totalRevenue / 100000).toFixed(1)}L</h3>
          <p className="text-gray-400 mt-1">Total Revenue</p>
        </div>

        <div className="bg-[#1F1F1F] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-green-400 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +15%
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</h3>
          <p className="text-gray-400 mt-1">Total Users</p>
        </div>

        <div className="bg-[#1F1F1F] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white">{stats.todayBookings}</h3>
          <p className="text-gray-400 mt-1">Today's Bookings</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1F1F1F] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
            <select className="bg-[#2A2A2A] text-gray-400 px-3 py-2 rounded-lg text-sm">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-[#FF0040] to-[#FF0040]/50 rounded-t-lg transition-all hover:bg-[#FF0040]"
                  style={{ height: `${h}%` }}
                />
                <span className="text-gray-500 text-xs">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1F1F1F] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Popular Movies</h3>
          <div className="space-y-4">
            {movies.slice(0, 5).map((movie, i) => (
              <div key={movie.id} className="flex items-center gap-4">
                <span className="text-gray-500 w-6">{i + 1}</span>
                <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="text-white font-medium">{movie.title}</h4>
                  <p className="text-gray-400 text-sm">{movie.language}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#FF0040] font-semibold">{(Math.random() * 5000 + 1000).toFixed(0)}</p>
                  <p className="text-gray-400 text-xs">bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-[#1F1F1F] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Bookings</h3>
          <button className="text-[#FF0040] text-sm hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-800">
                <th className="text-left py-3 px-4">Booking ID</th>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Movie</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'BMS001', user: 'Rahul S.', movie: 'Pushpa 2', date: '2026-01-15', amount: 850, status: 'Confirmed' },
                { id: 'BMS002', user: 'Priya M.', movie: 'Dhoom 4', date: '2026-01-15', amount: 1200, status: 'Confirmed' },
                { id: 'BMS003', user: 'Amit K.', movie: 'Animal', date: '2026-01-14', amount: 650, status: 'Completed' },
                { id: 'BMS004', user: 'Sneha R.', movie: 'Jawan', date: '2026-01-14', amount: 950, status: 'Completed' },
              ].map((booking, i) => (
                <tr key={i} className="text-white text-sm border-b border-gray-800/50 hover:bg-[#2A2A2A]">
                  <td className="py-4 px-4">{booking.id}</td>
                  <td className="py-4 px-4">{booking.user}</td>
                  <td className="py-4 px-4">{booking.movie}</td>
                  <td className="py-4 px-4 text-gray-400">{booking.date}</td>
                  <td className="py-4 px-4">₹{booking.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderMovies = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Movies Management</h2>
        <button 
          onClick={() => handleOpenModal('movie')}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#CC0033] transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Movie
        </button>
      </div>

      <div className="bg-[#1F1F1F] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400"
            />
          </div>
          <select className="px-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white">
            <option>All Languages</option>
            <option>Hindi</option>
            <option>English</option>
            <option>Tamil</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-800">
              <th className="text-left py-4 px-4">Movie</th>
              <th className="text-left py-4 px-4">Language</th>
              <th className="text-left py-4 px-4">Genre</th>
              <th className="text-left py-4 px-4">Status</th>
              <th className="text-left py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.slice(0, 8).map(movie => (
              <tr key={movie.id} className="text-white text-sm border-b border-gray-800/50 hover:bg-[#2A2A2A]">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                    <div>
                      <h4 className="font-medium">{movie.title}</h4>
                      <p className="text-gray-400 text-xs">Released: {movie.releaseDate}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">{movie.language}</td>
                <td className="py-4 px-4">{movie.genre.join(', ')}</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                    Now Showing
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderCinemas = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Cinemas & Halls</h2>
        <button 
          onClick={() => handleOpenModal('cinema')}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#CC0033] transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Cinema
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'PVR Logix', location: 'Noida', screens: 8, seats: 1200 },
          { name: 'INOX', location: 'Delhi', screens: 6, seats: 900 },
          { name: 'Cinepolis', location: 'Mumbai', screens: 5, seats: 750 },
          { name: 'AMC Theatres', location: 'Bangalore', screens: 10, seats: 1500 },
        ].map((cinema, i) => (
          <div key={i} className="bg-[#1F1F1F] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{cinema.name}</h3>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <span>📍</span> {cinema.location}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-center flex-1 p-3 bg-[#2A2A2A] rounded-lg">
                <p className="text-2xl font-bold text-[#FF0040]">{cinema.screens}</p>
                <p className="text-gray-400">Screens</p>
              </div>
              <div className="text-center flex-1 p-3 bg-[#2A2A2A] rounded-lg">
                <p className="text-2xl font-bold text-blue-400">{cinema.seats}</p>
                <p className="text-gray-400">Total Seats</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderShows = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Shows Management</h2>
        <button 
          onClick={() => handleOpenModal('show')}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#CC0033] transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Show
        </button>
      </div>

      <div className="bg-[#1F1F1F] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="flex gap-4 flex-wrap">
            <select className="px-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white">
              <option>Select Movie</option>
              {movies.slice(0, 5).map(m => <option key={m.id}>{m.title}</option>)}
            </select>
            <select className="px-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white">
              <option>Select Cinema</option>
              <option>PVR Logix</option>
              <option>INOX</option>
            </select>
            <input type="date" className="px-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white" />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-800">
              <th className="text-left py-4 px-4">Movie</th>
              <th className="text-left py-4 px-4">Cinema</th>
              <th className="text-left py-4 px-4">Screen</th>
              <th className="text-left py-4 px-4">Time</th>
              <th className="text-left py-4 px-4">Format</th>
              <th className="text-left py-4 px-4">Price</th>
              <th className="text-left py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { movie: 'Pushpa 2', cinema: 'PVR Logix', screen: 'Screen 1', time: '10:30 AM', format: '2D', price: 250 },
              { movie: 'Dhoom 4', cinema: 'INOX', screen: 'Screen 3', time: '1:00 PM', format: '3D', price: 350 },
              { movie: 'Animal', cinema: 'Cinepolis', screen: 'Screen 2', time: '4:30 PM', format: '2D', price: 280 },
              { movie: 'Jawan', cinema: 'PVR Logix', screen: 'Screen 5', time: '7:00 PM', format: 'IMAX', price: 450 },
            ].map((show, i) => (
              <tr key={i} className="text-white text-sm border-b border-gray-800/50 hover:bg-[#2A2A2A]">
                <td className="py-4 px-4">{show.movie}</td>
                <td className="py-4 px-4">{show.cinema}</td>
                <td className="py-4 px-4">{show.screen}</td>
                <td className="py-4 px-4">{show.time}</td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">{show.format}</span>
                </td>
                <td className="py-4 px-4">₹{show.price}</td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderBookings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">All Bookings</h2>

      <div className="bg-[#1F1F1F] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by booking ID..."
            className="flex-1 min-w-[200px] px-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400"
          />
          <select className="px-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white">
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <input type="date" className="px-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white" />
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-800">
              <th className="text-left py-4 px-4">Booking ID</th>
              <th className="text-left py-4 px-4">User</th>
              <th className="text-left py-4 px-4">Movie</th>
              <th className="text-left py-4 px-4">Cinema</th>
              <th className="text-left py-4 px-4">Date & Time</th>
              <th className="text-left py-4 px-4">Seats</th>
              <th className="text-left py-4 px-4">Amount</th>
              <th className="text-left py-4 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'BMS001234', user: 'Rahul S.', movie: 'Pushpa 2', cinema: 'PVR Logix', datetime: 'Jan 15, 2:30 PM', seats: 3, amount: 850, status: 'Confirmed' },
              { id: 'BMS001235', user: 'Priya M.', movie: 'Dhoom 4', cinema: 'INOX', datetime: 'Jan 15, 6:00 PM', seats: 2, amount: 1200, status: 'Confirmed' },
              { id: 'BMS001236', user: 'Amit K.', movie: 'Animal', cinema: 'Cinepolis', datetime: 'Jan 14, 9:00 PM', seats: 4, amount: 650, status: 'Completed' },
              { id: 'BMS001237', user: 'Sneha R.', movie: 'Jawan', cinema: 'PVR Logix', datetime: 'Jan 14, 3:30 PM', seats: 2, amount: 950, status: 'Completed' },
              { id: 'BMS001238', user: 'Vikram J.', movie: 'Tiger 3', cinema: 'INOX', datetime: 'Jan 13, 7:00 PM', seats: 5, amount: 1100, status: 'Cancelled' },
            ].map((booking, i) => (
              <tr key={i} className="text-white text-sm border-b border-gray-800/50 hover:bg-[#2A2A2A]">
                <td className="py-4 px-4 font-mono">{booking.id}</td>
                <td className="py-4 px-4">{booking.user}</td>
                <td className="py-4 px-4">{booking.movie}</td>
                <td className="py-4 px-4">{booking.cinema}</td>
                <td className="py-4 px-4 text-gray-400">{booking.datetime}</td>
                <td className="py-4 px-4">{booking.seats}</td>
                <td className="py-4 px-4 font-semibold">₹{booking.amount}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">User Management</h2>

      <div className="bg-[#1F1F1F] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400"
            />
          </div>
          <select className="px-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white">
            <option>All Roles</option>
            <option>Admin</option>
            <option>User</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-800">
              <th className="text-left py-4 px-4">User</th>
              <th className="text-left py-4 px-4">Email</th>
              <th className="text-left py-4 px-4">Phone</th>
              <th className="text-left py-4 px-4">Bookings</th>
              <th className="text-left py-4 px-4">Joined</th>
              <th className="text-left py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', bookings: 45, joined: 'Jan 2024' },
              { name: 'Priya Mehta', email: 'priya.m@example.com', phone: '+91 87654 32109', bookings: 32, joined: 'Feb 2024' },
              { name: 'Amit Kumar', email: 'amit.k@example.com', phone: '+91 76543 21098', bookings: 28, joined: 'Mar 2024' },
              { name: 'Sneha Reddy', email: 'sneha.r@example.com', phone: '+91 65432 10987', bookings: 22, joined: 'Apr 2024' },
            ].map((user, i) => (
              <tr key={i} className="text-white text-sm border-b border-gray-800/50 hover:bg-[#2A2A2A]">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF0040] rounded-full flex items-center justify-center text-white font-bold">
                      {user.name[0]}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-400">{user.email}</td>
                <td className="py-4 px-4 text-gray-400">{user.phone}</td>
                <td className="py-4 px-4">{user.bookings}</td>
                <td className="py-4 px-4 text-gray-400">{user.joined}</td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard()
      case 'movies': return renderMovies()
      case 'cinemas': return renderCinemas()
      case 'shows': return renderShows()
      case 'bookings': return renderBookings()
      case 'users': return renderUsers()
      default: return renderDashboard()
    }
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1F1F1F] border-r border-gray-800 p-4 flex-shrink-0">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[#FF0040]">BMS Admin</h1>
          <p className="text-gray-500 text-sm">Management Panel</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-[#FF0040] text-white' 
                  : 'text-gray-400 hover:bg-[#2A2A2A] hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F1F1F] rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Add {modalType === 'movie' ? 'Movie' : modalType === 'cinema' ? 'Cinema' : 'Show'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#3A3A3A] rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {modalType === 'movie' && (
                <>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Movie Title</label>
                    <input type="text" placeholder="Enter movie title" className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Poster Image</label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#FF0040] transition-colors cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Click to upload or drag and drop</p>
                      <p className="text-gray-500 text-sm mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Language</label>
                      <select className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white">
                        <option>Hindi</option>
                        <option>English</option>
                        <option>Tamil</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Genre</label>
                      <select className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white">
                        <option>Action</option>
                        <option>Drama</option>
                        <option>Comedy</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Release Date</label>
                    <input type="date" className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Duration (minutes)</label>
                    <input type="number" placeholder="e.g., 150" className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white" />
                  </div>
                </>
              )}
              {modalType === 'cinema' && (
                <>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Cinema Name</label>
                    <input type="text" placeholder="Enter cinema name" className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Location</label>
                    <input type="text" placeholder="Enter location" className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Number of Screens</label>
                    <input type="number" placeholder="e.g., 5" className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white" />
                  </div>
                </>
              )}
              {modalType === 'show' && (
                <>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Select Movie</label>
                    <select className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white">
                      <option>Select a movie</option>
                      {movies.slice(0, 3).map(m => <option key={m.id}>{m.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Select Cinema</label>
                    <select className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white">
                      <option>Select a cinema</option>
                      <option>PVR Logix</option>
                      <option>INOX</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Screen</label>
                      <select className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white">
                        <option>Screen 1</option>
                        <option>Screen 2</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Format</label>
                      <select className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white">
                        <option>2D</option>
                        <option>3D</option>
                        <option>IMAX</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Date</label>
                      <input type="date" className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Time</label>
                      <input type="time" className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Ticket Price (₹)</label>
                    <input type="number" placeholder="e.g., 250" className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white" />
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t border-gray-800 flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-700 rounded-lg text-gray-400 hover:bg-[#2A2A2A] transition-colors">
                Cancel
              </button>
              <button className="flex-1 py-3 bg-[#FF0040] rounded-lg text-white font-medium hover:bg-[#CC0033] transition-colors flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
