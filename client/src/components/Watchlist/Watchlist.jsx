import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Star, Trash2, AlertCircle, Calendar, Clock, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const priorityConfig = {
  high: { label: 'High', color: '#FF0040', bg: 'bg-red-500/20', border: 'border-red-500' },
  medium: { label: 'Medium', color: '#F59E0B', bg: 'bg-amber-500/20', border: 'border-amber-500' },
  low: { label: 'Low', color: '#22C55E', bg: 'bg-green-500/20', border: 'border-green-500' }
}

const SortableMovie = ({ movie, onPriorityChange, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: movie.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1
  }

  const priority = priorityConfig[movie.priority] || priorityConfig.medium

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`bg-[#2A2A2A] rounded-xl p-4 border ${priority.border} ${isDragging ? 'shadow-2xl shadow-[#FF0040]/20' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-2 p-2 hover:bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </button>

        {/* Poster */}
        <Link to={`/movie/${movie.id}`} className="shrink-0">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-20 h-28 object-cover rounded-lg"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link to={`/movie/${movie.id}`}>
                <h3 className="text-white font-semibold text-lg hover:text-[#FF0040] transition-colors">
                  {movie.title}
                </h3>
              </Link>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {movie.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {movie.duration} min
                </span>
                {movie.releaseDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(movie.releaseDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Priority Badge */}
            <select
              value={movie.priority}
              onChange={(e) => onPriorityChange(movie.id, e.target.value)}
              className="bg-transparent border rounded-lg px-2 py-1 text-sm font-medium cursor-pointer"
              style={{ 
                borderColor: priority.color,
                color: priority.color
              }}
            >
              <option value="high" className="bg-[#1A1A1A]">High</option>
              <option value="medium" className="bg-[#1A1A1A]">Medium</option>
              <option value="low" className="bg-[#1A1A1A]">Low</option>
            </select>
          </div>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {movie.genre?.map((g, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                {g}
              </span>
            ))}
          </div>

          {/* Director */}
          {movie.director && (
            <p className="text-gray-500 text-sm mt-2">
              Dir: {movie.director}
            </p>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(movie.id)}
          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </motion.div>
  )
}

const Watchlist = ({ isOpen, onClose }) => {
  const [watchlist, setWatchlist] = useState([])
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    const saved = localStorage.getItem('watchlist')
    if (saved) {
      setWatchlist(JSON.parse(saved))
    } else {
      // Initialize with some sample data
      const sampleWatchlist = [
        { id: '1', priority: 'high', title: 'Thunderbolts*', poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop', rating: 8.5, duration: 154, genre: ['Action', 'Adventure'], director: 'Jake Schreier', releaseDate: '2026-04-03' },
        { id: '2', priority: 'medium', title: 'Jaat', poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop', rating: 8.2, duration: 142, genre: ['Action', 'Drama'], director: 'Sanjay Leela Bhansali', releaseDate: '2026-04-04' },
        { id: '3', priority: 'low', title: 'KGF: Chapter 3', poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop', rating: 9.2, duration: 168, genre: ['Action', 'Drama'], director: 'Prashanth Neel', releaseDate: '2026-04-10' }
      ]
      setWatchlist(sampleWatchlist)
      localStorage.setItem('watchlist', JSON.stringify(sampleWatchlist))
    }
  }, [isOpen])

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (active.id !== over?.id) {
      setWatchlist((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over?.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        localStorage.setItem('watchlist', JSON.stringify(newItems))
        return newItems
      })
    }
  }

  const handlePriorityChange = (id, newPriority) => {
    const updated = watchlist.map(m => m.id === id ? { ...m, priority: newPriority } : m)
    setWatchlist(updated)
    localStorage.setItem('watchlist', JSON.stringify(updated))
  }

  const handleRemove = (id) => {
    const updated = watchlist.filter(m => m.id !== id)
    setWatchlist(updated)
    localStorage.setItem('watchlist', JSON.stringify(updated))
  }

  const activeMovie = watchlist.find(m => m.id === activeId)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-[#1A1A1A] h-full w-full max-w-md overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-[#FF0040]" />
              <h2 className="text-xl font-bold text-white">My Watchlist</h2>
              <span className="bg-[#FF0040]/20 text-[#FF0040] px-2 py-0.5 rounded-full text-sm font-medium">
                {watchlist.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Priority Legend */}
          <div className="px-6 py-3 border-b border-gray-800 bg-gray-900/50">
            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-400">Priority:</span>
              {Object.entries(priorityConfig).map(([key, config]) => (
                <span key={key} className={`flex items-center gap-1 ${config.color}`}>
                  <span className={`w-2 h-2 rounded-full ${config.bg}`} style={{ backgroundColor: config.color }} />
                  {config.label}
                </span>
              ))}
            </div>
          </div>

          {/* Drag Instruction */}
          <div className="px-6 py-2 bg-[#FF0040]/10 border-b border-gray-800">
            <p className="text-xs text-[#FF0040] flex items-center gap-2">
              <GripVertical className="w-3 h-3" />
              Drag items to reorder your watchlist
            </p>
          </div>

          {/* Watchlist Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {watchlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertCircle className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Your watchlist is empty</h3>
                <p className="text-gray-400 text-sm">Add movies from the browse page to get started</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={watchlist.map(m => m.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {watchlist.map((movie) => (
                      <SortableMovie
                        key={movie.id}
                        movie={movie}
                        onPriorityChange={handlePriorityChange}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeMovie && (
                    <div className="bg-[#2A2A2A] rounded-xl p-4 border-2 border-[#FF0040] shadow-2xl">
                      <div className="flex items-start gap-4">
                        <img
                          src={activeMovie.poster}
                          alt={activeMovie.title}
                          className="w-20 h-28 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="text-white font-semibold">{activeMovie.title}</h3>
                          <p className="text-gray-400 text-sm">{activeMovie.director}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Watchlist
