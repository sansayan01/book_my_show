import { useState, useCallback, useEffect } from 'react'

/**
 * Custom hook for API calls with retry mechanism
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    initialData = null,
    immediate = false,
    retryCount = 3,
    retryDelay = 1000,
    onSuccess = null,
    onError = null,
  } = options

  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryAttempts, setRetryAttempts] = useState(0)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    
    let lastError = null
    
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const result = await apiFunction(...args)
        setData(result)
        setLoading(false)
        setRetryAttempts(attempt)
        if (onSuccess) onSuccess(result)
        return result
      } catch (err) {
        lastError = err
        setRetryAttempts(attempt)
        
        if (attempt < retryCount) {
          // Exponential backoff
          const delay = retryDelay * Math.pow(2, attempt)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    setError(lastError)
    setLoading(false)
    if (onError) onError(lastError)
    return null
  }, [apiFunction, retryCount, retryDelay, onSuccess, onError])

  const reset = useCallback(() => {
    setData(initialData)
    setError(null)
    setRetryAttempts(0)
  }, [initialData])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [])

  return {
    data,
    loading,
    error,
    retryAttempts,
    execute,
    reset,
    isRetrying: retryAttempts > 0 && loading,
  }
}

/**
 * Hook for network status monitoring
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setWasOffline(true)
      // Clear "was offline" flag after showing the toast
      setTimeout(() => setWasOffline(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, wasOffline }
}

/**
 * Debounce hook for search inputs
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Memoization hook with custom comparison
 */
export const useMemoCompare = (value, compare) => {
  const [current, setCurrent] = useState(value)

  if (!compare(current, value)) {
    setCurrent(value)
  }

  return current
}
