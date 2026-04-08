import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, Clock, Calendar, ChevronDown, Play, Share2, Heart, Info, Minus, Plus } from 'lucide-react'
import { movies } from '../../data/mockData'

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [selectedCinema, setSelectedCinema] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [showTimeSlots, setShowTimeSlots] = useState({})
  const [trailerOpen, setTrailerOpen] = useState(false)

  useEffect(() => {
    const found = movies.find(m => m.id === parseInt(id))
    setMovie(found)
  }, [id])

  if (!movie) {
    return (
      <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // Mock cinema data
  const cinemas = [
    { id: 1, name: 'PVR Logix, Sector 143', distance: '6.2 km', price: 250 },
    { id: 2, name: 'INOX: DLF Mall of India', distance: '8.5 km', price: 320 },
    { id: 3, name: 'Cinepolis: Unity One Mall', distance: '10.1 km', price: 280 },
    { id: 4, name: 'Miraj Cinemas', distance: '12.3 km', price: 180 },
  ]

  const dates = [
    { day: 'Today', date: '8', full: new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) },
    { day: 'Tomorrow', date: '9', full: new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) },
    { day: new Date(Date.now() + 172800000).toLocaleDateString('en-IN', { weekday: 'short' }), date: '10', full: new Date(Date.now() + 172800000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) },
    { day: new Date(Date.now() + 259200000).toLocaleDateString('en-IN', { weekday: 'short' }), date: '11', full: new Date(Date.now() + 259200000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) },
    { day: new Date(Date.now() + 345600000).toLocaleDateString('en-IN', { weekday: 'short' }), date: '12', full: new Date(Date.now() + 345600000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) },
    { day: new Date(Date.now() + 432000000).toLocaleDateString('en-IN', { weekday: 'short' }), date: '13', full: new Date(Date.now() + 432000000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) },
  ]

  const timeSlots = ['10:30 AM', '01:45 PM', '03:15 PM', '06:00 PM', '09:30 PM', '11:00 PM']

  const toggleDate = (date) => {
    setSelectedDate(selectedDate === date ? null : date)
    setSelectedTime(null)
  }

  const toggleTime = (time) => {
    setSelectedTime(selectedTime === time ? null : time)
  }

  const toggleCinema = (cinemaId) => {
    setSelectedCinema(selectedCinema === cinemaId ? null : cinemaId)
    setSelectedTime(null)
  }

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat))
    } else if (selectedSeats.length < 10) {
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const handleBook = () => {
    if (selectedCinema && selectedDate && selectedTime && selectedSeats.length > 0) {
      navigate('/checkout', {
        state: {
          movie,
          cinema: cinemas.find(c => c.id === selectedCinema),
          date: selectedDate,
          time: selectedTime,
          seats: selectedSeats
        }
      })
    }
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen pb-8">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="absolute inset-0 h-96 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="absolute inset-0 h-96 bg-gradient-to-b from-transparent via-[#1A1A1A]/60 to-[#1A1A1A]" />
        
        <div className="relative max-w-7xl mx-auto px-4 pt-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-48 md:w-56 mx-auto md:mx-0 flex-shrink-0">
              <img 
                src={movie.poster} 
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h1>
              <div className="flex items-center justify-center md:justify-start gap-4 text-gray-300 mb-4">
                <span className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-green-400 fill-green-400" />
                  {movie.rating}/10
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {movie.duration} min
                </span>
                <span>{movie.language}</span>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {movie.genre.map((g, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full">
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <button 
                  onClick={() => setTrailerOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-5 h-5" fill="black" />
                  Watch Trailer
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors">
                  <Heart className="w-5 h-5" />
                  Watchlist
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-[#1F1F1F] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#FF0040]" />
                About the movie
              </h2>
              <p className="text-gray-400 leading-relaxed">{movie.description}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Director</span>
                  <p className="text-white">Christopher Nolan</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Cast</span>
                  <p className="text-white">Christian Bale, Tom Hardy, Anne Hathaway</p>
                </div>
              </div>
            </div>

            {/* Select Cinemas */}
            <div className="bg-[#1F1F1F] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Select Cinema & Show</h2>
              
              {/* Cinemas */}
              <div className="space-y-3">
                {cinemas.map((cinema) => (
                  <div key={cinema.id} className="border border-gray-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleCinema(cinema.id)}
                      className={`w-full p-4 flex items-center justify-between transition-colors ${
                        selectedCinema === cinema.id ? 'bg-[#2A2A2A]' : 'bg-[#1A1A1A] hover:bg-[#252525]'
                      }`}
                    >
                      <div className="text-left">
                        <h3 className="text-white font-semibold">{cinema.name}</h3>
                        <p className="text-gray-500 text-sm">{cinema.distance}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#FF0040] font-bold">₹{cinema.price}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${selectedCinema === cinema.id ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Time Slots */}
                    {selectedCinema === cinema.id && (
                      <div className="p-4 bg-[#1F1F1F] border-t border-gray-800">
                        {/* Date Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                          {dates.map((d) => (
                            <button
                              key={d.date}
                              onClick={() => toggleDate(d.date)}
                              className={`flex-shrink-0 px-4 py-3 rounded-lg text-center transition-colors ${
                                selectedDate === d.date
                                  ? 'bg-[#FF0040] text-white'
                                  : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                              }`}
                            >
                              <div className="text-xs font-medium">{d.day}</div>
                              <div className="text-lg font-bold">{d.date}</div>
                            </button>
                          ))}
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                          <div className="pt-4 border-t border-gray-800">
                            <p className="text-gray-400 text-sm mb-3">Select Show Time</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                              {timeSlots.map((time) => (
                                <button
                                  key={time}
                                  onClick={() => toggleTime(time)}
                                  className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    selectedTime === time
                                      ? 'bg-[#FF0040] text-white'
                                      : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Seat Selection */}
          <div className="lg:col-span-1">
            <div className="bg-[#1F1F1F] rounded-xl p-6 sticky top-4">
              <h2 className="text-xl font-bold text-white mb-6">Select Seats</h2>
              
              {selectedTime ? (
                <>
                  {/* Seat Legend */}
                  <div className="flex justify-center gap-4 mb-6 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-[#2A2A2A] border border-gray-600 rounded-sm" />
                      <span className="text-gray-400">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-[#FF0040] rounded-sm" />
                      <span className="text-gray-400">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-600 rounded-sm" />
                      <span className="text-gray-400">Occupied</span>
                    </div>
                  </div>

                  {/* Screen */}
                  <div className="bg-gray-700 text-center py-2 rounded-lg mb-6 text-sm text-gray-300">
                    SCREEN
                  </div>

                  {/* Seats */}
                  <div className="flex justify-center gap-1 flex-wrap">
                    {Array.from({ length: 64 }, (_, i) => {
                      const row = Math.floor(i / 8)
                      const col = i % 8
                      const seatNum = `${String.fromCharCode(65 + row)}${col + 1}`
                      const isOccupied = Math.random() < 0.3
                      const isSelected = selectedSeats.includes(seatNum)
                      
                      return (
                        <button
                          key={i}
                          onClick={() => !isOccupied && toggleSeat(seatNum)}
                          disabled={isOccupied}
                          className={`w-8 h-8 rounded-t-lg text-[10px] font-medium transition-colors ${
                            isOccupied
                              ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#FF0040] text-white'
                              : 'bg-[#2A2A2A] border border-gray-600 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {col + 1}
                        </button>
                      )
                    })}
                  </div>

                  {/* Selected Seats Info */}
                  {selectedSeats.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-800">
                      <div className="flex justify-between text-gray-400 text-sm mb-2">
                        <span>Selected Seats</span>
                        <span>{selectedSeats.sort().join(', ')}</span>
                      </div>
                      <div className="flex justify-between text-gray-400 text-sm mb-2">
                        <span>Quantity</span>
                        <span>{selectedSeats.length}</span>
                      </div>
                      <div className="flex justify-between text-white font-bold text-lg mt-4">
                        <span>Total</span>
                        <span>₹{selectedSeats.length * (cinemas.find(c => c.id === selectedCinema)?.price || 250)}</span>
                      </div>
                      
                      <Link
                        to="/checkout"
                        state={{
                          movie,
                          cinema: cinemas.find(c => c.id === selectedCinema),
                          date: selectedDate,
                          time: selectedTime,
                          seats: selectedSeats
                        }}
                        className="block w-full mt-4 py-3 bg-[#FF0040] text-white text-center rounded-lg font-semibold hover:bg-[#CC0033] transition-colors"
                      >
                        Proceed to Book
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🎭</span>
                  </div>
                  <p className="text-gray-400">Select show time to choose seats</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {trailerOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setTrailerOpen(false)}>
          <div className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
              <p className="text-white">Trailer would play here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetails
