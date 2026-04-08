import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Grid, List, Calendar, MapPin, Clock, X, Music, Mic2, Users, Ticket, Sparkles } from 'lucide-react'
import { events, eventCategories } from '../../data/mockData'

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedCity, setSelectedCity] = useState('')

  const cities = [...new Set(events.map(e => e.city))]

  const filteredEvents = events.filter(event => {
    // Search filter
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(event.category)) {
      return false
    }
    // City filter
    if (selectedCity && event.city !== selectedCity) {
      return false
    }
    return true
  })

  const featuredEvents = filteredEvents.filter(e => e.featured).slice(0, 4)

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedCity('')
    setSearchQuery('')
  }

  const activeFiltersCount = selectedCategories.length + (selectedCity ? 1 : 0)

  const getCategoryIcon = (category) => {
    const icons = {
      'Music': <Music className="w-5 h-5" />,
      'Comedy': <Mic2 className="w-5 h-5" />,
      'Workshop': <Users className="w-5 h-5" />,
      'Festival': <Sparkles className="w-5 h-5" />
    }
    return icons[category] || <Ticket className="w-5 h-5" />
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Music': 'bg-purple-500',
      'Comedy': 'bg-yellow-500',
      'Workshop': 'bg-blue-500',
      'Festival': 'bg-pink-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Header Section */}
      <div className="bg-[#1F1F1F] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white mb-4">Events</h1>
          
          {/* Search and Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF0040]"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-[#FF0040] border-[#FF0040] text-white'
                    : 'bg-[#2A2A2A] border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-white text-[#FF0040] rounded-full text-xs flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

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
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-[#1F1F1F] border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-6">
              {/* Category */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {eventCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-4 py-1.5 rounded-full text-sm transition-colors flex items-center gap-2 ${
                        selectedCategories.includes(category)
                          ? 'bg-[#FF0040] text-white'
                          : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                      }`}
                    >
                      {getCategoryIcon(category)}
                      <span>{category}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-3">City</h3>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-4 py-1.5 bg-[#2A2A2A] border border-gray-700 rounded-full text-gray-300 text-sm focus:outline-none focus:border-[#FF0040]"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-1.5 text-[#FF0040] hover:bg-[#FF0040]/10 rounded-full text-sm transition-colors self-end"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Featured Events */}
        {featuredEvents.length > 0 && !searchQuery && activeFiltersCount === 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF0040]" />
              Featured Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredEvents.map(event => (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="group relative bg-[#2A2A2A] rounded-xl overflow-hidden hover:bg-[#333333] transition-colors"
                >
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#FF0040] to-[#CC0033] text-white text-xs font-bold rounded-full">
                      FEATURED
                    </span>
                  </div>
                  <div className="relative h-48">
                    <img
                      src={event.poster}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                  <div className="p-4">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 ${getCategoryColor(event.category)} rounded-full text-xs font-medium text-white mb-2`}>
                      {getCategoryIcon(event.category)}
                      <span>{event.category}</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#FF0040] transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-gray-400 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[#FF0040] font-bold text-sm">₹{event.price.toLocaleString()}</span>
                      <button className="px-3 py-1 bg-[#FF0040] text-white rounded-lg text-xs font-medium hover:bg-[#CC0033] transition-colors">
                        Book
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Quick Links */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {eventCategories.map(category => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                selectedCategories.includes(category)
                  ? 'bg-[#FF0040] text-white'
                  : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
              }`}
            >
              {getCategoryIcon(category)}
              <span className="font-medium">{category}</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
            : 'flex flex-col gap-4'
          }>
            {filteredEvents.map(event => (
              viewMode === 'grid' ? (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="group bg-[#2A2A2A] rounded-xl overflow-hidden hover:bg-[#333333] transition-colors"
                >
                  <div className="relative h-[180px]">
                    <img
                      src={event.poster}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 ${getCategoryColor(event.category)} rounded-full text-xs font-medium text-white`}>
                        {getCategoryIcon(event.category)}
                        <span>{event.category}</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#FF0040] transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-gray-400 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[#FF0040] font-bold text-sm">₹{event.price.toLocaleString()}</span>
                      <button className="px-3 py-1 bg-[#FF0040] text-white rounded-lg text-xs font-medium hover:bg-[#CC0033] transition-colors">
                        Book
                      </button>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="flex gap-4 bg-[#1F1F1F] rounded-xl p-3 hover:bg-[#2A2A2A] transition-colors"
                >
                  <div className="relative w-28 h-40 flex-shrink-0">
                    <img
                      src={event.poster}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <span className={`absolute bottom-2 left-2 px-2 py-0.5 ${getCategoryColor(event.category)} rounded text-xs font-medium text-white`}>
                      {event.category}
                    </span>
                  </div>
                  <div className="flex-1 py-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{event.title}</h3>
                        <span className="inline-block px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded mt-1">
                          {event.category}
                        </span>
                      </div>
                      <span className="text-[#FF0040] font-bold">₹{event.price.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('en-IN', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric'
                        })}, {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue}, {event.city}</span>
                    </div>
                  </div>
                  <button className="self-center px-6 py-2.5 bg-[#FF0040] text-white rounded-lg font-semibold text-sm hover:bg-[#CC0033] transition-colors h-fit">
                    Book Now
                  </button>
                </Link>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No events found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#CC0033] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Events