import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, Film, Zap, Calendar, Ticket, User, 
  Search, Menu, X, Plus, ChevronUp, Bell
} from 'lucide-react'

// Pull to Refresh Component
const PullToRefresh = ({ onRefresh, children }) => {
  const [isPulling, setIsPulling] = useState(false)
  const [startY, setStartY] = useState(0)
  const [pullDistance, setPullDistance] = useState(0)
  const containerRef = useRef(null)

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e) => {
    if (isPulling && window.scrollY === 0) {
      const currentY = e.touches[0].clientY
      const distance = Math.max(0, currentY - startY)
      setPullDistance(Math.min(distance, 100))
    }
  }

  const handleTouchEnd = () => {
    if (pullDistance > 80) {
      onRefresh()
    }
    setIsPulling(false)
    setPullDistance(0)
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull Indicator */}
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 right-0 flex justify-center items-center py-4 bg-[#FF0040]"
            style={{ height: `${pullDistance}px` }}
          >
            <motion.div
              animate={{ rotate: pullDistance > 80 ? 180 : 0 }}
              transition={{ type: 'spring' }}
            >
              <ChevronUp className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  )
}

// Floating Action Button
const FloatingActionButton = ({ onClick }) => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: Film, label: 'Movies', path: '/movies', color: '#FF0040' },
    { icon: Calendar, label: 'Events', path: '/events', color: '#FF6B35' },
    { icon: Ticket, label: 'Plays', path: '/plays', color: '#22C55E' },
    { icon: Zap, label: 'Sports', path: '/sports', color: '#3B82F6' }
  ]

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 -bottom-20"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Items */}
            {menuItems.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: -(idx + 1) * 60 }}
                exit={{ opacity: 0, scale: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3"
                >
                  <span className="px-3 py-1.5 bg-[#2A2A2A] text-white text-sm rounded-lg whitespace-nowrap shadow-lg">
                    {item.label}
                  </span>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: item.color }}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#FF0040] rounded-full flex items-center justify-center shadow-lg shadow-[#FF0040]/30"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Plus className="w-7 h-7 text-white" />
        </motion.div>
      </motion.button>
    </div>
  )
}

// Bottom Navigation Bar
const BottomNav = () => {
  const location = useLocation()
  const [showNav, setShowNav] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  const navItems = [
    { id: 'home', path: '/', icon: Home, label: 'Home' },
    { id: 'movies', path: '/movies', icon: Film, label: 'Movies' },
    { id: 'premiere', path: '/premiere', icon: Zap, label: 'Premiere', badge: 'NEW' },
    { id: 'events', path: '/events', icon: Calendar, label: 'Events' },
    { id: 'profile', path: '/profile', icon: User, label: 'Profile' }
  ]

  // Hide/show nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false)
      } else {
        setShowNav(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: showNav ? 0 : 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-gray-800 z-50 md:hidden safe-area-bottom"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`relative flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive(item.path) ? 'text-[#FF0040]' : 'text-gray-500'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'fill-current' : ''}`} />
                
                {/* Active Indicator */}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF0040] rounded-full"
                  />
                )}
                
                {/* Badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.5 bg-[#FF0040] text-white text-[8px] font-bold rounded">
                    {item.badge}
                  </span>
                )}
              </motion.div>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </motion.nav>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Safe Area Spacer for iOS */}
      <div className="h-16 md:hidden" />
    </>
  )
}

// Mini Player Component (for streaming/preview)
const MiniPlayer = ({ title, thumbnail, onExpand, onClose }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-[#2A2A2A] rounded-xl shadow-2xl z-40 overflow-hidden"
    >
      <div className="flex items-center gap-3 p-3">
        <div className="relative w-14 h-14 flex-shrink-0">
          <img 
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
          <button 
            onClick={onExpand}
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#FF0040] rounded-full flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{title}</p>
          <p className="text-gray-400 text-xs">Now Playing</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* Progress Bar */}
      <div className="h-1 bg-gray-700">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '35%' }}
          className="h-full bg-[#FF0040]"
        />
      </div>
    </motion.div>
  )
}

export { BottomNav, PullToRefresh, FloatingActionButton, MiniPlayer }
