import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Grid, List, Calendar, MapPin, Clock, X, Ticket, Theater } from 'lucide-react'
import { plays, playCategories, playLanguages, cities } from '../../data/mockData'

const Plays = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedCity, setSelectedCity] = useState('')

  const filteredPlays = plays.filter(play => {
    if (searchQuery && !play.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(play.category)) {
      return false
    }
    if (selectedLanguages.length > 0 && !selectedLanguages.includes(play.language)) {
      return false
    }
    if (selectedCity && play.city !== selectedCity) {
      return false
    }
    return true
  })

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const toggleLanguage = (language) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== language))
    } else {
      setSelectedLanguages([...selectedLanguages, language])
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedLanguages([])
    setSelectedCity('')
    setSearchQuery('')
  }

  const activeFiltersCount = selectedCategories.length + selectedLanguages.length + (selectedCity ? 1 : 0)

  const getCategoryColor = (category) => {
    const colors = {
      'Drama': 'bg-blue-500',
      'Comedy': 'bg-yellow-500',
      'Musical': 'bg-purple-500',
      'Thriller': 'bg-red-500',
      'Opera': 'bg-pink-500',
      'Dance': 'bg-green-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      <div className="bg-[#1F1F1F] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white mb-4">Plays & Theatre</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for plays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF0040]"
              />
            </div>

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

      {showFilters && (
        <div className="bg-[#1F1F1F] border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-6">
              <div>
                <h3 className="text-white font-semibold text-sm mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {playCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                        selectedCategories.includes(category)
                          ? 'bg-[#FF0040] text-white'
                          : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold text-sm mb-3">Language</h3>
                <div className="flex flex-wrap gap-2">
                  {playLanguages.map(language => (
                    <button
                      key={language}
                      onClick={() => toggleLanguage(language)}
                      className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                        selectedLanguages.includes(language)
                          ? 'bg-[#FF0040] text-white'
                          : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold text-sm mb-3">City</h3>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-4 py-1.5 bg-[#2A2A2A] border border-gray-700 rounded-full text-gray-300 text-sm focus:outline-none focus:border-[#FF0040]"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>

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

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {playCategories.map(category => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                selectedCategories.includes(category)
                  ? 'bg-[#FF0040] text-white'
                  : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${getCategoryColor(category)}`} />
              <span className="font-medium">{category}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            {filteredPlays.length} {filteredPlays.length === 1 ? 'play' : 'plays'} found
          </p>
        </div>

        {filteredPlays.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
            : 'flex flex-col gap-4'
          }>
            {filteredPlays.map(play => (
              viewMode === 'grid' ? (
                <Link
                  key={play.id}
                  to={`/play/${play.id}`}
                  className="group bg-[#2A2A2A] rounded-xl overflow-hidden hover:bg-[#333333] transition-colors"
                >
                  <div className="relative h-[180px]">
                    <img
                      src={play.poster}
                      alt={play.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2 py-1 ${getCategoryColor(play.category)} rounded-full text-xs font-medium text-white`}>
                        {play.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs text-white">
                        {play.language}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#FF0040] transition-colors">
                      {play.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-gray-400 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{play.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{play.venue}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[#FF0040] font-bold text-sm">₹{play.price.toLocaleString()}</span>
                      <button className="px-3 py-1 bg-[#FF0040] text-white rounded-lg text-xs font-medium hover:bg-[#CC0033] transition-colors">
                        Book
                      </button>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  key={play.id}
                  to={`/play/${play.id}`}
                  className="flex gap-4 bg-[#1F1F1F] rounded-xl p-3 hover:bg-[#2A2A2A] transition-colors"
                >
                  <div className="relative w-28 h-40 flex-shrink-0">
                    <img
                      src={play.poster}
                      alt={play.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <span className={`absolute bottom-2 left-2 px-2 py-0.5 ${getCategoryColor(play.category)} rounded text-xs font-medium text-white`}>
                      {play.category}
                    </span>
                  </div>
                  <div className="flex-1 py-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{play.title}</h3>
                        <span className="inline-block px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded mt-1">
                          {play.language}
                        </span>
                      </div>
                      <span className="text-[#FF0040] font-bold">₹{play.price.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{play.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(play.date).toLocaleDateString('en-IN', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric'
                        })}, {play.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {play.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{play.venue}, {play.city}</span>
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
              <Theater className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No plays found</h3>
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

export default Plays
