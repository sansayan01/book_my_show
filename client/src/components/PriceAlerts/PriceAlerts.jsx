import { useState, useEffect } from 'react'
import { Bell, BellOff, TrendingDown, X, Check, AlertCircle, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { movies } from '../../data/mockData'

const PriceAlerts = ({ isOpen, onClose }) => {
  const [alerts, setAlerts] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [targetPrice, setTargetPrice] = useState('')
  const [currentPrice, setCurrentPrice] = useState(250)

  useEffect(() => {
    const savedAlerts = JSON.parse(localStorage.getItem('price_alerts') || '[]')
    setAlerts(savedAlerts)
  }, [isOpen])

  const createAlert = () => {
    if (!selectedMovie || !targetPrice) return

    const newAlert = {
      id: Date.now().toString(),
      movieId: selectedMovie.id,
      movieTitle: selectedMovie.title,
      moviePoster: selectedMovie.poster,
      currentPrice: currentPrice,
      targetPrice: parseInt(targetPrice),
      createdAt: new Date().toISOString()
    }

    const updatedAlerts = [...alerts, newAlert]
    setAlerts(updatedAlerts)
    localStorage.setItem('price_alerts', JSON.stringify(updatedAlerts))
    
    setShowCreateModal(false)
    setSelectedMovie(null)
    setTargetPrice('')
  }

  const deleteAlert = (alertId) => {
    const updatedAlerts = alerts.filter(a => a.id !== alertId)
    setAlerts(updatedAlerts)
    localStorage.setItem('price_alerts', JSON.stringify(updatedAlerts))
  }

  const toggleAlert = (alertId) => {
    const updatedAlerts = alerts.map(a => 
      a.id === alertId ? { ...a, active: !a.active } : a
    )
    setAlerts(updatedAlerts)
    localStorage.setItem('price_alerts', JSON.stringify(updatedAlerts))
  }

  const getPriceDropPercent = (alert) => {
    return Math.round(((alert.currentPrice - alert.targetPrice) / alert.currentPrice) * 100)
  }

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
          className="bg-[#1A1A1A] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-[#FF0040]" />
              <h2 className="text-2xl font-bold text-white">Price Alerts</h2>
              <span className="bg-[#FF0040]/20 text-[#FF0040] px-2 py-0.5 rounded-full text-sm font-medium">
                {alerts.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF0040] text-white rounded-lg hover:bg-[#E6003A] transition-colors"
              >
                <Bell className="w-4 h-4" />
                Set Alert
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="flex-1 overflow-y-auto p-6">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <BellOff className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No price alerts set</h3>
                <p className="text-gray-400 text-sm mb-4">Get notified when prices drop for your favorite movies</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-[#FF0040] text-white rounded-lg hover:bg-[#E6003A] transition-colors"
                >
                  Create Your First Alert
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map(alert => {
                  const dropPercent = getPriceDropPercent(alert)
                  return (
                    <motion.div
                      key={alert.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`bg-[#2A2A2A] rounded-xl p-4 border ${alert.active ? 'border-green-500/30' : 'border-gray-700'}`}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={alert.moviePoster}
                          alt={alert.movieTitle}
                          className="w-16 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-semibold">{alert.movieTitle}</h4>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="text-gray-400">
                                  Current: <span className="text-white font-medium">₹{alert.currentPrice}</span>
                                </span>
                                <span className="text-gray-400">
                                  Target: <span className="text-green-500 font-medium">₹{alert.targetPrice}</span>
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleAlert(alert.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  alert.active 
                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                }`}
                              >
                                {alert.active ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                              </button>
                              <button
                                onClick={() => deleteAlert(alert.id)}
                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Price Drop Progress */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                              <span>Alert when price drops {dropPercent}%</span>
                              <span className="text-green-500">{alert.active ? 'Active' : 'Paused'}</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, 100 - dropPercent)}%` }}
                                className="h-full bg-gradient-to-r from-[#FF0040] to-green-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Create Alert Modal */}
          {showCreateModal && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#2A2A2A] rounded-xl w-full max-w-md p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Set Price Alert</h3>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-700 rounded-lg">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Movie Selection */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Select Movie</label>
                  <select
                    value={selectedMovie?.id || ''}
                    onChange={(e) => {
                      const movie = movies.find(m => m.id === e.target.value)
                      setSelectedMovie(movie)
                    }}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="">Choose a movie...</option>
                    {movies.map(movie => (
                      <option key={movie.id} value={movie.id}>{movie.title}</option>
                    ))}
                  </select>
                </div>

                {/* Target Price */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">Target Price (₹)</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="Enter target price"
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />
                </div>

                <button
                  onClick={createAlert}
                  disabled={!selectedMovie || !targetPrice}
                  className="w-full py-3 bg-[#FF0040] text-white rounded-lg hover:bg-[#E6003A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Create Alert
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PriceAlerts
