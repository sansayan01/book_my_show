import { Link } from 'react-router-dom'
import { ArrowRight, Play, Tv, Trophy } from 'lucide-react'
import Banner from '../../components/Banner/Banner'
import MovieCard from '../../components/MovieCard/MovieCard'
import EventCard from '../../components/EventCard/EventCard'
import { movies, events } from '../../data/mockData'

const Home = () => {
  const latestMovies = movies.slice(0, 6)
  const upcomingMovies = movies.slice(3, 6)
  const trendingEvents = events.slice(0, 4)

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Banner */}
      <Banner />

      {/* Quick Book Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Movies', 'Events', 'Sports', 'Plays'].map((category) => (
            <Link
              key={category}
              to={`/${category.toLowerCase()}`}
              className="flex items-center justify-center gap-2 py-4 bg-[#2A2A2A] rounded-xl hover:bg-[#F84565] hover:-translate-y-1 transition-all duration-300 group"
            >
              <Play className="w-5 h-5 text-[#F84565] group-hover:text-white" />
              <span className="text-white font-medium">{category}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Releases */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Latest Releases</h2>
            <p className="text-gray-400 mt-1">Book tickets for the newest movies</p>
          </div>
          <Link 
            to="/movies" 
            className="flex items-center gap-2 text-[#F84565] hover:text-white transition-colors"
          >
            <span className="text-sm font-medium">View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {latestMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Recommended Movies */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Recommended Movies</h2>
            <p className="text-gray-400 mt-1">Top picks for you</p>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {upcomingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Popular Events */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Popular Events</h2>
            <p className="text-gray-400 mt-1">Don't miss these events</p>
          </div>
          <Link 
            to="/events" 
            className="flex items-center gap-2 text-[#F84565] hover:text-white transition-colors"
          >
            <span className="text-sm font-medium">View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {trendingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Stream Section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2A9D8F] rounded-lg">
              <Tv className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Stream</h2>
              <p className="text-gray-400 mt-1">Watch online on your favorite OTT</p>
            </div>
          </div>
          <Link 
            to="/stream" 
            className="flex items-center gap-2 text-[#F84565] hover:text-white transition-colors"
          >
            <span className="text-sm font-medium">View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#2A2A2A] rounded-xl overflow-hidden group hover:ring-2 hover:ring-[#F84565] transition-all cursor-pointer">
              <div className="aspect-video bg-gray-800 relative">
                <img 
                  src={`https://picsum.photos/300/200?random=${i + 10}`} 
                  alt="OTT Content"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-white font-medium text-sm truncate">Web Series {i}</h3>
                <p className="text-gray-400 text-xs mt-1">Streaming Now</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sports Section */}
      <section className="max-w-7xl mx-auto px-4 py-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F59E0B] rounded-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Sports</h2>
              <p className="text-gray-400 mt-1">Book tickets for live matches</p>
            </div>
          </div>
          <Link 
            to="/sports" 
            className="flex items-center gap-2 text-[#F84565] hover:text-white transition-colors"
          >
            <span className="text-sm font-medium">View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'IPL 2026', subtitle: 'Mumbai Indians vs CSK', date: 'Apr 12, 2026' },
            { title: 'Pro Kabaddi League', subtitle: 'Final Match', date: 'Apr 20, 2026' },
            { title: 'India vs Australia', subtitle: 'T20I Series', date: 'Apr 25, 2026' }
          ].map((sport, i) => (
            <div key={i} className="bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between group hover:bg-[#F84565]/10 transition-colors cursor-pointer">
              <div>
                <h3 className="text-white font-semibold">{sport.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{sport.subtitle}</p>
                <p className="text-[#F84565] text-sm mt-2">{sport.date}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#F84565] transition-colors" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
