import { useState, useMemo } from 'react'
import { X, Plus, Star, Clock, Calendar, Film, Users, Clapperboard, Trophy, TrendingUp } from 'lucide-react'
import { movies } from '../../data/mockData'
import { motion, AnimatePresence } from 'framer-motion'

const MovieComparison = ({ isOpen, onClose }) => {
  const [selectedMovies, setSelectedMovies] = useState([])

  const addMovie = (movie) => {
    if (selectedMovies.length < 3 && !selectedMovies.find(m => m.id === movie.id)) {
      setSelectedMovies([...selectedMovies, movie])
    }
  }

  const removeMovie = (movieId) => {
    setSelectedMovies(selectedMovies.filter(m => m.id !== movieId))
  }

  const comparisonData = useMemo(() => {
    if (selectedMovies.length < 2) return null

    const specs = [
      { key: 'rating', label: 'IMDb Rating', icon: Star, format: (v) => `${v}/10`, higher: true },
      { key: 'duration', label: 'Duration', icon: Clock, format: (v) => `${v} min`, higher: false },
      { key: 'releaseDate', label: 'Release Date', icon: Calendar, format: (v) => new Date(v).toLocaleDateString(), higher: false },
      { key: 'genre', label: 'Genre', icon: Film, format: (v) => v.join(', '), higher: false },
      { key: 'language', label: 'Language', icon: Clapperboard, format: (v) => v, higher: false },
      { key: 'format', label: 'Format', icon: Trophy, format: (v) => v, higher: false },
      { key: 'director', label: 'Director', icon: Users, format: (v) => v, higher: false }
    ]

    return specs.map(spec => ({
      ...spec,
      values: selectedMovies.map(m => ({
        movieId: m.id,
        value: m[spec.key]
      })),
      best: spec.higher 
        ? Math.max(...selectedMovies.map(m => m[spec.key]))
        : null,
      winner: spec.higher 
        ? selectedMovies.find(m => m[spec.key] === Math.max(...selectedMovies.map(m => m[spec.key])))?.id
        : null
    }))
  }, [selectedMovies])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1A1A1A] rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-[#FF0040]" />
                Compare Movies
              </h2>
              <p className="text-gray-400 text-sm mt-1">Select 2-3 movies to compare side by side</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Movie Selection */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex flex-wrap gap-3 mb-4">
              {selectedMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center gap-2 bg-[#FF0040]/20 border border-[#FF0040] rounded-lg px-3 py-2"
                >
                  <img src={movie.poster} alt={movie.title} className="w-8 h-8 rounded object-cover" />
                  <span className="text-white font-medium">{movie.title}</span>
                  <button
                    onClick={() => removeMovie(movie.id)}
                    className="p-1 hover:bg-[#FF0040]/30 rounded"
                  >
                    <X className="w-4 h-4 text-[#FF0040]" />
                  </button>
                </div>
              ))}
              {selectedMovies.length < 3 && (
                <div className="flex items-center gap-2 text-gray-400 px-3 py-2">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">{3 - selectedMovies.length} more</span>
                </div>
              )}
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-48 overflow-y-auto">
              {movies.map((movie) => {
                const isSelected = selectedMovies.find(m => m.id === movie.id)
                return (
                  <button
                    key={movie.id}
                    onClick={() => isSelected ? removeMovie(movie.id) : addMovie(movie)}
                    className={`relative group rounded-lg overflow-hidden transition-all ${
                      isSelected ? 'ring-2 ring-[#FF0040] scale-95' : 'hover:scale-105'
                    }`}
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs font-medium truncate">{movie.title}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-[#FF0040] rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {isSelected ? 'Remove' : 'Add'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Comparison Table */}
          {comparisonData && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-400 font-medium p-3 w-32">Spec</th>
                      {selectedMovies.map((movie) => (
                        <th key={movie.id} className="text-center p-3 min-w-40">
                          <div className="flex flex-col items-center gap-2">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-16 h-24 object-cover rounded-lg"
                            />
                            <span className="text-white font-semibold text-sm">{movie.title}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, idx) => {
                      const Icon = row.icon
                      return (
                        <tr key={idx} className="border-t border-gray-800">
                          <td className="p-3">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Icon className="w-4 h-4" />
                              <span className="text-sm">{row.label}</span>
                            </div>
                          </td>
                          {row.values.map((val, vIdx) => (
                            <td key={vIdx} className="p-3 text-center">
                              <div className={`flex items-center justify-center gap-1 ${
                                row.winner === val.movieId ? 'text-[#FF0040] font-bold' : 'text-white'
                              }`}>
                                <span className="text-sm">{row.format(val.value)}</span>
                                {row.winner === val.movieId && (
                                  <Star className="w-4 h-4 fill-current" />
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                      )
                    })}

                    {/* Cast Comparison */}
                    <tr className="border-t border-gray-800">
                      <td className="p-3">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">Cast</span>
                        </div>
                      </td>
                      {selectedMovies.map((movie) => (
                        <td key={movie.id} className="p-3 text-center">
                          <div className="flex justify-center gap-1">
                            {movie.cast.slice(0, 3).map((actor, idx) => (
                              <div key={idx} className="flex flex-col items-center">
                                <img
                                  src={actor.image}
                                  alt={actor.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="text-xs text-gray-400 mt-1 truncate max-w-16">{actor.name.split(' ')[0]}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {selectedMovies.length < 2 && (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="text-center">
                <Clapperboard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select movies to compare</h3>
                <p className="text-gray-400">Choose 2 or 3 movies from above to see a detailed comparison</p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MovieComparison
