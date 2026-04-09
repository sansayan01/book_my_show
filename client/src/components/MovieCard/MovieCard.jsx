import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock } from 'lucide-react'
import LazyImage from '../LazyImage/LazyImage'

const MovieCard = memo(({ movie, index }) => {
  return (
    <Link 
      to={`/movie/${movie.id}`} 
      className="flex-shrink-0 w-40 md:w-44 group"
      style={{ animationDelay: `${(index % 12) * 50}ms` }}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#2A2A2A] mb-3">
        <LazyImage
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/70 rounded">
          <Star className="w-3 h-3 text-green-400 fill-green-400" />
          <span className="text-xs text-white font-semibold">{movie.rating}</span>
        </div>
        
        {/* Genre Badge */}
        {movie.genre && movie.genre[0] && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-[#FF0040] text-white text-[10px] font-semibold rounded">
            {movie.genre[0]}
          </span>
        )}

        {/* Book Button on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-full py-2 bg-[#FF0040] text-white rounded-lg font-semibold text-sm">
            Book Now
          </button>
        </div>
      </div>

      <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#FF0040] transition-colors">
        {movie.title}
      </h3>
      <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
        <Clock className="w-3 h-3" />
        <span>{movie.duration} min</span>
        <span className="text-gray-600">•</span>
        <span>{movie.language}</span>
      </div>
    </Link>
  )
})

MovieCard.displayName = 'MovieCard'

export default MovieCard
