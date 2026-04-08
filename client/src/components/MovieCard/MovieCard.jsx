import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

const MovieCard = ({ movie }) => {
  return (
    <Link 
      to={`/movie/${movie.id}`}
      className="group flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] transition-transform hover:scale-105 duration-300"
    >
      <div className="relative rounded-xl overflow-hidden bg-[#2A2A2A]">
        {/* Poster */}
        <div className="relative aspect-[2/3]">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Rating Badge - Top Left */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/80 rounded">
            <Star className="w-3 h-3 text-green-400 fill-green-400" />
            <span className="text-xs font-semibold text-white">{movie.rating}</span>
          </div>

          {/* Format Badge */}
          {movie.format && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-[#FF0040] rounded text-[10px] font-bold text-white">
              {movie.format.split(',')[0]}
            </div>
          )}

          {/* Hover Overlay with Book Button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <button className="w-full py-2.5 bg-[#FF0040] text-white rounded-lg font-semibold text-sm hover:bg-[#CC0033] transition-colors shadow-lg shadow-[#FF0040]/30">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Info - BMS Style */}
        <div className="p-3 bg-[#1F1F1F]">
          <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#FF0040] transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-400 text-xs">{movie.duration} min</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full" />
            <span className="text-gray-400 text-xs">{movie.language}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genre.slice(0, 2).map((g, i) => (
              <span key={i} className="text-[10px] text-gray-500">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
