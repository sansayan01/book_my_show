import { useState, useEffect } from 'react'
import { X, Check, SlidersHorizontal, Film, Globe, Clock, Ticket, Sparkles, TrendingUp } from 'lucide-react'

const FilterModal = ({ isOpen, onClose, filters, onFiltersChange, onClear, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters)
  
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])
  
  if (!isOpen) return null
  
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Documentary', 'Fantasy']
  const languages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Punjabi', 'Marathi']
  const formats = ['2D', '3D', 'IMAX', '4DX', 'MX4D', 'Dolby Atmos']
  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night']
  const priceRanges = [
    { id: 'all', label: 'All Prices' },
    { id: '0-200', label: 'Under ₹200' },
    { id: '200-500', label: '₹200 - ₹500' },
    { id: '500-1000', label: '₹500 - ₹1000' },
    { id: '1000+', label: 'Above ₹1000' }
  ]
  const quickFilters = [
    { id: 'subtitles', label: 'With Subtitles', icon: 'CC' },
    { id: 'premium', label: 'Premium Experience', icon: 'P' },
    { id: 'nearest', label: 'Nearest Shows', icon: 'N' },
    { id: 'festival', label: 'Festival Special', icon: 'F' }
  ]
  
  const toggleFilter = (category, value) => {
    setLocalFilters(prev => {
      const current = prev[category]
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [category]: updated }
    })
  }
  
  const setQuickFilter = (id) => {
    setLocalFilters(prev => {
      const current = prev.quickFilters
      const updated = current.includes(id)
        ? current.filter(v => v !== id)
        : [...current, id]
      return { ...prev, quickFilters: updated }
    })
  }
  
  const handleClear = () => {
    setLocalFilters({
      genre: [],
      language: [],
      format: [],
      time: [],
      price: 'all',
      quickFilters: []
    })
    onClear?.()
  }
  
  const handleApply = () => {
    onFiltersChange(localFilters)
    onApply?.()
  }
  
  const activeCount = localFilters.genre.length + localFilters.language.length + 
    localFilters.format.length + localFilters.time.length + 
    (localFilters.price !== 'all' ? 1 : 0) + localFilters.quickFilters.length
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#1F1F1F] rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-[#FF0040]" />
            <h2 className="text-lg font-bold text-white">Filters</h2>
            {activeCount > 0 && (
              <span className="px-2 py-0.5 bg-[#FF0040] text-white text-xs rounded-full">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Quick Filters */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF0040]" />
              Quick Filters
            </h3>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setQuickFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    localFilters.quickFilters.includes(filter.id)
                      ? 'bg-[#FF0040] text-white'
                      : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                      {filter.icon}
                    </span>
                    {filter.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Genre */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Film className="w-4 h-4 text-[#FF0040]" />
              Genre
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleFilter('genre', genre)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    localFilters.genre.includes(genre)
                      ? 'bg-[#FF0040] text-white'
                      : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                  }`}
                >
                  {localFilters.genre.includes(genre) && <Check className="w-3 h-3 inline mr-1" />}
                  {genre}
                </button>
              ))}
            </div>
          </div>
          
          {/* Language */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#FF0040]" />
              Language
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => toggleFilter('language', lang)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    localFilters.language.includes(lang)
                      ? 'bg-[#FF0040] text-white'
                      : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                  }`}
                >
                  {localFilters.language.includes(lang) && <Check className="w-3 h-3 inline mr-1" />}
                  {lang}
                </button>
              ))}
            </div>
          </div>
          
          {/* Format */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#FF0040]" />
              Format
            </h3>
            <div className="flex flex-wrap gap-2">
              {formats.map(format => (
                <button
                  key={format}
                  onClick={() => toggleFilter('format', format)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    localFilters.format.includes(format)
                      ? 'bg-[#FF0040] text-white'
                      : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                  }`}
                >
                  {localFilters.format.includes(format) && <Check className="w-3 h-3 inline mr-1" />}
                  {format}
                </button>
              ))}
            </div>
          </div>
          
          {/* Time Slot */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF0040]" />
              Show Time
            </h3>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => toggleFilter('time', time)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    localFilters.time.includes(time)
                      ? 'bg-[#FF0040] text-white'
                      : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                  }`}
                >
                  {localFilters.time.includes(time) && <Check className="w-3 h-3 inline mr-1" />}
                  {time}
                </button>
              ))}
            </div>
          </div>
          
          {/* Price Range */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF0040]" />
              Price Range
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {priceRanges.map(range => (
                <button
                  key={range.id}
                  onClick={() => setLocalFilters(prev => ({ ...prev, price: range.id }))}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                    localFilters.price === range.id
                      ? 'bg-[#FF0040] text-white'
                      : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-700 bg-[#1A1A1A]">
          <button
            onClick={handleClear}
            className="flex-1 py-3 bg-[#2A2A2A] text-white rounded-lg font-medium hover:bg-[#3A3A3A] transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#E6003A] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default FilterModal
