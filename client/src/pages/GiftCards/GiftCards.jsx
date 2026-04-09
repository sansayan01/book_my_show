import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Gift, CreditCard, Smartphone, Mail, Users, Shield,
  Check, Star, Heart, Sparkles, ArrowRight, QrCode,
  Download, Share2, Plus, Minus, HeartHandshake
} from 'lucide-react'

const GiftCards = () => {
  const [selectedAmount, setSelectedAmount] = useState(500)
  const [customAmount, setCustomAmount] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [receiverEmail, setReceiverEmail] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState(1)
  const [selectedDesign, setSelectedDesign] = useState(0)

  const presetAmounts = [300, 500, 1000, 1500, 2000, 5000]
  
  const designs = [
    { id: 0, gradient: 'from-[#FF0040] to-[#FF3366]', pattern: 'stars' },
    { id: 1, gradient: 'from-purple-600 to-pink-600', pattern: 'hearts' },
    { id: 2, gradient: 'from-blue-600 to-cyan-600', pattern: 'waves' },
    { id: 3, gradient: 'from-green-600 to-emerald-600', pattern: 'leaves' },
  ]

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmount = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    setCustomAmount(value)
    if (value) setSelectedAmount(parseInt(value))
  }

  const totalAmount = (customAmount ? parseInt(customAmount) : selectedAmount) * quantity

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF0040] to-[#FF3366] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Gift className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Gift Cards</h1>
              <p className="text-white/80 mt-1">Perfect gift for movie lovers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Design Selection */}
            <div className="bg-[#1F1F1F] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Choose Design</h2>
              <div className="grid grid-cols-4 gap-4">
                {designs.map(design => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedDesign(design.id)}
                    className={`relative aspect-[3/4] rounded-xl bg-gradient-to-br ${design.gradient} p-4 flex flex-col items-center justify-center transition-all ${
                      selectedDesign === design.id ? 'ring-4 ring-white scale-105' : 'hover:scale-105'
                    }`}
                  >
                    <Gift className="w-10 h-10 text-white/80" />
                    {selectedDesign === design.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-[#FF0040]" />
                      </div>
                    )}
                    <span className="text-white/60 text-xs mt-2">{design.pattern}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div className="bg-[#1F1F1F] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Select Amount</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                {presetAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-3 rounded-lg font-semibold transition-all ${
                      selectedAmount === amount && !customAmount
                        ? 'bg-[#FF0040] text-white'
                        : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A] hover:text-white'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmount}
                  placeholder="Enter custom amount"
                  className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                />
              </div>
              <p className="text-gray-500 text-sm mt-2">Minimum ₹100, Maximum ₹50,000</p>
            </div>

            {/* Quantity */}
            <div className="bg-[#1F1F1F] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quantity</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-[#2A2A2A] rounded-lg flex items-center justify-center text-white hover:bg-[#3A3A3A] transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-2xl font-bold text-white w-16 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-12 h-12 bg-[#2A2A2A] rounded-lg flex items-center justify-center text-white hover:bg-[#3A3A3A] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="bg-[#1F1F1F] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recipient Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Recipient Name</label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="Enter recipient's name"
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Recipient Email</label>
                  <input
                    type="email"
                    value={receiverEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                    placeholder="Enter recipient's email"
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                  />
                  <p className="text-gray-500 text-sm mt-1">Gift card will be sent to this email</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Your Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Personal Message (Optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040] resize-none"
                  />
                  <p className="text-gray-500 text-sm mt-1">{message.length}/200 characters</p>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-[#FF0040] text-white rounded-xl font-bold text-lg hover:bg-[#CC0033] transition-colors flex items-center justify-center gap-2">
              Add to Cart - ₹{totalAmount.toLocaleString()}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Gift Card Preview */}
              <div className={`bg-gradient-to-br ${designs[selectedDesign].gradient} rounded-2xl p-6 aspect-[3/4] flex flex-col relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10">
                  <Gift className="w-12 h-12 text-white mb-4" />
                  <div className="text-white mb-6">
                    <p className="text-white/60 text-sm mb-1">Gift Card Value</p>
                    <p className="text-4xl font-bold">₹{selectedAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-4">
                    <p className="text-white/60 text-xs mb-1">From</p>
                    <p className="text-white font-medium">{senderName || 'Your Name'}</p>
                  </div>
                  {message && (
                    <p className="text-white/80 text-sm italic">"{message}"</p>
                  )}
                </div>
                
                <div className="mt-auto relative z-10">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <QrCode className="w-5 h-5" />
                    <span>Scan to redeem</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-[#1F1F1F] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Why Gift Cards?</h3>
                {[
                  { icon: HeartHandshake, title: 'Perfect for Everyone', desc: 'Ideal gift for any occasion' },
                  { icon: CreditCard, title: 'Easy to Use', desc: 'Redeemable on all bookings' },
                  { icon: Clock, title: 'Never Expires', desc: 'Valid for 12 months' },
                  { icon: Shield, title: 'Secure', desc: '100% safe & secure' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#2A2A2A] rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#FF0040]" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Share */}
              <button className="w-full py-3 border border-gray-700 rounded-lg text-gray-400 hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Gift Cards
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-[#1F1F1F] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Choose', desc: 'Select amount & design', icon: Gift },
              { step: '2', title: 'Personalize', desc: 'Add message & details', icon: Mail },
              { step: '3', title: 'Send', desc: 'Email delivery instantly', icon: Smartphone },
              { step: '4', title: 'Redeem', desc: 'Use at checkout', icon: CreditCard },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-[#FF0040]" />
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#FF0040] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gray-700" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How long is the gift card valid?', a: 'Gift cards are valid for 12 months from the date of purchase.' },
              { q: 'Can I use multiple gift cards for one booking?', a: 'Yes, you can combine up to 3 gift cards for a single transaction.' },
              { q: 'Can I refund a gift card?', a: 'Gift cards are non-refundable once purchased.' },
              { q: 'Where can I use the gift card?', a: 'Gift cards can be used for movie tickets, food & beverages, and merchandise.' },
            ].map((faq, i) => (
              <details key={i} className="bg-[#1F1F1F] rounded-xl group">
                <summary className="p-4 cursor-pointer flex items-center justify-between text-white font-medium">
                  {faq.q}
                  <Plus className="w-5 h-5 text-gray-400 group-open:rotate-45 transition-transform" />
                </summary>
                <div className="px-4 pb-4 text-gray-400">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GiftCards
