import { Component, useState, useEffect, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

// Error Boundary Component
class ErrorBoundaryComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ errorInfo })
    
    // Log to error tracking service (in production)
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-[#1F1F1F] rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              We encountered an unexpected error. Please try again or return to the homepage.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-black/30 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-400 text-sm font-mono break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-6 py-3 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#E6003A] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 px-6 py-3 bg-[#2A2A2A] text-white rounded-lg font-medium hover:bg-[#3A3A3A] transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Network Error Handler Component
export const NetworkErrorHandler = ({ children, fallback }) => {
  const [hasNetworkError, setHasNetworkError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const handleOnline = () => setHasNetworkError(false)
    const handleOffline = () => setHasNetworkError(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setHasNetworkError(false)
  }

  if (hasNetworkError) {
    return fallback || (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="text-white font-semibold mb-2">No Internet Connection</h3>
          <p className="text-gray-400 text-sm mb-4">Please check your connection and try again</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF0040] text-white rounded-lg text-sm font-medium mx-auto hover:bg-[#E6003A] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          {retryCount > 0 && (
            <p className="text-gray-500 text-xs mt-2">
              Retry attempt: {retryCount}
            </p>
          )}
        </div>
      </div>
    )
  }

  return children
}

// Page Loader Component
export const PageLoader = ({ fullScreen = true }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-[#FF0040]/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-[#FF0040] rounded-full border-t-transparent animate-spin" />
      </div>
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-20">
      {content}
    </div>
  )
}

// Retry Button Component
export const RetryButton = ({ onRetry, label = 'Retry' }) => {
  return (
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-4 py-2 bg-[#FF0040] text-white rounded-lg text-sm font-medium hover:bg-[#E6003A] transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      {label}
    </button>
  )
}

// Error Display Component
export const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-white font-semibold mb-2">Error Loading Content</h3>
      <p className="text-gray-400 text-sm mb-4 max-w-sm">
        {error?.message || 'Failed to load content. Please try again.'}
      </p>
      {onRetry && <RetryButton onRetry={onRetry} />}
    </div>
  )
}

// Export ErrorBoundary as default and named exports
export { ErrorBoundaryComponent }
export default ErrorBoundaryComponent
