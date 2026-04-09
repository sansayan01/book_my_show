import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Download, Share2, Home, Calendar, Ticket, MapPin } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

const Confirmation = () => {
  const [searchParams] = useSearchParams()
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    // Get latest booking from localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    if (bookings.length > 0) {
      setBooking(bookings[bookings.length - 1])
    }
  }, [])

  if (!booking) {
    return (
      <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No booking found</h2>
          <Link to="/movies" className="text-[#F84565]">Browse Movies</Link>
        </div>
      </div>
    )
  }

  const { movie, show, seats, total } = booking

  return (
    <div className="bg-[#1A1A1A] min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400">Your tickets have been sent to your email</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-[#2A2A2A] rounded-2xl overflow-hidden border border-gray-700 mb-6">
          {/* Header */}
          <div className="bg-[#F84565] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-6 h-6 text-white" />
                <span className="text-white font-bold">BookMyShow</span>
              </div>
              <span className="text-white/80 text-sm">#{booking.id}</span>
            </div>
          </div>

          {/* Movie Details */}
          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <img 
                src={movie.poster} 
                alt={movie.title}
                className="w-24 h-36 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-xl font-bold text-white">{movie.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{movie.language} • {movie.format}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {seats.map((seat, i) => (
                    <span key={i} className="px-3 py-1 bg-[#1A1A1A] text-white text-sm rounded-lg">
                      {seat.row}{seat.number}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Show Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-xs">Date & Time</p>
                  <p className="text-white font-medium">
                    {show.date ? new Date(show.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''} • {show.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-xs">Venue</p>
                  <p className="text-white font-medium">{show.theatre}</p>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
              <span className="text-gray-400">Total Paid</span>
              <span className="text-[#F84565] font-bold text-xl">₹{total}</span>
            </div>
          </div>

          {/* Dotted Line */}
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-[#1A1A1A] rounded-full" />
            <div className="border-t-2 border-dashed border-gray-700" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-[#1A1A1A] rounded-full" />
          </div>

          {/* QR Code Placeholder */}
          <div className="p-6 text-center">
            <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center p-2">
              <QRCodeSVG 
                value={`BMS${booking.id}`} 
                size={112}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-gray-400 text-xs">Show this QR code at the cinema entrance</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#F84565] text-white rounded-lg font-semibold hover:bg-[#d63a54] transition-colors">
            <Download className="w-5 h-5" />
            Download Ticket
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2A2A2A] text-white rounded-lg font-semibold hover:bg-gray-700 border border-gray-700 transition-colors">
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>

        {/* Home Link */}
        <div className="text-center mt-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Confirmation
