import { useState, useEffect, useRef, useCallback } from 'react'

// Swipe gesture hook
export const useSwipeGesture = (options = {}) => {
  const { 
    onSwipeLeft, 
    onSwipeRight, 
    onSwipeUp, 
    onSwipeDown,
    threshold = 50 
  } = options
  
  const [direction, setDirection] = useState(null)
  const startX = useRef(0)
  const startY = useRef(0)

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const diffX = endX - startX.current
    const diffY = endY - startY.current

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          setDirection('right')
          onSwipeRight?.()
        } else {
          setDirection('left')
          onSwipeLeft?.()
        }
      }
    } else {
      if (Math.abs(diffY) > threshold) {
        if (diffY > 0) {
          setDirection('down')
          onSwipeDown?.()
        } else {
          setDirection('up')
          onSwipeUp?.()
        }
      }
    }
  }

  return { direction, handlers: { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd } }
}

// Pull to refresh hook
export const usePullToRefresh = (onRefresh, options = {}) => {
  const { threshold = 80, resistance = 2 } = options
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const containerRef = useRef(null)

  const handleTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (isPulling && window.scrollY === 0) {
      const currentY = e.touches[0].clientY
      const distance = currentY - startY.current
      if (distance > 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance / resistance, threshold * 1.5))
      }
    }
  }, [isPulling, resistance, threshold])

  const handleTouchEnd = useCallback(() => {
    if (pullDistance >= threshold) {
      onRefresh?.()
    }
    setIsPulling(false)
    setPullDistance(0)
  }, [pullDistance, threshold, onRefresh])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('touchmove', handleTouchMove, { passive: false })
      return () => container.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleTouchMove])

  return { 
    containerRef, 
    isPulling, 
    pullDistance,
    handlers: { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd }
  }
}

// Long press hook
export const useLongPress = (callback, options = {}) => {
  const { delay = 500 } = options
  const [isPressed, setIsPressed] = useState(false)
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)

  const start = useCallback((e) => {
    setIsPressed(true)
    timeoutRef.current = setTimeout(() => {
      callback?.(e)
      intervalRef.current = setInterval(() => callback?.(e), 100)
    }, delay)
  }, [callback, delay])

  const stop = useCallback(() => {
    setIsPressed(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { isPressed, handlers: { onMouseDown: start, onMouseUp: stop, onMouseLeave: stop, onTouchStart: start, onTouchEnd: stop } }
}

// Intersection observer hook for lazy loading and animations
export const useIntersectionObserver = (options = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options
  const [ref, setRef] = useState(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          if (triggerOnce) {
            observer.unobserve(ref)
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold, rootMargin, triggerOnce])

  return [setRef, isIntersecting]
}

// Online status hook
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Device type hook
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState('desktop')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      setIsMobile(width < 768 || isTouchDevice)
      setDeviceType(width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop')
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return { deviceType, isMobile }
}

// Local storage hook with SSR support
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

// Debounce hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Click outside hook
export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback?.()
      }
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [ref, callback])
}

// Scroll position hook
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
  const [scrollDirection, setScrollDirection] = useState('up')
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollPosition({ x: window.scrollX, y: currentScrollY })
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up')
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { ...scrollPosition, scrollDirection }
}
