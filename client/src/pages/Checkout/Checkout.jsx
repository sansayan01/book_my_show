import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Ticket, CreditCard, Tag, ShieldCheck } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { useAuth } from '../../context/AuthContext'

const Checkout = () => {
  const navigate = useNavigate()
  const { bookingData, calculateTotal } = useBooking()
  const { user, openAuthModal } = useAuth()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)

  const { movie, show, seats } = bookingData
  const subtotal = calculateTotal()
  const convenienceFee = Math.round(subtotal * 0.05) // 5% convenience fee
  const total = subtotal + convenienceFee - promoDiscount

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'bms50') {
      setPromoApplied(true)
      setPromoDiscount(Math.round(subtotal * 0.5))
    }
  }

  const handlePayment = () => {
    if (!user) {
      openAuthModal('login')
      return
    }
    navigate('/payment')
  }

  if (!movie || !show || seats.length === 0) {
    return (
      <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No booking in progress</h2>
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
            to={`/book/${show.id}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Change Seats</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-4">
            {/* Movie Info */}
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-gray-700">
              <h2 className="text-white font-semibold mb-3">Booking Summary</h2>
              <div className="flex gap-4">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-24 h-36 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-white font-bold text-lg">{movie.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{movie.language} • {movie.format}</p>
                  <p className="text-gray-400 text-sm mt-1">{show.theatre}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {show.date?.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • {show.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Seats */}
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-gray-700">
              <h2 className="text-white font-semibold mb-3">Selected Seats</h2>
              <div className="flex flex-wrap gap-2">
                {seats.map((seat, i) => (
                  <div 
                    key={i}
                    className="px-3 py-2 bg-[#1A1A1A] rounded-lg"
                  >
                    <span className="text-white font-medium">{seat.row}{seat.number}</span>
                    <span className="text-gray-400 text-sm ml-2">₹{seat.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-gray-700">
              <h2 className="text-white font-semibold mb-3">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-lg cursor-pointer border border-[#F84565]">
                  <input type="radio" name="payment" defaultChecked className="accent-[#F84565]" />
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="text-white">Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-lg cursor-pointer border border-gray-700 hover:border-gray-600">
                  <input type="radio" name="payment" className="accent-[#F84565]" />
                  <div className="w-5 h-5 bg-[#00D09C] rounded flex items-center justify-center text-white text-xs font-bold">U</div>
                  <span className="text-white">UPI</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-lg cursor-pointer border border-gray-700 hover:border-gray-600">
                  <input type="radio" name="payment" className="accent-[#F84565]" />
                  <div className="w-5 h-5 bg-[#FF9933] rounded flex items-center justify-center text-white text-xs font-bold">₹</div>
                  <span className="text-white">Net Banking</span>
                </label>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-gray-700">
              <h2 className="text-white font-semibold mb-3">Promo Code</h2>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F84565] disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode}
                  className="px-6 py-3 bg-[#F84565] text-white rounded-lg font-medium hover:bg-[#d63a54] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {promoApplied ? 'Applied!' : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <p className="text-green-500 text-sm mt-2">Promo code applied! You saved ₹{promoDiscount}</p>
              )}
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#2A2A2A] rounded-xl p-4 border border-gray-700 sticky top-24">
              <h2 className="text-white font-semibold mb-4">Price Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ticket Price</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Convenience Fee</span>
                  <span className="text-white">₹{convenienceFee}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between">
                    <span className="text-green-500">Discount</span>
                    <span className="text-green-500">-₹{promoDiscount}</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-white font-semibold">Total Payable</span>
                  <span className="text-white font-bold text-lg">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full mt-6 px-6 py-3 bg-[#F84565] text-white rounded-lg font-semibold hover:bg-[#d63a54] transition-colors"
              >
                Proceed to Payment
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure payment via Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
