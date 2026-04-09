import { useState, useRef, useEffect } from 'react'
import { 
  MessageCircle, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  User,
  Bot,
  Check,
  CheckCheck,
  X,
  HelpCircle,
  FileText,
  CreditCard,
  Ticket,
  Gift,
  AlertTriangle
} from 'lucide-react'

const faqData = [
  {
    category: 'Bookings',
    icon: Ticket,
    questions: [
      {
        q: 'How do I book tickets online?',
        a: 'Simply search for a movie or event, select your preferred showtime, choose seats, and complete the payment. You\'ll receive an SMS and email confirmation with your e-ticket.'
      },
      {
        q: 'Can I cancel or reschedule my booking?',
        a: 'Yes, you can cancel or reschedule your booking up to 24 hours before the show. Go to "My Bookings" and select the booking you wish to modify. Cancellation fees may apply.'
      },
      {
        q: 'What happens if the show is cancelled?',
        a: 'In case of show cancellation, the full ticket amount will be refunded to your original payment method within 5-7 working days.'
      }
    ]
  },
  {
    category: 'Payments',
    icon: CreditCard,
    questions: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay. Gift cards and BMS Pay balance are also accepted.'
      },
      {
        q: 'Why was my payment declined?',
        a: 'Payment can be declined due to insufficient balance, card limits, or bank restrictions. Please check with your bank or try an alternate payment method.'
      },
      {
        q: 'How do I get a refund?',
        a: 'Refunds are processed automatically to the original payment method within 5-7 working days for cancelled shows or bookings.'
      }
    ]
  },
  {
    category: 'Gift Cards',
    icon: Gift,
    questions: [
      {
        q: 'How do I purchase a gift card?',
        a: 'Visit the Gift Cards section, choose your preferred denomination, add to cart, and complete the purchase. The gift card code will be sent via email.'
      },
      {
        q: 'How do I redeem a gift card?',
        a: 'During checkout, select "Gift Card" as payment method and enter your gift card code. The balance will be applied to your order.'
      },
      {
        q: 'Do gift cards expire?',
        a: 'Yes, gift cards are valid for 12 months from the date of purchase.'
      }
    ]
  },
  {
    category: 'Account',
    icon: User,
    questions: [
      {
        q: 'How do I reset my password?',
        a: 'Click on "Forgot Password" on the login page, enter your registered email or phone number, and follow the instructions sent to your email.'
      },
      {
        q: 'How do I update my profile?',
        a: 'Go to "My Profile" section, click on the edit icon next to the field you wish to update, and save your changes.'
      }
    ]
  }
]

const chatMessages = [
  { id: 1, type: 'bot', message: 'Hi! I\'m your BookMyShow assistant. How can I help you today?', time: 'Just now' },
  { id: 2, type: 'bot', message: 'You can ask me about:', time: 'Just now', options: ['Booking tickets', 'Payment issues', 'Refunds', 'Gift cards'] }
]

