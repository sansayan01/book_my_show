import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

// Page transition wrapper
const PageTransition = ({ children }) => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Fade in animation
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

// Slide up animation
export const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 }
}

// Slide in from left
export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 }
}

// Scale up animation
export const scaleUp = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
}

// Stagger container
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Stagger items
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

// Card hover effect
export const cardHover = {
  whileHover: { 
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2 }
  },
  whileTap: { scale: 0.98 }
}

// Button hover effect
export const buttonHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
}

// Loading spinner
export const LoadingSpinner = ({ size = 24, color = '#FF0040' }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    className={`w-${size/4} h-${size/4} border-2 border-${color} border-t-transparent rounded-full`}
    style={{ 
      width: size, 
      height: size, 
      borderColor: color,
      borderTopColor: 'transparent'
    }}
  />
)

// Skeleton loader
export const Skeleton = ({ className = '', height = 20, width = '100%' }) => (
  <motion.div
    className={`bg-[#2A2A2A] rounded ${className}`}
    style={{ height, width }}
    animate={{ 
      opacity: [0.5, 1, 0.5],
      transition: { 
        duration: 1.5, 
        repeat: Infinity, 
        ease: 'easeInOut' 
      }
    }}
  />
)

// Page loader overlay
export const PageLoader = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 bg-[#1A1A1A] z-50 flex items-center justify-center"
  >
    <div className="text-center">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="w-16 h-16 mx-auto mb-4"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="#FF0040" 
            strokeWidth="4"
          />
          <motion.path
            d="M50 5 A45 45 0 0 1 95 50"
            fill="none"
            stroke="#FF0040"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-white font-medium"
      >
        Loading...
      </motion.p>
    </div>
  </motion.div>
)

// Toast notification
export const Toast = ({ message, type = 'info', onClose }) => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-[#FF0040]',
    warning: 'bg-yellow-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-96 ${colors[type]} text-white rounded-xl p-4 shadow-lg z-50`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button 
          onClick={onClose}
          className="ml-4 p-1 hover:bg-white/20 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

// Modal animation
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  },
  exit: { opacity: 0, scale: 0.9, y: 20 }
}

// Slide in variants
export const slideVariants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: { x: '100%' }
}

// Backdrop variants
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

export default PageTransition
