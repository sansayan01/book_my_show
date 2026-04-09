import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, CreditCard, Smartphone, Ticket, MapPin, Clock, User, Mail, Phone, Lock, Check, Shield, Wallet, AlertCircle } from 'lucide-react'

const Checkout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { movie, cinema, date, time, seats } = location.state || {}

  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [addInsurance, setAddInsurance] = useState(false)
  const [promoError, setPromoError] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [formErrors, setFormErrors] = useState({})

  // Validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone) => {
    const re = /^[6-9]\d{9}$/
    return re.test(phone.replace(/\D/g, ''))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!movie || !cinema || !seats?.length) {
    return (
      <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-xl mb-4">No booking details found</h2>
          <Link to="/" className="text-[#FF0040] hover:underline">Go to Home</Link>
        </div>
      </div>
    )
  }

  const basePrice = cinema.price * seats.length
  const convenienceFee = Math.round(basePrice * 0.04)
  const GST = Math.round((basePrice + convenienceFee) * 0.18)
  const insuranceFee = addInsurance ? 25 : 0
  const total = basePrice + convenienceFee + GST - couponDiscount + insuranceFee

  const applyPromo = () => {
    setPromoError('')
    if (promoCode.toUpperCase() === 'BMS20') {
      setAppliedPromo('BMS20')
      setCouponDiscount(Math.round(basePrice * 0.2))
    } else if (promoCode.toUpperCase() === 'FIRST50') {
      setAppliedPromo('FIRST50')
      setCouponDiscount(Math.round(basePrice * 0.5))
    } else {
      setPromoError('Invalid promo code. Try BMS20 or FIRST50')
    }
  }

  const removePromo = () => {
    setAppliedPromo(null)
    setCouponDiscount(0)
    setPromoCode('')
    setPromoError('')
  }

  const handlePayment = () => {
    // Simulate payment
    setStep(3)
  }

  const steps = [
    { num: 1, title: 'Booking Details' },
    { num: 2, title: 'Payment' },
    { num: 3, title: 'Confirmation' },
  ]

  return (
    <div className="bg-[#1A1A1A] min-h-screen pb-8">
      {/* Header */}
      <div className="bg-[#1F1F1F] border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/movies" className="text-gray-400 hover:text-white">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold text-white">Book Tickets</h1>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-[#1F1F1F] border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${step >= s.num ? 'text-white' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step > s.num ? 'bg-green-500' : step === s.num ? 'bg-[#FF0040]' : 'bg-gray-700'
                  } ${step >= s.num ? 'text-white' : 'text-gray-400'}`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className="font-medium hidden sm:block">{s.title}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ${step > s.num ? 'bg-green-500' : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-[#1F1F1F] rounded-xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#FF0040]" />
                    Contact Details
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`w-full px-4 py-3 bg-[#2A2A2A] border rounded-lg text-white placeholder-gray-500 focus:outline-none ${
                            formErrors.name ? 'border-red-500' : 'border-gray-700 focus:border-[#FF0040]'
                          }`}
                        />
                        {formErrors.name && (
                          <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-500 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {formErrors.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full px-4 py-3 bg-[#2A2A2A] border rounded-lg text-white placeholder-gray-500 focus:outline-none ${
                            formErrors.email ? 'border-red-500' : 'border-gray-700 focus:border-[#FF0040]'
                          }`}
                        />
                        {formErrors.email && (
                          <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-500 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {formErrors.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-gray-400 text-sm mb-2 block">Phone Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full px-4 py-3 bg-[#2A2A2A] border rounded-lg text-white placeholder-gray-500 focus:outline-none ${
                            formErrors.phone ? 'border-red-500' : 'border-gray-700 focus:border-[#FF0040]'
                          }`}
                        />
                        {formErrors.phone && (
                          <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-500 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {formErrors.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insurance Add-on */}
                <div className="bg-[#1F1F1F] rounded-xl p-6">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={addInsurance}
                      onChange={(e) => setAddInsurance(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-600 bg-[#2A2A2A] text-[#FF0040] focus:ring-[#FF0040] focus:ring-offset-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-[#FF0040]" />
                          <span className="text-white font-medium group-hover:text-[#FF0040] transition-colors">
                            Ticket Protection
                          </span>
                        </div>
                        <span className="text-[#FF0040] font-medium">₹25</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        Get refund on booked tickets in case of medical emergency or cancellation. 
                        100% money-back guarantee.
                      </p>
                      <ul className="mt-3 space-y-1">
                        <li className="text-gray-500 text-xs flex items-center gap-2">
                          <Check className="w-3 h-3 text-green-500" /> Instant refund
                        </li>
                        <li className="text-gray-500 text-xs flex items-center gap-2">
                          <Check className="w-3 h-3 text-green-500" /> Covers all ticket types
                        </li>
                        <li className="text-gray-500 text-xs flex items-center gap-2">
                          <Check className="w-3 h-3 text-green-500" /> No questions asked
                        </li>
                      </ul>
                    </div>
                  </label>
                </div>

                {/* Payment Method */}
                <div className="bg-[#1F1F1F] rounded-xl p-6">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#FF0040]" />
                    Payment Method
                  </h2>
                  
                  <div className="grid sm:grid-cols-4 gap-4">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        paymentMethod === 'card' ? 'border-[#FF0040] bg-[#FF0040]/10' : 'border-gray-700 bg-[#2A2A2A]'
                      }`}
                    >
                      <CreditCard className={`w-8 h-8 mx-auto mb-2 ${paymentMethod === 'card' ? 'text-[#FF0040]' : 'text-gray-400'}`} />
                      <p className={`font-medium ${paymentMethod === 'card' ? 'text-white' : 'text-gray-400'}`}>Card</p>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        paymentMethod === 'upi' ? 'border-[#FF0040] bg-[#FF0040]/10' : 'border-gray-700 bg-[#2A2A2A]'
                      }`}
                    >
                      <Smartphone className={`w-8 h-8 mx-auto mb-2 ${paymentMethod === 'upi' ? 'text-[#FF0040]' : 'text-gray-400'}`} />
                      <p className={`font-medium ${paymentMethod === 'upi' ? 'text-white' : 'text-gray-400'}`}>UPI</p>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        paymentMethod === 'netbanking' ? 'border-[#FF0040] bg-[#FF0040]/10' : 'border-gray-700 bg-[#2A2A2A]'
                      }`}
                    >
                      <Wallet className={`w-8 h-8 mx-auto mb-2 ${paymentMethod === 'netbanking' ? 'text-[#FF0040]' : 'text-gray-400'}`} />
                      <p className={`font-medium ${paymentMethod === 'netbanking' ? 'text-white' : 'text-gray-400'}`}>Net Banking</p>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        paymentMethod === 'wallet' ? 'border-[#FF0040] bg-[#FF0040]/10' : 'border-gray-700 bg-[#2A2A2A]'
                      }`}
                    >
                      <Wallet className={`w-8 h-8 mx-auto mb-2 ${paymentMethod === 'wallet' ? 'text-[#FF0040]' : 'text-gray-400'}`} />
                      <p className={`font-medium ${paymentMethod === 'wallet' ? 'text-white' : 'text-gray-400'}`}>Wallet</p>
                    </button>
                  </div>

                  {/* Card Details */}
                  {paymentMethod === 'card' && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-400 text-sm mb-2 block">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 text-sm mb-2 block">CVV</label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength="3"
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="Name on card"
                          className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="mt-6">
                      <label className="text-gray-400 text-sm mb-2 block">UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                      />
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="mt-6">
                      <label className="text-gray-400 text-sm mb-2 block">Select Bank</label>
                      <select className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FF0040]">
                        <option value="">Select your bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra</option>
                        <option value="yes">Yes Bank</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-3 text-gray-400 text-sm bg-[#1F1F1F] p-4 rounded-xl">
                  <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p>Your payment information is encrypted with 256-bit SSL security. We never store your card details.</p>
                </div>

                <button
                  onClick={() => {
                    if (validateForm()) {
                      setStep(2)
                    }
                  }}
                  className="w-full py-4 bg-[#FF0040] text-white rounded-xl font-bold text-lg hover:bg-[#CC0033] transition-colors"
                >
                  Pay ₹{total}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-[#1F1F1F] rounded-xl p-8 text-center">
                <div className="w-20 h-20 bg-[#FF0040] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Processing Payment</h2>
                <p className="text-gray-400 mb-6">Please wait while we process your payment...</p>
                <div className="flex justify-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-[#FF0040] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 bg-[#FF0040] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-3 h-3 bg-[#FF0040] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-gray-500 text-sm">Do not refresh or go back</p>
              </div>
            )}

            {step === 3 && (
              <div className="bg-[#1F1F1F] rounded-xl p-8 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                <p className="text-gray-400 mb-6">Your tickets have been booked successfully</p>
                
                <div className="bg-[#2A2A2A] rounded-xl p-6 text-left max-w-md mx-auto mb-6">
                  <h3 className="text-[#FF0040] font-bold mb-4">Booking Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Booking ID</span>
                      <span className="text-white font-mono">BMS{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Movie</span>
                      <span className="text-white">{movie.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cinema</span>
                      <span className="text-white">{cinema.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seats</span>
                      <span className="text-white">{seats.sort().join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Paid</span>
                      <span className="text-[#FF0040] font-bold">₹{total}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 max-w-md mx-auto">
                  <button className="flex-1 py-3 bg-[#FF0040] text-white rounded-lg font-semibold hover:bg-[#CC0033] transition-colors">
                    Download Ticket
                  </button>
                  <Link to="/" className="flex-1 py-3 bg-[#2A2A2A] text-white rounded-lg font-semibold hover:bg-[#3A3A3A] transition-colors text-center">
                    Go Home
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1F1F1F] rounded-xl p-6 sticky top-4">
              <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
              
              {/* Movie Info */}
              <div className="flex gap-4 pb-4 border-b border-gray-800">
                <img src={movie.poster} alt={movie.title} className="w-20 h-28 object-cover rounded-lg" />
                <div>
                  <h3 className="text-white font-semibold">{movie.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{cinema.name}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                    <Calendar className="w-4 h-4" />
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <Ticket className="w-4 h-4" />
                    <span>{seats.sort().join(', ')} ({seats.length} seats)</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="py-4 space-y-3 border-b border-gray-800">
                <div className="flex justify-between text-gray-400">
                  <span>Ticket Price</span>
                  <span>₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Convenience Fee</span>
                  <span>₹{convenienceFee}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>GST (18%)</span>
                  <span>₹{GST}</span>
                </div>
                {addInsurance && (
                  <div className="flex justify-between text-gray-400">
                    <span>Ticket Protection</span>
                    <span>₹{insuranceFee}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span className="flex items-center gap-1">
                      Promo: {appliedPromo}
                      <button onClick={removePromo} className="text-xs hover:text-white">(×)</button>
                    </span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                {promoError && (
                  <p className="text-red-500 text-xs mt-2">{promoError}</p>
                )}
              </div>

              <div className="flex justify-between text-white font-bold text-xl pt-4">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              {/* Promo Code */}
              {step === 1 && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <label className="text-gray-400 text-sm mb-2 block">Have a promo code?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                    />
                    <button
                      onClick={applyPromo}
                      className="px-4 py-2 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#CC0033] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">Try: BMS20 or FIRST50</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
