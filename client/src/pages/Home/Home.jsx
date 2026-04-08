import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Play, Calendar, Zap, Flame, Clapperboard, TrendingUp, Star, ExternalLink, Mail, ArrowRight } from 'lucide-react'
import MovieCard from '../../components/MovieCard/MovieCard'
import EventCard from '../../components/EventCard/EventCard'
import { movies, events } from '../../data/mockData'

const Home = () => {
  const [bannerIndex, setBannerIndex] = useState(0)
  const [email, setEmail] = useState('')
  const bannerRef = useRef(null)
  
  const featuredMovies = movies.slice(0, 5)
  const trendingMovies = movies.filter(m => m.rating >= 8).slice(0, 6)
  const topRatedMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 6)
  const exclusiveMovies = movies.filter(m => m.language === 'English' || m.rating >= 8.5).slice(0, 6)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % featuredMovies.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [featuredMovies.length])

  const nextBanner = () => setBannerIndex((prev) => (prev + 1) % featuredMovies.length)
  const prevBanner = () => setBannerIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)

  const languages = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam']
  const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Romance', 'Horror']

  const scrollRef = useRef(null)
  const scroll = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = 300
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Banner Carousel */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden bg-[#0f0f0f]">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === bannerIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${movie.backdrop})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
            
            <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
              <div className="max-w-2xl md:max-w-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                    <Zap className="w-3 h-3" />
                    In Cinemas
                  </span>
                  {movie.rating >= 8 && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-[#FF0040]/20 text-[#FF0040] text-xs font-semibold rounded-full">
                      <Flame className="w-3 h-3" />
                      Blockbuster
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">{movie.title}</h1>
                <p className="text-gray-300 text-sm md:text-base mb-2">{movie.genre.join(' • ')} • {movie.duration} min • {movie.language}</p>
                <p className="text-gray-400 mb-6 line-clamp-2 md:line-clamp-3 text-sm md:text-base">{movie.description}</p>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    to={`/movie/${movie.id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-[#FF0040] text-white rounded-lg font-semibold hover:bg-[#CC0033] transition-colors shadow-lg shadow-[#FF0040]/30 hover:shadow-[#FF0040]/50 transform hover:scale-105"
                  >
                    <Play className="w-5 h-5" fill="white" />
                    Book Tickets
                  </Link>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20 hover:scale-105">
                    <Play className="w-5 h-5" />
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={prevBanner}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-[#FF0040] rounded-full flex items-center justify-center text-white transition-all z-10 group"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
        </button>
        <button 
          onClick={nextBanner}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-[#FF0040] rounded-full flex items-center justify-center text-white transition-all z-10 group"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setBannerIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === bannerIndex ? 'w-8 bg-[#FF0040]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <section className="bg-[#1F1F1F] py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-gray-400 text-sm font-medium">Filters:</span>
            
            <div className="flex gap-2 flex-wrap">
              {languages.slice(0, 5).map((lang) => (
                <button 
                  key={lang}
                  className="px-4 py-1.5 bg-[#2A2A2A] text-gray-300 text-sm rounded-full hover:bg-[#FF0040] hover:text-white transition-colors border border-transparent hover:border-[#FF0040]"
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-700 hidden sm:block" />

            <div className="flex gap-2 flex-wrap">
              {genres.slice(0, 5).map((genre) => (
                <button 
                  key={genre}
                  className="px-4 py-1.5 bg-[#2A2A2A] text-gray-300 text-sm rounded-full hover:bg-[#FF0040] hover:text-white transition-colors border border-transparent hover:border-[#FF0040]"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[#FF0040] to-[#FF6B35] rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-white">Trending Now</h2>
              <p className="text-gray-500 text-xs mt-0.5">Most popular movies this week</p>
            </div>
          </div>
          <Link 
            to="/movies" 
            className="text-[#FF0040] hover:text-[#CC0033] text-sm font-medium flex items-center gap-1 group"
          >
            See All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative group">
          <button 
            onClick={() => scroll('left', scrollRef)}
            className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[#1A1A1A] to-transparent z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-[#FF0040]">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </button>
          <button 
            onClick={() => scroll('right', scrollRef)}
            className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#1A1A1A] to-transparent z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-[#FF0040]">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Top Rated
                <Star className="w-5 h-5 text-yellow-500" fill="#fbbf24" />
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">Critics' choice movies</p>
            </div>
          </div>
          <Link 
            to="/movies?filter=top" 
            className="text-[#FF0040] hover:text-[#CC0033] text-sm font-medium flex items-center gap-1 group"
          >
            See All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative group">
          <button 
            onClick={() => scroll('left', scrollRef)}
            className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[#1A1A1A] to-transparent z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-[#FF0040]">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </button>
          <button 
            onClick={() => scroll('right', scrollRef)}
            className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#1A1A1A] to-transparent z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-[#FF0040]">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          <div 
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {topRatedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Previews */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-purple-500 rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Exclusive Previews
                <Clapperboard className="w-5 h-5 text-purple-500" />
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">Premier access screenings</p>
            </div>
          </div>
          <Link 
            to="/movies?filter=exclusive" 
            className="text-[#FF0040] hover:text-[#CC0033] text-sm font-medium flex items-center gap-1 group"
          >
            See All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {exclusiveMovies.map((movie) => (
            <Link 
              key={`exclusive-${movie.id}`}
              to={`/movie/${movie.id}`}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#2A2A2A]">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2 py-1 bg-purple-500 text-white text-[10px] font-bold rounded flex items-center gap-1">
                  <Clapperboard className="w-3 h-3" />
                  EXCLUSIVE
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#FF0040] transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400" fill="#fbbf24" />
                    <span className="text-gray-300 text-xs">{movie.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Movies */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Recommended Movies</h2>
          </div>
          <Link 
            to="/movies" 
            className="text-[#FF0040] hover:text-[#CC0033] text-sm font-medium flex items-center gap-1 group"
          >
            See All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative group">
          <button 
            onClick={() => scroll('left', scrollRef)}
            className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[#1A1A1A] to-transparent z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-[#FF0040]">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </button>
          <button 
            onClick={() => scroll('right', scrollRef)}
            className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#1A1A1A] to-transparent z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-[#FF0040]">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          <div 
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Premiere Section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[#FF0040] to-[#FF6B35] rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-white">Premiere</h2>
              <p className="text-gray-500 text-xs mt-0.5">Stream new releases online</p>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.slice(0, 5).map((movie) => (
            <Link 
              key={`premiere-${movie.id}`}
              to={`/movie/${movie.id}`}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#2A2A2A]">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2 py-1 bg-[#FF0040] text-white text-[10px] font-bold rounded flex items-center gap-1">
                  <Clapperboard className="w-3 h-3" />
                  PREMIERE
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#FF0040] transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-xs">Streaming Now</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Buzz Section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#9B59B6] rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-white">Buzz</h2>
              <p className="text-gray-500 text-xs mt-0.5">Latest news & updates from the entertainment world</p>
            </div>
          </div>
          <Link 
            to="/movies" 
            className="text-[#FF0040] hover:text-[#CC0033] text-sm font-medium flex items-center gap-1"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Top 10 Bollywood Movies of 2026: A Year of Blockbusters', image: 'https://picsum.photos/seed/buzz1/400/250', type: 'Article' },
            { title: 'IPL 2026: Final Match Tickets Selling Like Hot Cakes', image: 'https://picsum.photos/seed/buzz2/400/250', type: 'News' },
            { title: 'Arijit Singh Announces New Concert Tour for 2026', image: 'https://picsum.photos/seed/buzz3/400/250', type: 'Event' },
          ].map((item, i) => (
            <div key={i} className="bg-[#1F1F1F] rounded-xl overflow-hidden group cursor-pointer hover:bg-[#252525] transition-colors">
              <div className="relative aspect-video">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white text-xs font-medium rounded">
                  {item.type}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-[#FF0040] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Trending now
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Events */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#FF6B35] rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-white">Popular Events</h2>
              <p className="text-gray-500 text-xs mt-0.5">Concerts, comedy shows, and more</p>
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

        <div className="relative group">
          <button 
            onClick={() => scroll('left', scrollRef)}
            className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[#1A1A1A] to-transparent z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-[#FF0040]">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </button>
          <button 
            onClick={() => scroll('right', scrollRef)}
            className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#1A1A1A] to-transparent z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-[#FF0040]">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#3498DB] rounded-full" />
          <div>
            <h2 className="text-xl font-bold text-white">Explore</h2>
            <p className="text-gray-500 text-xs mt-0.5">Browse by category</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Movies', icon: '🎬', path: '/movies', count: '500+' },
            { name: 'Events', icon: '🎭', path: '/events', count: '200+' },
            { name: 'Sports', icon: '⚽', path: '/sports', count: '50+' },
            { name: 'Plays', icon: '🎪', path: '/plays', count: '100+' },
            { name: 'Activities', icon: '🎯', path: '/activities', count: '80+' },
            { name: 'Stream', icon: '📺', path: '/stream', count: 'Latest' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="bg-[#1F1F1F] rounded-xl p-5 text-center group hover:bg-[#2A2A2A] transition-colors border border-gray-800 hover:border-[#FF0040] transform hover:scale-105"
            >
              <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">{item.icon}</span>
              <h3 className="text-white font-semibold text-sm group-hover:text-[#FF0040] transition-colors">{item.name}</h3>
              <p className="text-gray-500 text-xs mt-1">{item.count} listings</p>
            </Link>
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
            { title: 'IPL 2026', venue: 'Wankhede Stadium, Mumbai', date: 'Apr 12, 2026', price: '₹800', status: 'Live' },
            { title: 'Pro Kabaddi League', venue: 'Sardar Patel Stadium, Ahmedabad', date: 'Apr 20, 2026', price: '₹500', status: 'Upcoming' },
            { title: 'India vs Australia', venue: 'Narendra Modi Stadium, Ahmedabad', date: 'Apr 25, 2026', price: '₹2500', status: 'Selling Fast' },
          ].map((sport, i) => (
            <div key={i} className="bg-[#1F1F1F] rounded-xl p-5 group hover:bg-[#2A2A2A] transition-colors cursor-pointer border border-gray-800 hover:border-[#FF0040]">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white font-bold text-lg">{sport.title}</h3>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  sport.status === 'Live' 
                    ? 'bg-red-500/10 text-red-500' 
                    : sport.status === 'Selling Fast'
                    ? 'bg-orange-500/10 text-orange-500'
                    : 'bg-green-500/10 text-green-500'
                }`}>
                  {sport.status}
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

      {/* Newsletter Subscription */}
      <section className="max-w-7xl mx-auto px-4 py-8 mb-8">
        <div className="bg-gradient-to-r from-[#FF0040] to-[#FF6B35] rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Stay Updated!</h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">Subscribe to our newsletter and get exclusive deals on movies, events, and sports tickets delivered to your inbox.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button type="submit" className="px-6 py-3 bg-white text-[#FF0040] font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-white/70 text-xs mt-3">By subscribing, you agree to receive promotional emails</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
