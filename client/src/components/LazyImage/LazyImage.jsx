import { useState, useRef, useEffect, memo } from 'react'
import { Image as ImageIcon } from 'lucide-react'

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'bg-[#2A2A2A]', 
  errorPlaceholder = 'bg-red-500/10',
  loadingSpinner = true,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)
  const containerRef = useRef(null)
  
  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!containerRef.current) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0
      }
    )
    
    observer.observe(containerRef.current)
    
    return () => observer.disconnect()
  }, [])
  
  const handleLoad = () => {
    setIsLoaded(true)
  }
  
  const handleError = () => {
    setHasError(true)
  }
  
  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Placeholder */}
      <div 
        className={`absolute inset-0 ${
          hasError ? errorPlaceholder : placeholder
        } ${isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      >
        {/* Loading spinner */}
        {loadingSpinner && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border-2 border-[#FF0040]/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-[#FF0040] rounded-full border-t-transparent animate-spin" />
            </div>
          </div>
        )}
        
        {/* Error placeholder icon */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-600" />
          </div>
        )}
      </div>
      
      {/* Actual image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}

export default memo(LazyImage)

// Optimized Image with blur-up effect
export const OptimizedImage = ({ 
  src, 
  alt, 
  lowQualitySrc,
  className = '',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px', threshold: 0 }
    )
    
    observer.observe(containerRef.current)
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Low quality placeholder */}
      {isInView && lowQualitySrc && (
        <img
          src={lowQualitySrc}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-0' : 'opacity-50 blur-sm'
          }`}
        />
      )}
      
      {/* Main image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
      
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#2A2A2A]">
          <div className="w-8 h-8 border-2 border-[#FF0040] rounded-full border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  )
}
