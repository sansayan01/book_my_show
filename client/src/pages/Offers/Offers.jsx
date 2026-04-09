import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Gift, Percent, CreditCard, Smartphone, Film, 
  Ticket, ArrowRight, Sparkles, Clock, CheckCircle,
  ChevronDown, Search, Tag, Star, Zap, Crown
} from 'lucide-react'

const Offers = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [showCode, setShowCode] = useState(null)

  const categories = [
    { id: 'all', label: 'All Offers', icon: Gift },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'food', label: 'Food & Beverages', icon: Ticket },
    { id: 'bank', label: 'Bank Offers', icon: CreditCard },
    { id: 'upi', label: 'UPI Offers', icon: Smartphone },
  ]

  const offers = [
    {
      id: 1,
      title: 'Flat 50% Off on All Movie Tickets',
      description: 'Use code FLAT50 and get flat 50% off on movie tickets. Maximum discount ₹200.',
      code: 'FLAT50',
      discount: '50%',
      minOrder: 500,
      maxDiscount: 200,
      validTill: 'Feb 28, 2026',
      category: 'movies',
      badge: 'HOT',
      badgeColor: 'bg-red-500',
      gradient: 'from-[#FF0040] to-[#FF3366]',
      icon: Film,
    },
    {
      id: 2,
      title: 'Buy 1 Get 1 Free on Select Movies',
      description: 'Book 2 tickets and get the second one absolutely free. Valid on select Bollywood movies.',
      code: 'BOGO2024',
      discount: 'BOGO',
      minOrder: 400,
      validTill: 'Jan 31, 2026',
      category: 'movies',
      badge: 'LIMITED',
      badgeColor: 'bg-yellow-500',
      gradient: 'from-purple-600 to-pink-600',
      icon: Ticket,
    },
    {
      id: 3,
      title: '10% Cashback on UPI Payments',
      description: 'Pay using any UPI app and get 10% cashback. Maximum cashback ₹100.',
      code: 'UPI10',
      discount: '10%',
      minOrder: 200,
      maxDiscount: 100,
      validTill: 'Mar 15, 2026',
      category: 'upi',
      badge: 'CASHBACK',
      badgeColor: 'bg-green-500',
      gradient: 'from-green-600 to-emerald-600',
      icon: Smartphone,
    },
    {
      id: 4,
      title: 'Free Popcorn with Every Booking',
      description: 'Get free popcorn (large) with any movie booking above ₹600.',
      code: 'FREEPOPCORN',
      discount: 'FREE',
      minOrder: 600,
      validTill: 'Feb 15, 2026',
      category: 'food',
      badge: 'FREE',
      badgeColor: 'bg-orange-500',
      gradient: 'from-orange-500 to-yellow-500',
      icon: Gift,
    },
    {
      id: 5,
      title: '20% Off with HDFC Bank Cards',
      description: 'Pay using HDFC Debit/Credit Card and get 20% off. Maximum discount ₹150.',
      code: 'HDFC20',
      discount: '20%',
      minOrder: 500,
      maxDiscount: 150,
      validTill: 'Feb 28, 2026',
      category: 'bank',
      badge: 'BANK',
      badgeColor: 'bg-blue-500',
      gradient: 'from-blue-600 to-cyan-600',
      icon: CreditCard,
    },
    {
      id: 6,
      title: 'ICICI Bank Offer - 15% Off',
      description: 'Use ICICI Bank cards and get 15% off on movie tickets. Maximum ₹125 off.',
      code: 'ICICI15',
      discount: '15%',
      minOrder: 400,
      maxDiscount: 125,
      validTill: 'Mar 31, 2026',
      category: 'bank',
      badge: 'BANK',
      badgeColor: 'bg-blue-500',
      gradient: 'from-indigo-600 to-purple-600',
      icon: CreditCard,
    },
    {
      id: 7,
      title: '₹100 Off on First 3 Bookings',
      description: 'New users only! Get ₹100 off on your first 3 movie bookings.',
      code: 'NEWUSER100',
      discount: '₹100',
      minOrder: 300,
      validTill: 'Ongoing',
      category: 'movies',
      badge: 'NEW USER',
      badgeColor: 'bg-purple-500',
      gradient: 'from-violet-600 to-purple-600',
      icon: Star,
    },
    {
      id: 8,
      title: '25% Off on Recharge & Pay',
      description: 'Recharge your BMS Wallet or pay via Paytm and get 25% off.',
      code: 'PAYTM25',
      discount: '25%',
      minOrder: 500,
      maxDiscount: 100,
      validTill: 'Feb 20, 2026',
      category: 'upi',
      badge: 'RECHARGE',
      badgeColor: 'bg-cyan-500',
      gradient: 'from-cyan-600 to-teal-600',
      icon: Smartphone,
    },
    {
      id: 9,
      title: 'Exclusive: Premium Experience 30% Off',
      description: 'Book Premium seats (Recliner, Gold Class) and get 30% off.',
      code: 'PREMIUM30',
      discount: '30%',
      minOrder: 800,
      validTill: 'Mar 31, 2026',
      category: 'movies',
      badge: 'PREMIUM',
      badgeColor: 'bg-amber-500',
      gradient: 'from-amber-500 to-yellow-500',
      icon: Crown,
    },
    {
      id: 10,
      title: 'Food Combo at ₹299',
      description: 'Get large popcorn + 2 drinks combo at just ₹299. Use code COMBO299.',
      code: 'COMBO299',
      discount: '₹299',
      originalPrice: 599,
      validTill: 'Feb 28, 2026',
      category: 'food',
      badge: 'COMBO',
      badgeColor: 'bg-pink-500',
      gradient: 'from-pink-600 to-rose-600',
      icon: Gift,
    },
    {
      id: 11,
      title: 'Weekend Special: 40% Off',
      description: 'Book tickets on Saturday & Sunday and get 40% off. Maximum ₹180 off.',
      code: 'WEEKEND40',
      discount: '40%',
      minOrder: 600,
      maxDiscount: 180,
      validTill: 'Ongoing',
      category: 'movies',
      badge: 'WEEKEND',
      badgeColor: 'bg-teal-500',
      gradient: 'from-teal-600 to-green-600',
      icon: Zap,
    },
    {
      id: 12,
      title: 'SBI Card: Extra 10% Off',
      description: 'Extra 10% off for SBI Card users. Maximum additional discount ₹75.',
      code: 'SBIEXTRA',
      discount: '10%',
      minOrder: 400,
      maxDiscount: 75,
      validTill: 'Mar 31, 2026',
      category: 'bank',
      badge: 'SBI',
      badgeColor: 'bg-red-600',
      gradient: 'from-red-600 to-orange-600',
      icon: CreditCard,
    },
  ]

  const filteredOffers = activeTab === 'all' 
    ? offers 
    : offers.filter(o => o.category === activeTab)

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setShowCode(code)
    setTimeout(() => setShowCode(null), 2000)
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF0040] to-[#CC0033] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Gift className="w-12 h-12 text-white" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Offers & Deals</h1>
              <p className="text-white/80 mt-1">Save more on every booking with exclusive offers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                activeTab === cat.id
                  ? 'bg-[#FF0040] text-white'
                  : 'bg-[#1F1F1F] text-gray-400 hover:bg-[#2A2A2A] hover:text-white'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map(offer => (
            <div 
              key={offer.id}
              className="bg-[#1F1F1F] rounded-2xl overflow-hidden group hover:ring-2 hover:ring-[#FF0040]/50 transition-all"
            >
              {/* Header with Gradient */}
              <div className={`bg-gradient-to-r ${offer.gradient} p-6 relative`}>
                <span className={`absolute top-4 right-4 ${offer.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {offer.badge}
                </span>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <offer.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{offer.title}</h3>
                    <p className="text-white/80 text-sm mt-1">{offer.description}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Discount */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-[#FF0040]">{offer.discount}</span>
                  {offer.originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">₹{offer.originalPrice}</span>
                      <span className="text-green-400 text-sm">SAVE ₹{offer.originalPrice - 299}</span>
                    </>
                  )}
                  {offer.maxDiscount && (
                    <span className="text-gray-400 text-sm">upto ₹{offer.maxDiscount}</span>
                  )}
                </div>

                {/* Code Section */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 bg-[#2A2A2A] rounded-lg px-4 py-3 font-mono text-white border border-dashed border-gray-600">
                    {showCode === offer.code ? 'Copied!' : offer.code}
                  </div>
                  <button
                    onClick={() => copyCode(offer.code)}
                    className="px-6 py-3 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#CC0033] transition-colors"
                  >
                    {showCode === offer.code ? <CheckCircle className="w-5 h-5" /> : 'Copy'}
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  {offer.minOrder && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Tag className="w-4 h-4" />
                      Minimum order: ₹{offer.minOrder}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    Valid till: {offer.validTill}
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to="/movies"
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-[#2A2A2A] text-white rounded-lg font-medium hover:bg-[#3A3A3A] transition-colors group"
                >
                  Use Offer
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* How to Use Section */}
        <div className="mt-12 bg-[#1F1F1F] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How to Use Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Browse Offers', desc: 'Explore all available offers and deals' },
              { step: '2', title: 'Copy Code', desc: 'Click on copy button to copy the offer code' },
              { step: '3', title: 'Book Tickets', desc: 'Select movie and select your seats' },
              { step: '4', title: 'Apply & Save', desc: 'Paste the code at checkout to get discount' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-[#FF0040] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Offers
