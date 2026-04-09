import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'

const AddToHomeScreen = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    // Check if already dismissed
    const wasDismissed = localStorage.getItem('addToHomeDismissed')
    const dismissedTime = localStorage.getItem('addToHomeDismissedTime')
    
    if (wasDismissed && dismissedTime) {
      const hoursSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60)
      if (hoursSinceDismissed < 24) {
        setIsDismissed(true)
        return
      }
    }

    // Listen for install prompt
    const handleInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
      
      // Show prompt after a delay
      setTimeout(() => {
        setIsVisible(true)
      }, 3000)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setCanInstall(false)
      setIsVisible(false)
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setCanInstall(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setCanInstall(false)
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('addToHomeDismissed', 'true')
    localStorage.setItem('addToHomeDismissedTime', Date.now().toString())
  }

  if (!canInstall || isDismissed || !isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50"
      >
        <div className="bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-4 shadow-2xl border border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF0040] to-[#FF6B35] rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Install App</h3>
              <p className="text-gray-400 text-sm">Add BookMyShow to your home screen for a better experience</p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['Quick access', 'Offline mode', 'Push alerts'].map((feature, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-[#3A3A3A] text-gray-300 text-xs rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-2.5 text-gray-400 text-sm font-medium rounded-lg hover:bg-[#3A3A3A] transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 px-4 py-2.5 bg-[#FF0040] text-white text-sm font-medium rounded-lg hover:bg-[#E6003A] transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AddToHomeScreen
