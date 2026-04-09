import { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, CheckCheck, Ticket, Calendar, Gift, AlertCircle, Info, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const initialNotifications = [
  {
    id: '1',
    type: 'booking',
    title: 'Booking Confirmed!',
    message: 'Your tickets for Thunderbolts* are confirmed. Show at 6:00 PM today.',
    time: '2 hours ago',
    read: false,
    bookingId: 'BMS123456'
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Show Reminder',
    message: 'Don\'t forget! Thunderbolts* starts in 30 minutes at INOX: Nexus Mall.',
    time: '30 mins ago',
    read: false,
    showId: 'show_001'
  },
  {
    id: '3',
    type: 'offer',
    title: 'Exclusive Offer!',
    message: 'Get 20% off on all bookings with Paytm. Use code PAYTM20.',
    time: '1 day ago',
    read: true,
    offerCode: 'PAYTM20'
  },
  {
    id: '4',
    type: 'info',
    title: 'Points Expired Warning',
    message: '500 loyalty points will expire on April 15. Use them now!',
    time: '2 days ago',
    read: true,
    expiryDate: 'April 15, 2026'
  },
  {
    id: '5',
    type: 'booking',
    title: 'Refund Processed',
    message: 'Your refund of ₹1,500 has been processed for booking BMS789012.',
    time: '3 days ago',
    read: true,
    refundAmount: 1500
  },
  {
    id: '6',
    type: 'offer',
    title: 'Gold Member Exclusive',
    message: 'Pre-book Captain America: Brave New World 3 days before public release!',
    time: '4 days ago',
    read: true
  }
]

const Notifications = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(initialNotifications)
  const dropdownRef = useRef(null)
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Ticket className="w-5 h-5 text-[#FF0040]" />
      case 'reminder':
        return <Calendar className="w-5 h-5 text-[#FF6B35]" />
      case 'offer':
        return <Gift className="w-5 h-5 text-[#22C55E]" />
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
      default:
        return <Info className="w-5 h-5 text-[#3B82F6]" />
    }
  }

  if (!isOpen) return null

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-[#1A1A1A] rounded-xl shadow-2xl border border-[#333] z-50 overflow-hidden animate-scale-in"
      role="dialog"
      aria-label="Notifications"
      aria-modal="false"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#333]">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-[#FF0040] text-white text-xs px-2 py-0.5 rounded-full font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-[#333] rounded-full transition-colors"
          aria-label="Close notifications"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mark all as read */}
      {unreadCount > 0 && (
        <button
          onClick={markAllAsRead}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[#FF0040] hover:bg-[#FF0040] hover:text-white transition-colors border-b border-[#333]"
          aria-label="Mark all notifications as read"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      )}

      {/* Notifications list */}
      <div 
        className="max-h-96 overflow-y-auto"
        role="list"
        aria-label="Notification list"
      >
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto text-gray-500 mb-2" />
            <p className="text-gray-400">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-[#333] hover:bg-[#252525] transition-colors cursor-pointer ${
                !notification.read ? 'bg-[#222]' : ''
              }`}
              role="listitem"
              onClick={() => markAsRead(notification.id)}
              onKeyDown={(e) => e.key === 'Enter' && markAsRead(notification.id)}
              tabIndex={0}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-medium text-sm ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-[#FF0040] rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{notification.time}</span>
                    <div className="flex items-center gap-2">
                      <Link 
                        to={notification.type === 'booking' ? `/my-bookings` : '/offers'}
                        className="text-xs text-[#FF0040] hover:underline flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`View details for ${notification.title}`}
                      >
                        View <ChevronRight className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                        aria-label={`Delete ${notification.title}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#333]">
        <Link
          to="/profile"
          onClick={onClose}
          className="block text-center text-sm text-[#FF0040] hover:underline"
          aria-label="View all notifications"
        >
          View all notifications
        </Link>
      </div>
    </div>
  )
}

// Bell icon wrapper component for Header
export const NotificationBell = ({ onClick, unreadCount }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2.5 text-gray-700 hover:text-[#FF0040] transition-colors"
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#FF0040] text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse-slow">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}

export default Notifications
