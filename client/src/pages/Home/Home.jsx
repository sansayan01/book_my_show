import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Play, Calendar } from 'lucide-react'
import MovieCard from '../../components/MovieCard/MovieCard'
import EventCard from '../../components/EventCard/EventCard'
import { movies, events } from '../../data/mockData'

const Home = () => {
  const [bannerIndex, setBannerIndex] = useState(0)
  
  // Featured movies for banner
  const featuredMovies = movies.slice(0, 4)
  
  // Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % featuredMovies.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [featuredMovies.length])

  const nextBanner = () => setBannerIndex((prev) => (prev + 1) % featuredMovies.length)
  const prevBanner = () => setBannerIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)

  // Filter options like real BMS
  const languages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam']
  const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror']

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Banner Carousel - Real BMS Style */}
      <div className="relative w-full h-[400px] md:h-[450px] overflow-hidden">
        {/* Banner Slides */}
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === bannerIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${movie.backdrop})` }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            
            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{movie.title}</h1>
                <p className="text-gray-300 text-sm mb-2">{movie.genre.join(' • ')} • {movie.duration} min • {movie.language}</p>
                <p className="text-gray-400 mb-6 line-clamp-2">{movie.description}</p>
                <div className="flex gap-3">
                  <Link 
                    to={`/movie/${movie.id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-[#FF0040] text-white rounded-lg font-semibold hover:bg-[#CC0033] transition-colors"
                  >
                    <Play className="w-5 h-5" fill="white" />
                    Book Tickets
                  </Link>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm">
                    <Play className="w-5 h-5" />
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button 
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-[#FF0040] rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-[#FF0040] rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setBannerIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === bannerIndex ? 'w-6 bg-[#FF0040]' : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Filters - Real BMS Style */}
      <section className="bg-[#1F1F1F] py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-gray-400 text-sm font-medium">Filters:</span>
            
            {/* Language Filter */}
            <div className="flex gap-2">
              {languages.slice(0, 4).map((lang) => (
                <button 
                  key={lang}
                  className="px-4 py-1.5 bg-[#2A2A2A] text-gray-300 text-sm rounded-full hover:bg-[#FF0040] hover:text-white transition-colors"
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-700 hidden sm:block" />

            {/* Genre Filter */}
            <div className="flex gap-2">
              {genres.slice(0, 4).map((genre) => (
                <button 
                  key={genre}
                  className="px-4 py-1.5 bg-[#2A2A2A] text-gray-300 text-sm rounded-full hover:bg-[#FF0040] hover:text-white transition-colors"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Movies - Real BMS Layout */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Recommended Movies</h2>
          </div>
          <Link 
            to="/movies" 
            className="text-[#FF0040] hover:text-[#CC0033] text-sm font-medium flex items-center gap-1"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Upcoming Movies */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Upcoming Movies</h2>
          </div>
          <Link 
            to="/movies" 
            className="text-[#FF0040] hover:text-[#CC0033] text-sm font-medium flex items-center gap-1"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {movies.slice(5, 10).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Popular Events - Real BMS Style */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#FF6B35] rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-white">Popular Events</h2>
            </div>
          </div>
          <Link 
            to="/events" 
            className="text-[#FF0040] hover:text-[#CC0033] text-sm font-medium flex items-center gap-1"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Stream Section - Real BMS Style */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#22C55E] rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-white">Stream</h2>
              <p className="text-gray-500 text-xs mt-0.5">Exclusive content on your favorite OTT</p>
            </div>
          </div>
          <Link 
            to="/stream" 
            className="text-[#FF0040] hover:text-[#CC0033] text-sm font-medium flex items-center gap-1"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'The Night Agent', type: 'Web Series', img: 'https://picsum.photos/seed/stream1/400/600' },
            { title: 'Murder Mystery 2', type: 'Movie', img: 'https://picsum.photos/seed/stream2/400/600' },
            { title: 'The Last of Us', type: 'Web Series', img: 'https://picsum.photos/seed/stream3/400/600' },
            { title: 'Dune: Part Two', type: 'Movie', img: 'https://picsum.photos/seed/stream4/400/600' },
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-[#FF0040] rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  </div>
                </div>
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#FF0040] text-white text-xs font-semibold rounded">
                  {item.type}
                </span>
              </div>
              <h3 className="text-white font-medium mt-2 text-sm truncate">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Sports Section */}
      <section className="max-w-7xl mx-auto px-4 py-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#F59E0B] rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-white">Sports</h2>
              <p className="text-gray-500 text-xs mt-0.5">Book tickets for live matches</p>
            </div>
          </div>
          <Link 
            to="/sports" 
            className="text-[#FF0040] hover:text-[#CC0033] text-sm font-medium flex items-center gap-1"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'IPL 2026', venue: 'Wankhede Stadium, Mumbai', date: 'Apr 12, 2026', price: '₹800' },
            { title: 'Pro Kabaddi League', venue: 'Sardar Patel Stadium, Ahmedabad', date: 'Apr 20, 2026', price: '₹500' },
            { title: 'India vs Australia', venue: 'Narendra Modi Stadium, Ahmedabad', date: 'Apr 25, 2026', price: '₹2500' },
          ].map((sport, i) => (
            <div key={i} className="bg-[#1F1F1F] rounded-xl p-5 group hover:bg-[#2A2A2A] transition-colors cursor-pointer border border-gray-800 hover:border-[#FF0040]">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white font-bold text-lg">{sport.title}</h3>
                <span className="px-3 py-1 bg-[#FF0040]/10 text-[#FF0040] text-xs font-semibold rounded-full">
                  Live
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Calendar className="w-4 h-4" />
                {sport.date}
              </div>
              <div className="text-gray-500 text-sm mb-4">{sport.venue}</div>
              <div className="flex justify-between items-center">
                <span className="text-[#FF0040] font-bold">Starting from {sport.price}</span>
                <button className="px-4 py-2 bg-[#FF0040] text-white text-sm font-semibold rounded-lg hover:bg-[#CC0033] transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
