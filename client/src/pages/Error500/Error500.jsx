import { Link } from 'react-router-dom'
import { Home, RefreshCw, AlertTriangle, Mail, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'

const Error500 = () => {
  const [countdown, setCountdown] = useState(30)
  const [isRetrying, setIsRetrying] = useState(false)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.reload()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const handleRetry = () => {
    setIsRetrying(true)
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
  
  const supportOptions = [
    { icon: Mail, label: 'Email Support', value: 'support@bookmyshow.com', href: 'mailto:support@bookmyshow.com' },
    { icon: Phone, label: 'Call Us', value: '1800-XXX-XXXX', href: 'tel:18001234567' }
  ]
  
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 500 Graphic */}
        <div className="relative mb-8">
          <div className="text-[150px] sm:text-[200px] font-bold text-red-500/10 leading-none select-none">
            500
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500" />
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Server Error
        </h1>
        
        {/* Description */}
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          We encountered an unexpected error on our servers. Our team has been notified and is working to fix this.
          In the meantime, you can try refreshing the page or contact our support team.
        </p>
        
        {/* Error Reference */}
        <div className="bg-[#2A2A2A] rounded-xl p-4 mb-8">
          <p className="text-gray-500 text-xs mb-1">Error Reference</p>
          <p className="text-gray-300 text-sm font-mono">
            ERR_SERVER_ERROR_{Date.now().toString(36).toUpperCase()}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#E6003A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Try Again
              </>
            )}
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2A2A2A] text-white rounded-lg font-medium hover:bg-[#3A3A3A] transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
        </div>
        
        {/* Support Options */}
        <div className="bg-[#1F1F1F] rounded-xl p-4 mb-8">
          <p className="text-gray-400 text-sm mb-4">Need immediate help?</p>
          <div className="grid grid-cols-2 gap-3">
            {supportOptions.map(option => (
              <a
                key={option.label}
                href={option.href}
                className="flex flex-col items-center gap-2 p-4 bg-[#2A2A2A] rounded-xl hover:bg-[#3A3A3A] transition-colors"
              >
                <option.icon className="w-5 h-5 text-[#FF0040]" />
                <span className="text-gray-300 text-sm">{option.label}</span>
                <span className="text-gray-500 text-xs">{option.value}</span>
              </a>
            ))}
          </div>
        </div>
        
        {/* Auto-retry notice */}
        <p className="text-gray-500 text-sm">
          Auto-retrying in {countdown} seconds...
        </p>
      </div>
    </div>
  )
}

export default Error500
