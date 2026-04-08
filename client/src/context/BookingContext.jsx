import { createContext, useContext, useState, useEffect } from 'react'

const BookingContext = createContext()

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider')
  }
  return context
}

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedShow, setSelectedShow] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [bookingData, setBookingData] = useState({
    movie: null,
    show: null,
    seats: [],
    totalAmount: 0
  })

  const selectMovie = (movie) => {
    setSelectedMovie(movie)
  }

  const selectShow = (show) => {
    setSelectedShow(show)
  }

  const toggleSeat = (seat) => {
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.row === seat.row && s.number === seat.number)
      if (exists) {
        return prev.filter(s => s.row !== seat.row || s.number !== seat.number)
      }
      return [...prev, seat]
    })
  }

  const clearSelection = () => {
    setSelectedMovie(null)
    setSelectedShow(null)
    setSelectedSeats([])
  }

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + (seat.price || 0), 0)
  }

  useEffect(() => {
    setBookingData({
      movie: selectedMovie,
      show: selectedShow,
      seats: selectedSeats,
      totalAmount: calculateTotal()
    })
  }, [selectedMovie, selectedShow, selectedSeats])

  return (
    <BookingContext.Provider value={{
      selectedMovie,
      selectedShow,
      selectedSeats,
      bookingData,
      selectMovie,
      selectShow,
      toggleSeat,
      clearSelection,
      calculateTotal
    }}>
      {children}
    </BookingContext.Provider>
  )
}
