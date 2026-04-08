import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'

const Payment = () => {
  const navigate = useNavigate()
  const { bookingData, calculateTotal, clearSelection } = useBooking()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null) // null, 'success', 'error'
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })

  const { movie, show, seats } = bookingData
  const subtotal = calculateTotal()
  const convenienceFee = Math.round(subtotal * 0.05)
  const total = subtotal + convenienceFee

  const handlePayment = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentStatus('success')
    }, 2000)
  }

  const handleSuccess = () => {
    // Save booking to localStorage (in real app, would be API)
    const booking = {
      id: `BMS${Date.now()}`,
      movie,
      show,
      seats,
      total,
      date: new Date().toISOString()
    }
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    bookings.push(booking)
    localStorage.setItem('bookings', JSON.stringify(bookings))
    
    clearSelection()
    navigate('/success')
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
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to="/checkout"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>← Back to Checkout</span>
          </Link>
        </div>

        {/* Payment Form */}
        {paymentStatus !== 'success' ? (
          <div className="bg-[#2A2A2A] rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Payment Details</h2>
            
            {/* Order Summary */}
            <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Movie</span>
                <span className="text-white font-medium">{movie.title}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Seats</span>
                <span className="text-white">{seats.length}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-[#F84565] font-bold text-xl">₹{total}</span>
              </div>
            </div>

            {/* Card Form */}
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    maxLength={19}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F84565]"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Name on card"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F84565]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    maxLength={5}
                    required
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F84565]"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    maxLength={4}
                    required
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F84565]"
                  />
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 pt-4 text-gray-500 text-sm">
                <Lock className="w-4 h-4" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-[#F84565] text-white rounded-lg font-semibold hover:bg-[#d63a54] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay ₹{total}</>
                )}
              </button>
            </form>
          </div>
        ) : (
          // Success State
          <div className="bg-[#2A2A2A] rounded-xl p-8 border border-gray-700 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-400 mb-6">Your tickets have been booked successfully</p>
            
            <button
              onClick={handleSuccess}
              className="w-full py-4 bg-[#F84565] text-white rounded-lg font-semibold hover:bg-[#d63a54] transition-colors"
            >
              View Tickets
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payment
