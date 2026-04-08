import { useState, useEffect } from 'react'
import { MapPin, Search, ChevronRight, X } from 'lucide-react'
import { cities } from '../../data/mockData'

const CitySelector = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const [detectedCity, setDetectedCity] = useState(null)

  useEffect(() => {
    // Try to detect user's city (simplified - would use geolocation in real app)
    const savedCity = localStorage.getItem('selectedCity')
    if (savedCity) {
      const city = cities.find(c => c.name === savedCity)
      if (city) {
        setDetectedCity(city)
        setSelectedCity(city)
      }
    }
  }, [])

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    localStorage.setItem('selectedCity', city.name)
    localStorage.setItem('citySelected', 'true')
  }

  const handleConfirm = () => {
    if (selectedCity) {
      onClose()
    }
  }

  const handleClose = () => {
    // If user closes without selecting, use default city
    if (!selectedCity) {
      const defaultCity = cities[0]
      localStorage.setItem('selectedCity', defaultCity.name)
      localStorage.setItem('citySelected', 'true')
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF0040] to-[#CC0033] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl font-bold">Select your City</h2>
              <p className="text-white/80 text-sm mt-1">To avail best experience</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for your city"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF0040]"
            />
          </div>
        </div>

        {/* Detected City */}
        {detectedCity && !searchQuery && (
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
              Detected City
            </p>
            <button
              onClick={() => handleCitySelect(detectedCity)}
              className="flex items-center justify-between w-full p-3 bg-white border-2 border-[#FF0040] rounded-xl hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#FF0040]" />
                <span className="font-semibold text-gray-800">{detectedCity.name}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#FF0040]" />
            </button>
          </div>
        )}

        {/* City List */}
        <div className="max-h-[300px] overflow-y-auto">
          <p className="px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide sticky top-0 bg-white">
            Popular Cities
          </p>
          {filteredCities.map((city) => (
            <button
              key={city.id}
              onClick={() => handleCitySelect(city)}
              className={`w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors ${
                selectedCity?.id === city.id ? 'bg-red-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className={`w-4 h-4 ${selectedCity?.id === city.id ? 'text-[#FF0040]' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedCity?.id === city.id ? 'text-[#FF0040]' : 'text-gray-700'}`}>
                  {city.name}
                </span>
              </div>
              {selectedCity?.id === city.id && (
                <ChevronRight className="w-4 h-4 text-[#FF0040]" />
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleConfirm}
            disabled={!selectedCity}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              selectedCity 
                ? 'bg-[#FF0040] text-white hover:bg-[#CC0033]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm City
          </button>
        </div>
      </div>
    </div>
  )
}

export default CitySelector