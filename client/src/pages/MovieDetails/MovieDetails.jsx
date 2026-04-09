import { useState, useEffect, memo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, Clock, Calendar, ChevronDown, Play, Share2, Heart, Info, Minus, Plus, X, Link as LinkIcon, Copy, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Bell } from 'lucide-react'
import { movies } from '../../data/mockData'
import ShareModal from '../../components/ShareModal/ShareModal'
import BookingReminder from '../../components/BookingReminder/BookingReminder'

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
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [castScrollPos, setCastScrollPos] = useState(0)
  
  // Show details for reminder
  const showReminderDetails = selectedTime && selectedCinema ? {
    title: movie.title,
    cinema: cinemas.find(c => c.id === selectedCinema)?.name,
    showTime: `${selectedDate} ${selectedTime}`,
  } : null

  useEffect(() => {
    const found = movies.find(m => m.id === id)
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

  // Mock cast data
  const cast = [
    { name: 'Florence Pugh', role: 'Yelena Belova', image: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Sebastian Stan', role: 'Bucky Barnes', image: 'https://i.pravatar.cc/150?img=2' },
    { name: 'David Harbour', role: 'Red Guardian', image: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Julia Louis-Dreyfus', role: 'Valentina', image: 'https://i.pravatar.cc/150?img=4' },
    { name: 'Wyatt Russell', role: 'US Agent', image: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Hannah John-Kamen', role: 'Ghost', image: 'https://i.pravatar.cc/150?img=6' },
  ]

  const crew = [
    { name: 'Jake Schreier', role: 'Director', image: null },
    { name: 'Kevin Feige', role: 'Producer', image: null },
    { name: 'Henry Jackman', role: 'Music', image: null },
  ]

  // Mock reviews
  const reviews = [
    { id: 1, user: 'MovieLover123', rating: 5, date: 'Apr 5, 2026', title: 'Amazing Action Sequences!', content: 'The action sequences were mind-blowing. A must-watch for Marvel fans!', helpful: 45 },
    { id: 2, user: 'CinemaBuff', rating: 4, date: 'Apr 4, 2026', title: 'Great Storyline', content: 'Good storyline with excellent performances. Could have been a bit longer.', helpful: 32 },
    { id: 3, user: 'BollywoodFan', rating: 4, date: 'Apr 3, 2026', title: 'Worth the Watch', content: 'Entertaining from start to finish. Great visuals and sound design.', helpful: 28 },
  ]

  // More like this - similar movies
  const moreLikeThis = movies.filter(m => m.id !== movie.id && m.genre.some(g => movie.genre.includes(g))).slice(0, 6)

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

  const handleShare = (platform) => {
    const url = window.location.href
    const title = `Check out ${movie.title}`
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${title} ${url}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        break
    }
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen pb-8">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="absolute inset-0 h-[500px] md:h-[550px] bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="absolute inset-0 h-[500px] md:h-[550px] bg-gradient-to-b from-transparent via-[#1A1A1A]/60 to-[#1A1A1A]" />
        
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
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{movie.title}</h1>
              <div className="flex items-center justify-center md:justify-start gap-4 text-gray-300 mb-4 flex-wrap">
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
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button 
                  onClick={() => setShowReminderModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  Remind Me
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
            </div>

            {/* Cast & Crew - Real BMS Style */}
            <div className="bg-[#1F1F1F] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#FF0040] rounded-full" />
                Cast & Crew
              </h2>
              
              {/* Cast - Horizontal Scroll */}
              <div className="relative">
                <button 
                  onClick={() => setCastScrollPos(Math.max(0, castScrollPos - 100))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/60 hover:bg-[#FF0040] rounded-full flex items-center justify-center text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setCastScrollPos(Math.min(400, castScrollPos + 100))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/60 hover:bg-[#FF0040] rounded-full flex items-center justify-center text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="flex gap-4 overflow-x-auto scrollbar-hide px-8" style={{ scrollbarWidth: 'none' }}>
                  {cast.map((actor, i) => (
                    <div key={i} className="flex-shrink-0 w-28 text-center">
                      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 border-2 border-[#FF0040]">
                        <img src={actor.image} alt={actor.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-white text-sm font-medium truncate">{actor.name}</h4>
                      <p className="text-gray-500 text-xs truncate">{actor.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crew */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h3 className="text-white font-semibold text-sm mb-4">Crew</h3>
                <div className="grid grid-cols-3 gap-4">
                  {crew.map((member, i) => (
                    <div key={i} className="text-center">
                      <h4 className="text-white text-sm font-medium">{member.name}</h4>
                      <p className="text-gray-500 text-xs">{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section - Real BMS Style */}
            <div className="bg-[#1F1F1F] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#FF0040] rounded-full" />
                  Reviews
                </h2>
                <button className="text-[#FF0040] text-sm hover:underline">Write a Review</button>
              </div>

              {/* Rating Summary */}
              <div className="flex items-center gap-6 mb-6 p-4 bg-[#2A2A2A] rounded-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{movie.rating}</div>
                  <div className="flex items-center gap-1 justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(movie.rating/2) ? 'text-green-400 fill-green-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Based on 2,543 reviews</p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 w-3">{star}</span>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-400 rounded-full" 
                          style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : 2}%` }}
                        />
                      </div>
                      <span className="text-gray-500 w-8">{star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '7%' : '2%'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="p-4 bg-[#2A2A2A] rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#FF0040] rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {review.user[0]}
                          </div>
                          <span className="text-white font-medium">{review.user}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-green-400 fill-green-400' : 'text-gray-600'}`} />
                            ))}
                          </div>
                          <span className="text-gray-500 text-xs">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1">{review.title}</h4>
                    <p className="text-gray-400 text-sm mb-3">{review.content}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-500 text-sm hover:text-[#FF0040]">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpful})
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 text-sm hover:text-[#FF0040]">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 bg-[#2A2A2A] text-gray-300 rounded-lg text-sm hover:bg-[#3A3A3A] transition-colors">
                View All Reviews
              </button>
            </div>

            {/* More Like This */}
            <div className="bg-[#1F1F1F] rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#FF0040] rounded-full" />
                More Like This
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {moreLikeThis.map(m => (
                  <Link 
                    key={m.id}
                    to={`/movie/${m.id}`}
                    className="group"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                      <img 
                        src={m.poster} 
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/60 rounded">
                        <Star className="w-3 h-3 text-green-400 fill-green-400" />
                        <span className="text-xs text-white font-semibold">{m.rating}</span>
                      </div>
                    </div>
                    <h4 className="text-white text-sm font-medium truncate group-hover:text-[#FF0040] transition-colors">{m.title}</h4>
                    <p className="text-gray-500 text-xs">{m.genre.slice(0, 2).join(', ')}</p>
                  </Link>
                ))}
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
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setTrailerOpen(false)}>
          <div className="w-full max-w-5xl relative">
            <button 
              onClick={() => setTrailerOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#FF0040] transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0f0f0f]">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-[#FF0040] rounded-full flex items-center justify-center">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                  <p className="text-white text-lg font-medium">{movie.title}</p>
                  <p className="text-gray-400 text-sm mt-2">Official Trailer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
          <div className="w-full max-w-md bg-[#1F1F1F] rounded-xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Share Movie</h2>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6 p-4 bg-[#2A2A2A] rounded-lg">
              <img src={movie.poster} alt={movie.title} className="w-16 h-24 object-cover rounded-lg" />
              <div>
                <h3 className="text-white font-semibold">{movie.title}</h3>
                <p className="text-gray-400 text-sm">{movie.duration} min • {movie.genre.join(', ')}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <button 
                onClick={() => handleShare('facebook')}
                className="flex flex-col items-center gap-2 p-4 bg-[#1877F2]/20 rounded-lg hover:bg-[#1877F2]/30 transition-colors"
              >
                <Facebook className="w-6 h-6 text-[#1877F2]" />
                <span className="text-gray-400 text-xs">Facebook</span>
              </button>
              <button 
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center gap-2 p-4 bg-[#1DA1F2]/20 rounded-lg hover:bg-[#1DA1F2]/30 transition-colors"
              >
                <Twitter className="w-6 h-6 text-[#1DA1F2]" />
                <span className="text-gray-400 text-xs">Twitter</span>
              </button>
              <button 
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center gap-2 p-4 bg-[#25D366]/20 rounded-lg hover:bg-[#25D366]/30 transition-colors"
              >
                <svg className="w-6 h-6 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-gray-400 text-xs">WhatsApp</span>
              </button>
              <button 
                onClick={() => handleShare('copy')}
                className="flex flex-col items-center gap-2 p-4 bg-[#2A2A2A] rounded-lg hover:bg-[#3A3A3A] transition-colors"
              >
                <Copy className="w-6 h-6 text-gray-400" />
                <span className="text-gray-400 text-xs">Copy Link</span>
              </button>
            </div>

            <div className="flex items-center gap-2 p-3 bg-[#2A2A2A] rounded-lg">
              <LinkIcon className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={window.location.href} 
                readOnly 
                className="flex-1 bg-transparent text-gray-400 text-sm outline-none"
              />
              <button 
                onClick={() => handleShare('copy')}
                className="text-[#FF0040] text-sm font-medium hover:underline"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        title={movie.title}
      />
      
      {/* Booking Reminder Modal */}
      <BookingReminder
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        showDetails={showReminderDetails}
      />
    </div>
  )
}

// Memoize MovieDetails for performance
export default memo(MovieDetails)