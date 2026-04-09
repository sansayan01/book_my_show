import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Download, Calendar as CalendarIcon, X, Clock, MapPin, Ticket } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const BookingCalendar = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]')
    
    // Add some sample bookings if none exist
    if (savedBookings.length === 0) {
      const today = new Date()
      const sampleBookings = [
        {
          id: '1',
          movieTitle: 'Thunderbolts*',
          moviePoster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
          date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          time: '7:30 PM',
          venue: 'PVR Logix, Noida',
          seats: ['A5', 'A6'],
          bookingId: 'BMS123456'
        },
        {
          id: '2',
          movieTitle: 'Jaat',
          moviePoster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop',
          date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          time: '2:00 PM',
          venue: 'INOX, Sector 18',
          seats: ['C10', 'C11', 'C12'],
          bookingId: 'BMS789012'
        },
        {
          id: '3',
          movieTitle: 'KGF: Chapter 3',
          moviePoster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop',
          date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          time: '9:00 PM',
          venue: 'Cinepolis, Mall of India',
          seats: ['F1', 'F2'],
          bookingId: 'BMS345678'
        }
      ]
      setBookings(sampleBookings)
      localStorage.setItem('user_bookings', JSON.stringify(sampleBookings))
    } else {
      setBookings(savedBookings)
    }
  }, [isOpen])

  const { days, startDay, totalDays } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDayOfWeek = firstDay.getDay()
    const total = lastDay.getDate()
    return {
      days: Array.from({ length: total }, (_, i) => i + 1),
      startDay: startDayOfWeek,
      totalDays: total
    }
  }, [currentDate])

  const bookingDates = useMemo(() => {
    return bookings.map(b => new Date(b.date).toDateString())
  }, [bookings])

  const getBookingsForDate = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return bookings.filter(b => new Date(b.date).toDateString() === date.toDateString())
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const exportToICS = () => {
    const events = bookings.map(booking => {
      const date = new Date(booking.date)
      const [hours, minutes] = booking.time.replace(' PM', '').replace(' AM', '').split(':')
      let hour = parseInt(hours)
      if (booking.time.includes('PM') && hour !== 12) hour += 12
      if (booking.time.includes('AM') && hour === 12) hour = 0
      
      const startDate = new Date(date)
      startDate.setHours(hour, parseInt(minutes), 0)
      
      const endDate = new Date(startDate)
      endDate.setHours(hour + 3)

      const formatDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      
      return `BEGIN:VEVENT
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${booking.movieTitle} - BookMyShow
DESCRIPTION:Booking ID: ${booking.bookingId}\\nVenue: ${booking.venue}\\nSeats: ${booking.seats.join(', ')}
LOCATION:${booking.venue}
END:VEVENT`
    }).join('\n')

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BookMyShow//EN
${events}
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bookmyshow-bookings.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

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
          className="bg-[#1A1A1A] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-[#FF0040]" />
              <h2 className="text-2xl font-bold text-white">Booking Calendar</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportToICS}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF0040] text-white rounded-lg hover:bg-[#E6003A] transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Calendar */}
            <div className="flex-1 p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <h3 className="text-lg font-semibold text-white">{monthName}</h3>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-gray-500 text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before start */}
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                
                {/* Days */}
                {days.map(day => {
                  const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
                  const hasBooking = bookingDates.includes(dateStr)
                  const dayBookings = getBookingsForDate(day)
                  const isSelected = selectedDate === day

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(isSelected ? null : day)}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${
                        isSelected 
                          ? 'bg-[#FF0040] text-white' 
                          : hasBooking 
                            ? 'bg-[#FF0040]/20 text-white hover:bg-[#FF0040]/30' 
                            : 'hover:bg-gray-800 text-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{day}</span>
                      {hasBooking && (
                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#FF0040]'}`} />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#FF0040]/20" />
                  Booking scheduled
                </span>
              </div>
            </div>

            {/* Selected Day Bookings */}
            <div className="w-80 border-l border-gray-800 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">
                {selectedDate 
                  ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
                  : 'Upcoming Bookings'
                }
              </h3>

              <div className="space-y-4">
                {(selectedDate ? getBookingsForDate(selectedDate) : bookings.slice(0, 5)).map(booking => (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#2A2A2A] rounded-lg p-4"
                  >
                    <div className="flex gap-3">
                      <img
                        src={booking.moviePoster}
                        alt={booking.movieTitle}
                        className="w-16 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{booking.movieTitle}</h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-400">
                          <p className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {booking.venue}
                          </p>
                          <p className="flex items-center gap-2">
                            <Ticket className="w-4 h-4" />
                            {booking.seats.join(', ')}
                          </p>
                        </div>
                        <p className="mt-2 text-xs text-[#FF0040]">
                          ID: {booking.bookingId}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {(selectedDate ? getBookingsForDate(selectedDate) : bookings.slice(0, 5)).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No bookings for this day</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BookingCalendar
