// Service Worker Registration for PWA
export async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available
            showUpdateNotification()
          }
        })
      })

      console.log('Service Worker registered successfully:', registration.scope)
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

// Show update notification
function showUpdateNotification() {
  // Dispatch custom event for UI to show update banner
  window.dispatchEvent(new CustomEvent('sw-update-available'))
}

// Request notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

// Show push notification
export function showNotification(title, options = {}) {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge.png',
        vibrate: [200, 100, 200],
        tag: 'bookmyshow-notification',
        requireInteraction: false,
        ...options
      })
    })
  }
}

// Handle notification click
export function setupNotificationHandlers() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('notificationclick', (event) => {
      event.notification.close()
      
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
          // Focus existing window or open new one
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus()
            }
          }
          return clients.openWindow('/')
        })
      )
    })
  }
}

// Add to home screen prompt handling
export class AddToHomeScreen {
  constructor() {
    this.deferredPrompt = null
    this.userChoice = new Promise((resolve) => {
      this.resolveUserChoice = resolve
    })
    
    this.setup()
  }

  setup() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome's mini-infobar from appearing
      e.preventDefault()
      // Stash the event so it can be triggered later
      this.deferredPrompt = e
      // Show custom install button/prompt
      window.dispatchEvent(new CustomEvent('show-install-prompt'))
    })

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null
      // Clear the deferredPrompt variable
      window.dispatchEvent(new CustomEvent('app-installed'))
      // Log installation metrics
      console.log('PWA was installed')
    })
  }

  async prompt() {
    if (!this.deferredPrompt) {
      console.log('No install prompt available')
      return { outcome: 'dismissed' }
    }

    // Show the install prompt
    this.deferredPrompt.prompt()
    
    // Wait for the user's choice
    const choiceResult = await this.userChoice
    this.resolveUserChoice = choiceResult
    
    // Clear the deferredPrompt
    this.deferredPrompt = null
    
    return choiceResult
  }

  // Check if can prompt
  get canPrompt() {
    return !!this.deferredPrompt
  }
}

// Initialize add to home screen handler
let addToHomeScreen = null

export function initAddToHomeScreen() {
  addToHomeScreen = new AddToHomeScreen()
  return addToHomeScreen
}

// Export for use
export { addToHomeScreen }

// Offline indicator
export function showOfflineIndicator() {
  const indicator = document.createElement('div')
  indicator.id = 'offline-indicator'
  indicator.innerHTML = `
    <div style="
      position: fixed;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
      background: #FF6B35;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    ">
      <span style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        animation: pulse 1.5s infinite;
      "></span>
      You're offline - Some features may be unavailable
    </div>
  `
  document.body.appendChild(indicator)
  
  // Add pulse animation if not exists
  if (!document.querySelector('#pulse-style')) {
    const style = document.createElement('style')
    style.id = 'pulse-style'
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `
    document.head.appendChild(style)
  }
}

export function hideOfflineIndicator() {
  const indicator = document.getElementById('offline-indicator')
  if (indicator) {
    indicator.remove()
  }
}

// Setup online/offline listeners
export function setupOfflineListeners() {
  window.addEventListener('offline', showOfflineIndicator)
  window.addEventListener('online', hideOfflineIndicator)
  
  // Check initial state
  if (!navigator.onLine) {
    showOfflineIndicator()
  }
}

// Service Worker message handler
export function setupSWMessageHandler() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type) {
        switch (event.data.type) {
          case 'SKIP_WAITING':
            // New service worker installed, reload to activate
            window.dispatchEvent(new CustomEvent('sw-skip-waiting'))
            break
          case 'CACHE_UPDATED':
            // Content cache updated
            window.dispatchEvent(new CustomEvent('sw-cache-updated', { 
              detail: event.data.payload 
            }))
            break
        }
      }
    })
  }
}
