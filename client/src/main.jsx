import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// PWA Setup
const initPWA = async () => {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            window.dispatchEvent(new CustomEvent('sw-update-available'))
          }
        })
      })

      console.log('Service Worker registered:', registration.scope)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  // Setup offline/online listeners
  window.addEventListener('offline', () => {
    const indicator = document.createElement('div')
    indicator.id = 'offline-banner'
    indicator.innerHTML = `
      <div style="
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        background: linear-gradient(90deg, #FF6B35, #FF0040);
        color: white;
        padding: 10px 16px;
        font-size: 13px;
        font-weight: 500;
        text-align: center;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      ">
        <span>📡</span>
        You're offline - Some features may be limited
      </div>
    `
    document.body.appendChild(indicator)
  })

  window.addEventListener('online', () => {
    const indicator = document.getElementById('offline-banner')
    if (indicator) indicator.remove()
  })

  // Add to Home Screen handling
  let deferredPrompt = null
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    
    // Store for later use
    window.deferredInstallPrompt = e
  })
}

// Initialize PWA
initPWA()

// Accessibility: Keyboard navigation detection
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.setAttribute('data-keyboard-nav', 'true')
  }
})

document.addEventListener('mousedown', () => {
  document.body.removeAttribute('data-keyboard-nav')
})

// Accessibility: Reduce motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
if (prefersReducedMotion.matches) {
  document.documentElement.classList.add('reduce-motion')
}

// Accessibility: High contrast mode
const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
if (prefersHighContrast.matches) {
  document.documentElement.classList.add('high-contrast')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
    <App />
  </StrictMode>,
)

// Handle service worker updates
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    // Check for updates periodically
    setInterval(() => {
      registration.update()
    }, 60 * 60 * 1000) // Every hour
  })
}
