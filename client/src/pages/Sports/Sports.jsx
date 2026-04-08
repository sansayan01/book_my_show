import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, MapPin, ChevronRight, Grid, List, Trophy, Users, Medal, Clock, Target, Zap } from 'lucide-react'
import { cities } from '../../data/mockData'

const Sports = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCity, setSelectedCity] = useState('All')

  const categories = [
    { id: 'all', name: 'All Sports', icon: Trophy },
    { id: 'cricket', name: 'Cricket', icon: Target },
    { id: 'football', name: 'Football', icon: Zap },
    { id: 'kabaddi', name: 'Kabaddi', icon: Medal },
    { id: 'other', name: 'Other', icon: Users },
  ]

  // Generate mock sports events
  const sportsEvents = [
    {
      id: '1',
      title: 'IPL 2026 - Mumbai Indians vs CSK',
      description: 'Watch the biggest rivalry in Indian cricket live!',
      poster: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=450&fit=crop',
      date: '2026-04-12',
      venue: 'Wankhede Stadium, Mumbai',
      category: 'Cricket',
      price: 800,
      status: 'Selling Fast',
      teams: 'MI vs CSK'
    },
    {
      id: '2',
      title: 'Pro Kabaddi League 2026',
      description: 'Punjab Kings vs Gujarat Giants - Exciting PKL match',
      poster: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=300&h=450&fit=crop',
      date: '2026-04-20',
      venue: 'Sardar Patel Stadium, Ahmedabad',
      category: 'Kabaddi',
      price: 500,
      status: 'Available',
      teams: 'PBKS vs GG'
    },
    {
      id: '3',
      title: 'India vs Australia - Test Match',
      description: 'Border-Gavaskar Trophy continues',
      poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop',
      date: '2026-04-25',
      venue: 'Narendra Modi Stadium, Ahmedabad',
      category: 'Cricket',
      price: 2500,
      status: 'Limited',
      teams: 'IND vs AUS'
    },
    {
      id: '4',
      title: 'ISL 2026 - Final',
      description: 'Top two teams battle for the championship',
      poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=450&fit=crop',
      date: '2026-05-05',
      venue: 'BCCI Stadium, Mumbai',
      category: 'Football',
      price: 1500,
      status: 'Selling Fast',
      teams: 'Final'
    },
    {
      id: '5',
      title: 'WWE Live - Mumbai',
      description: 'Experience WWE action live in India',
      poster: 'https://images.unsplash.com/photo-1540754183719-3c06bd1d2d6f?w=300&h=450&fit=crop',
      date: '2026-04-30',
      venue: 'Dome, Mumbai',
      category: 'Wrestling',
      price: 2000,
      status: 'Available',
      teams: 'WWE'
    },
    {
      id: '6',
      title: 'India Open 2026 - Badminton',
      description: 'World class badminton action',
      poster: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=450&fit=crop',
      date: '2026-05-15',
      venue: 'Indira Gandhi Arena, Delhi',
      category: 'Badminton',
      price: 600,
      status: 'Available',
      teams: 'Tournament'
    },
    {
      id: '7',
      title: 'IPL 2026 - RCB vs KKR',
      description: 'Kolkata Knight Riders vs Royal Challengers Bangalore',
      poster: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=300&h=450&fit=crop',
      date: '2026-04-15',
      venue: 'Eden Gardens, Kolkata',
      category: 'Cricket',
      price: 900,
      status: 'Available',
      teams: 'KKR vs RCB'
    },
    {
      id: '8',
      title: 'Marathon 2026 - Mumbai',
      description: 'Annual Mumbai City Marathon',
      poster: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=300&h=450&fit=crop',
      date: '2026-01-20',
      venue: 'Marine Drive, Mumbai',
      category: 'Athletics',
      price: 300,
      status: 'Sold Out',
      teams: 'Marathon'
    }
  ]

  const filteredEvents = sportsEvents.filter(event => {
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (activeCategory !== 'all' && !event.category.toLowerCase().includes(activeCategory)) {
      return false
    }
    return true
  })

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Header */}
      <div className="bg-[#F59E0B] text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Sports</h1>
          <p className="text-white/80">Cricket, Football, Kabaddi and more</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#1F1F1F] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sports events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF0040]"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-[#FF0040] text-white'
                      : 'bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#3A3A3A]'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-[#FF0040] text-white' : 'bg-[#2A2A2A] text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-[#FF0040] text-white' : 'bg-[#2A2A2A] text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            {filteredEvents.length} sports events found
          </p>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-gray-400 text-sm focus:outline-none"
            >
              <option value="All">All Cities</option>
              {cities.map(city => (
                <option key={city.id} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sports Events Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvents.map(event => (
              <Link
                key={event.id}
                to={`/sports/${event.id}`}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#2A2A2A] mb-3">
                  <img
                    src={event.poster}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    event.status === 'Selling Fast' 
                      ? 'bg-orange-500 text-white'
                      : event.status === 'Sold Out'
                      ? 'bg-red-500 text-white'
                      : event.status === 'Limited'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-green-500 text-white'
                  }`}>
                    {event.status}
                  </div>

                  {/* Category Badge */}
                  <span className="absolute top-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded">
                    {event.category}
                  </span>

                  {/* Teams Overlay */}
                  <div className="absolute bottom-16 left-0 right-0 text-center">
                    <span className="px-3 py-1 bg-black/70 text-white text-sm font-bold rounded">
                      {event.teams}
                    </span>
                  </div>

                  {/* Book Button on Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-full py-2 bg-[#FF0040] text-white rounded-lg font-semibold text-sm">
                      Book Now
                    </button>
                  </div>
                </div>

                <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#FF0040] transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{event.venue.split(',')[0]}</span>
                </div>
                <p className="text-[#FF0040] text-sm font-bold mt-1">Starting from ₹{event.price}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <Link
                key={event.id}
                to={`/sports/${event.id}`}
                className="flex gap-4 bg-[#1F1F1F] rounded-xl p-4 hover:bg-[#2A2A2A] transition-colors"
              >
                <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-[#2A2A2A]">
                  <img
                    src={event.poster}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{event.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                          event.status === 'Selling Fast' ? 'bg-orange-500/20 text-orange-500' :
                          event.status === 'Sold Out' ? 'bg-red-500/20 text-red-500' :
                          'bg-green-500/20 text-green-500'
                        }`}>
                          {event.status}
                        </span>
                        <span className="px-2 py-0.5 bg-[#2A2A2A] text-gray-400 text-xs rounded">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-[#FF0040] font-bold text-lg">₹{event.price}+</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.venue.split(',')[0]}
                    </span>
                  </div>
                </div>
                <button className="self-center px-6 py-2.5 bg-[#FF0040] text-white rounded-lg font-semibold text-sm hover:bg-[#CC0033] transition-colors">
                  Book
                </button>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-8 py-3 bg-[#2A2A2A] text-white rounded-lg font-semibold hover:bg-[#3A3A3A] transition-colors">
            Load More Events
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-14 h-14 mx-auto bg-[#F59E0B]/20 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-7 h-7 text-[#F59E0B]" />
            </div>
            <h3 className="text-white font-semibold mb-2">Live Matches</h3>
            <p className="text-gray-400 text-sm">Book tickets for live sports events</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 mx-auto bg-[#F59E0B]/20 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-[#F59E0B]" />
            </div>
            <h3 className="text-white font-semibold mb-2">Exciting Tournaments</h3>
            <p className="text-gray-400 text-sm">IPL, ISL, PKL and more</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 mx-auto bg-[#F59E0B]/20 rounded-full flex items-center justify-center mb-4">
              <Target className="w-7 h-7 text-[#F59E0B]" />
            </div>
            <h3 className="text-white font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-400 text-sm">Secure your seats at great prices</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sports