const Support = () => {
  const [activeTab, setActiveTab] = useState('chat')
  const [openFaqIndex, setOpenFaqIndex] = useState(null)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', message: 'Hi! I\'m your BookMyShow assistant. How can I help you today?', time: 'Just now' },
    { id: 2, type: 'bot', message: 'You can ask me about:', time: 'Just now', options: ['Booking tickets', 'Payment issues', 'Refunds', 'Gift cards'] }
  ])
  const [userMessage, setUserMessage] = useState('')
  const [isAgentOnline, setIsAgentOnline] = useState(true)
  const [agentTyping, setAgentTyping] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const sendMessage = (message) => {
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      message: message,
      time: 'Just now'
    }
    setChatMessages(prev => [...prev, newUserMessage])
    setUserMessage('')

    // Simulate agent typing
    setTimeout(() => {
      setAgentTyping(true)
    }, 500)

    // Simulate bot response
    setTimeout(() => {
      setAgentTyping(false)
      const responses = {
        'Booking tickets': 'To book tickets, search for your preferred movie or event, select showtime, choose seats, and complete payment. You\'ll receive confirmation via SMS and email.',
        'Payment issues': 'Payment issues can occur due to bank restrictions or insufficient balance. Try clearing your cache or using a different payment method.',
        'Refunds': 'Refunds are processed within 5-7 working days to your original payment method. For cancelled shows, full refund is initiated automatically.',
        'Gift cards': 'Gift cards can be purchased from the Gift Cards section. They\'re valid for 12 months and can be redeemed during checkout.'
      }
      const botResponse = responses[message] || 'I\'m here to help! For specific queries, you can also use our Contact Form or call our helpline.'
      
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        message: botResponse,
        time: 'Just now'
      }])
    }, 2000)
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    alert('Your query has been submitted. Our team will contact you within 24 hours.')
    setContactForm({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  const handleInputChange = (e) => {
    setUserMessage(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userMessage.trim()) {
      sendMessage(userMessage)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF0040] to-[#FF6B35] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Help & Support</h1>
          <p className="text-white/80 text-lg">We're here to help you 24/7</p>
          
          {/* Live Agent Status */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className={`w-3 h-3 rounded-full ${isAgentOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-white text-sm font-medium">
              {isAgentOnline ? 'Agents Available' : 'All Agents Busy'}
            </span>
            {isAgentOnline && (
              <span className="text-white/80 text-sm">
                • Average wait time: 2 mins
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <a 
            href="tel:18001234567"
            className="bg-[#222] p-4 rounded-xl flex items-center gap-4 hover:bg-[#333] transition-colors border border-[#333] focus:ring-2 focus:ring-[#FF0040]"
            aria-label="Call our helpline"
          >
            <div className="w-12 h-12 bg-[#FF0040]/20 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-[#FF0040]" />
            </div>
            <div>
              <p className="font-semibold text-white">Call Us</p>
              <p className="text-sm text-gray-400">1800-123-4567</p>
            </div>
          </a>
          
          <a 
            href="mailto:support@bookmyshow.com"
            className="bg-[#222] p-4 rounded-xl flex items-center gap-4 hover:bg-[#333] transition-colors border border-[#333] focus:ring-2 focus:ring-[#FF0040]"
            aria-label="Email us"
          >
            <div className="w-12 h-12 bg-[#FF6B35]/20 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-[#FF6B35]" />
            </div>
            <div>
              <p className="font-semibold text-white">Email Us</p>
              <p className="text-sm text-gray-400">support@bookmyshow.com</p>
            </div>
          </a>
          
          <div className="bg-[#222] p-4 rounded-xl flex items-center gap-4 border border-[#333]">
            <div className="w-12 h-12 bg-[#22C55E]/20 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <p className="font-semibold text-white">Working Hours</p>
              <p className="text-sm text-gray-400">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2" role="tablist">
          {[
            { id: 'chat', label: 'Live Chat', icon: MessageCircle },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'contact', label: 'Contact Form', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#FF0040] text-white'
                  : 'bg-[#222] text-gray-300 hover:bg-[#333]'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chat Panel */}
        <div 
          id="tabpanel-chat" 
          role="tabpanel" 
          aria-labelledby="tab-chat"
          className={`bg-[#222] rounded-xl border border-[#333] overflow-hidden ${activeTab !== 'chat' ? 'hidden' : ''}`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-[#333] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF0040] to-[#FF6B35] rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#222]" />
              </div>
              <div>
                <p className="font-semibold text-white">BMS Assistant</p>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
            <button 
              className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-colors"
              aria-label="Minimize chat"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      msg.type === 'user'
                        ? 'bg-[#FF0040] text-white rounded-br-md'
                        : 'bg-[#333] text-white rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  {msg.options && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => sendMessage(option)}
                          className="px-3 py-1.5 bg-[#333] text-gray-300 text-sm rounded-lg hover:bg-[#444] hover:text-white transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
            
            {agentTyping && (
              <div className="flex justify-start">
                <div className="bg-[#333] px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-[#333]">
            <div className="flex gap-2">
              <input
                type="text"
                value={userMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-[#333] border border-[#444] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                aria-label="Type your message"
              />
              <button
                onClick={() => userMessage.trim() && sendMessage(userMessage)}
                className="px-4 py-2.5 bg-[#FF0040] text-white rounded-lg hover:bg-[#E6003A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!userMessage.trim()}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Panel */}
        <div 
          id="tabpanel-faq" 
          role="tabpanel" 
          aria-labelledby="tab-faq"
          className={`space-y-4 ${activeTab !== 'faq' ? 'hidden' : ''}`}
        >
          {faqData.map((faq, categoryIndex) => (
            <div key={faq.category} className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
              <button
                onClick={() => toggleFaq(categoryIndex)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#252525] transition-colors"
                aria-expanded={openFaqIndex === categoryIndex}
                aria-controls={`faq-${categoryIndex}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF0040]/20 rounded-full flex items-center justify-center">
                    <faq.icon className="w-5 h-5 text-[#FF0040]" />
                  </div>
                  <span className="font-semibold text-white">{faq.category}</span>
                </div>
                {openFaqIndex === categoryIndex ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              <div 
                id={`faq-${categoryIndex}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openFaqIndex === categoryIndex ? 'max-h-[1000px]' : 'max-h-0'
                }`}
              >
                <div className="p-4 pt-0 space-y-3">
                  {faq.questions.map((item, qIndex) => (
                    <details 
                      key={qIndex}
                      className="group bg-[#1A1A1A] rounded-lg"
                    >
                      <summary 
                        className="flex items-center justify-between p-4 cursor-pointer list-none"
                        tabIndex={0}
                      >
                        <span className="font-medium text-gray-200 group-hover:text-[#FF0040] transition-colors">
                          {item.q}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-4 pb-4">
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form Panel */}
        <div 
          id="tabpanel-contact" 
          role="tabpanel" 
          aria-labelledby="tab-contact"
          className={`bg-[#222] rounded-xl border border-[#333] p-6 ${activeTab !== 'contact' ? 'hidden' : ''}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#FF0040]/20 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#FF0040]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Submit a Request</h3>
              <p className="text-sm text-gray-400">We'll get back to you within 24 hours</p>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-[#444] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-[#444] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-[#444] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-[#444] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF0040]"
                >
                  <option value="">Select a topic</option>
                  <option value="booking">Booking Issue</option>
                  <option value="payment">Payment Problem</option>
                  <option value="refund">Refund Request</option>
                  <option value="account">Account Help</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="w-full bg-[#1A1A1A] border border-[#444] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040] resize-none"
                placeholder="Describe your issue in detail..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF0040] text-white py-3 rounded-lg font-semibold hover:bg-[#E6003A] transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Support
