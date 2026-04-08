import { Link } from 'react-router-dom'
import { Star, Calendar, Clock } from 'lucide-react'

const MovieCard = ({ movie }) => {
  return (
    <Link 
      to={`/movie/${movie.id}`}
      className="group flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] transition-transform hover:scale-105 duration-300"
    >
      <div className="relative rounded-xl overflow-hidden bg-[#2A2A2A]">
        {/* Poster */}
        <div className="aspect-[2/3] relative">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 rounded-md">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium text-white">{movie.rating}</span>
          </div>

          {/* Format Badge */}
          {movie.format && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#F84565] rounded text-xs font-medium text-white">
              {movie.format.split(',')[0]}
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <button className="w-full py-2 bg-[#F84565] text-white rounded-lg font-medium text-sm hover:bg-[#d63a54] transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#F84565] transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-3 mt-2 text-gray-400 text-xs">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{movie.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px]">{movie.language}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
