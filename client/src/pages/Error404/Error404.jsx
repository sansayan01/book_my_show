import { Link } from 'react-router-dom'
import { Home, Search, ArrowLeft, Film } from 'lucide-react'
import { useState, useEffect } from 'react'

const Error404 = () => {
  const [countdown, setCountdown] = useState(10)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = '/'
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const suggestions = [
    { name: 'Movies', path: '/movies', icon: Film },
    { name: 'Events', path: '/events', icon: '🎭' },
    { name: 'Sports', path: '/sports', icon: '🏏' },
    { name: 'Plays', path: '/plays', icon: '🎭' }
  ]
  
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Graphic */}
        <div className="relative mb-8">
          <div className="text-[150px] sm:text-[200px] font-bold text-[#FF0040]/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-[#FF0040] rounded-full flex items-center justify-center">
              <span className="text-6xl sm:text-7xl">🔍</span>
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Page Not Found
        </h1>
        
        {/* Description */}
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back to the entertainment!
        </p>
        
        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {suggestions.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg text-sm hover:bg-[#3A3A3A] hover:text-white transition-colors"
            >
              {typeof item.icon === 'string' ? (
                <span>{item.icon}</span>
              ) : (
                <item.icon className="w-4 h-4" />
              )}
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2A2A2A] text-white rounded-lg font-medium hover:bg-[#3A3A3A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#E6003A] transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
        
        {/* Search Box */}
        <div className="max-w-md mx-auto">
          <form onSubmit={(e) => {
            e.preventDefault()
            const query = e.target.search.value
            if (query) {
              window.location.href = `/movies?search=${encodeURIComponent(query)}`
            }
          }} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search for movies, events..."
              className="w-full pl-12 pr-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#FF0040] transition-colors"
            />
          </form>
        </div>
        
        {/* Auto-redirect notice */}
        <p className="text-gray-500 text-sm mt-8">
          Redirecting to home in {countdown} seconds...
        </p>
      </div>
    </div>
  )
}

export default Error404
