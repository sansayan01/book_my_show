import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Star, Clock, Calendar, Play, ChevronLeft, Share2, Heart, Award } from 'lucide-react'
import { movies } from '../../data/mockData'
import { useBooking } from '../../context/BookingContext'
import { useAuth } from '../../context/AuthContext'

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { selectMovie, selectShow } = useBooking()
  const { openAuthModal } = useAuth()
  const [movie, setMovie] = useState(null)
  const [selectedDate, setSelectedDate] = useState(0)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    const foundMovie = movies.find(m => m.id === id)
    if (foundMovie) {
      setMovie(foundMovie)
    }
  }, [id])

  if (!movie) {
    return (
      <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Movie not found</h2>
          <Link to="/movies" className="text-[#F84565] mt-4 inline-block">Back to Movies</Link>
        </div>
      </div>
    )
  }

  // Generate showtimes
  const getShowtimes = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const dates = getShowtimes()

  const theatres = [
    { name: 'PVR Cinemas', shows: ['10:30 AM', '1:45 PM', '5:00 PM', '8:15 PM', '11:30 PM'] },
    { name: 'INOX', shows: ['10:00 AM', '12:30 PM', '3:00 PM', '6:30 PM', '9:00 PM'] },
    { name: ' Cinepolis', shows: ['11:00 AM', '2:00 PM', '5:30 PM', '8:00 PM', '10:30 PM'] },
    { name: 'Miraj Cinemas', shows: ['09:30 AM', '12:00 PM', '3:30 PM', '7:00 PM', '10:00 PM'] }
  ]

  const handleBookTickets = (theatre, time) => {
    const show = {
      id: `${movie.id}-${theatre}-${time}`.replace(/\s/g, '-'),
      movie,
      theatre,
      time,
      date: dates[selectedDate]
    }
    selectMovie(movie)
    selectShow(show)
    navigate(`/book/${show.id}`)
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Backdrop Banner */}
      <div className="relative h-[300px] sm:h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent" />
        
        <Link 
          to="/movies"
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>
      </div>

      {/* Movie Info */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-[280px] sm:w-[300px] rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={movie.poster} 
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 pt-4 md:pt-20">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-lg">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-semibold">{movie.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{movie.duration} min</span>
              </div>
              <div className="text-gray-400">
                {movie.format}
              </div>
              <div className="px-2 py-1 bg-gray-700 rounded text-gray-300 text-sm">
                {movie.language}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map((g) => (
                <span key={g} className="px-3 py-1 bg-[#F84565]/20 text-[#F84565] rounded-full text-sm">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-base mb-6 max-w-2xl">
              {movie.description}
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowTrailer(!showTrailer)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Play className="w-5 h-5" />
                Watch Trailer
              </button>
              <button className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Trailer Modal */}
            {showTrailer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/90" onClick={() => setShowTrailer(false)} />
                <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden">
                  <iframe
                    src={movie.trailer}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
                <button
                  onClick={() => setShowTrailer(false)}
                  className="absolute top-4 right-4 p-2 bg-white text-black rounded-full"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cast & Crew */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Cast & Crew</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {movie.cast.map((actor, i) => (
              <div key={i} className="flex-shrink-0 w-[120px] text-center">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden mx-auto mb-3 border-2 border-gray-700">
                  <img src={actor.image} alt={actor.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-white font-medium text-sm">{actor.name}</h4>
                <p className="text-gray-400 text-xs">{actor.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Showtimes */}
        <div className="mt-12 pb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Select Showtime</h2>
          
          {/* Date Selector */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {dates.map((date, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(i)}
                className={`flex-shrink-0 w-[70px] py-3 rounded-xl border transition-all ${
                  selectedDate === i
                    ? 'bg-[#F84565] border-[#F84565] text-white'
                    : 'bg-[#2A2A2A] border-gray-700 text-gray-300 hover:border-[#F84565]'
                }`}
              >
                <div className="text-xs uppercase">{date.toLocaleDateString('en-IN', { weekday: 'short' })}</div>
                <div className="text-xl font-bold">{date.getDate()}</div>
              </button>
            ))}
          </div>

          {/* Theatres */}
          <div className="space-y-4">
            {theatres.map((theatre, i) => (
              <div key={i} className="bg-[#2A2A2A] rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-[#F84565]" />
                  <h3 className="text-white font-semibold">{theatre.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {theatre.shows.map((time, j) => (
                    <button
                      key={j}
                      onClick={() => handleBookTickets(theatre.name, time)}
                      className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg font-medium hover:bg-[#F84565] hover:text-white transition-colors"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
