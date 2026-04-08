import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Tv, Info } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'

const SeatSelection = () => {
  const { showId } = useParams()
  const navigate = useNavigate()
  const { selectedMovie, selectedShow, selectedSeats, toggleSeat, calculateTotal } = useBooking()
  const [seatCategories, setSeatCategories] = useState({
    vip: { price: 450, label: 'VIP', color: '#F59E0B' },
    premium: { price: 350, label: 'Premium', color: '#10B981' },
    standard: { price: 250, label: 'Standard', color: '#6B7280' }
  })

  // Generate seats
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const seatsPerRow = 14

  const [seats, setSeats] = useState({})

  useEffect(() => {
    // Initialize seats
    const initialSeats = {}
    rows.forEach(row => {
      initialSeats[row] = []
      for (let i = 1; i <= seatsPerRow; i++) {
        let category = 'standard'
        if (row <= 'B') category = 'vip'
        else if (row <= 'D') category = 'premium'
        
        initialSeats[row].push({
          row,
          number: i,
          category,
          price: seatCategories[category].price,
          available: Math.random() > 0.3, // 70% available
          selected: false
        })
      }
    })
    setSeats(initialSeats)
  }, [])

  const handleSeatClick = (row, seat) => {
    if (!seat.available) return
    
    const updatedSeats = { ...seats }
    updatedSeats[row] = updatedSeats[row].map(s => {
      if (s.number === seat.number) {
        return { ...s, selected: !s.selected }
      }
      return s
    })
    setSeats(updatedSeats)
    
    // Update booking context
    toggleSeat({
      row: seat.row,
      number: seat.number,
      category: seat.category,
      price: seat.price
    })
  }

  const handleProceed = () => {
    if (selectedSeats.length === 0) return
    navigate('/checkout')
  }

  const total = calculateTotal()
  const totalSeats = selectedSeats.length

  if (!selectedMovie || !selectedShow) {
    return (
      <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No show selected</h2>
          <Link to="/movies" className="text-[#F84565]">Browse Movies</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to={`/movie/${selectedMovie.id}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Change Movie</span>
          </Link>
        </div>

        {/* Show Info */}
        <div className="bg-[#2A2A2A] rounded-xl p-4 mb-6 border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">{selectedMovie.title}</h2>
              <p className="text-gray-400 mt-1">
                {selectedShow.theatre} • {selectedShow.date?.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} • {selectedShow.time}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded-lg">
              <Info className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">{selectedSeats.length} seats selected</span>
            </div>
          </div>
        </div>

        {/* Screen */}
        <div className="mb-8">
          <div className="relative h-2 bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-2">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-500 text-sm">
              <Tv className="w-4 h-4" />
              <span>SCREEN</span>
            </div>
          </div>
        </div>

        {/* Seat Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {Object.entries(seatCategories).map(([key, cat]) => (
            <div key={key} className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-gray-400 text-sm">₹{cat.price} {cat.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gray-700 border border-gray-600" />
            <span className="text-gray-400 text-sm">Sold</span>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[600px]">
            {Object.entries(seats).map(([row, rowSeats]) => (
              <div key={row} className="flex items-center justify-center gap-1 mb-2">
                <span className="w-6 text-gray-500 text-sm font-medium">{row}</span>
                {rowSeats.map((seat) => {
                  const isSelected = selectedSeats.some(
                    s => s.row === seat.row && s.number === seat.number
                  )
                  
                  return (
                    <button
                      key={seat.number}
                      onClick={() => handleSeatClick(row, seat)}
                      disabled={!seat.available}
                      className={`w-8 h-8 rounded-t-lg text-xs font-medium transition-all ${
                        !seat.available 
                          ? 'bg-gray-800 border border-gray-700 text-gray-600 cursor-not-allowed'
                          : isSelected
                            ? 'bg-[#F84565] text-white'
                            : seat.category === 'vip'
                              ? 'bg-[#F59E0B] text-black hover:bg-yellow-400'
                              : seat.category === 'premium'
                                ? 'bg-[#10B981] text-white hover:bg-green-400'
                                : 'bg-gray-600 text-white hover:bg-gray-500'
                      }`}
                    >
                      {seat.number}
                    </button>
                  )
                })}
                <span className="w-6 text-gray-500 text-sm font-medium">{row}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Seats Summary */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#1F1F1F] border-t border-gray-800 p-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-gray-400 text-sm">
                {totalSeats > 0 
                  ? `${selectedSeats.map(s => `${s.row}${s.number}`).join(', ')}`
                  : 'Select seats to continue'}
              </p>
              <p className="text-white font-bold text-xl">
                ₹{total}
              </p>
            </div>
            <button
              onClick={handleProceed}
              disabled={totalSeats === 0}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                totalSeats > 0
                  ? 'bg-[#F84565] text-white hover:bg-[#d63a54]'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

        {/* Spacer for fixed bottom */}
        <div className="h-24" />
      </div>
    </div>
  )
}

export default SeatSelection
