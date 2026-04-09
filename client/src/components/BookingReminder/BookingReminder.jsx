import { useState, useEffect } from 'react'
import { X, Bell, Clock, Calendar, Check, AlertCircle } from 'lucide-react'

const BookingReminder = ({ isOpen, onClose, showDetails }) => {
  const [reminderTime, setReminderTime] = useState('30')
  const [isScheduled, setIsScheduled] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState('default')
  
  useEffect(() => {
    if (isOpen && 'Notification' in window) {
      setPermissionStatus(Notification.permission)
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const reminderOptions = [
    { id: '15', label: '15 minutes before', time: 15 },
    { id: '30', label: '30 minutes before', time: 30 },
    { id: '60', label: '1 hour before', time: 60 },
    { id: '120', label: '2 hours before', time: 120 },
    { id: '1440', label: '1 day before', time: 1440 }
  ]
  
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications')
      return
    }
    
    try {
      const permission = await Notification.requestPermission()
      setPermissionStatus(permission)
    } catch (err) {
      console.error('Failed to request notification permission:', err)
    }
  }
  
  const scheduleReminder = async () => {
    if (permissionStatus !== 'granted') {
      await requestPermission()
      if (Notification.permission !== 'granted') {
        return
      }
    }
    
    // Store reminder in localStorage
    const reminder = {
      id: Date.now(),
      title: showDetails?.title || 'Movie Show',
      cinema: showDetails?.cinema || '',
      showTime: showDetails?.showTime || '',
      reminderTime: parseInt(reminderTime),
      createdAt: new Date().toISOString(),
      notified: false
    }
    
    const reminders = JSON.parse(localStorage.getItem('bookingReminders') || '[]')
    reminders.push(reminder)
    localStorage.setItem('bookingReminders', JSON.stringify(reminders))
    
    // Schedule notification
    scheduleNotification(reminder)
    
    setIsScheduled(true)
  }
  
  const scheduleNotification = (reminder) => {
    // Parse show time
    const showDateTime = new Date(reminder.showTime)
    const reminderDateTime = new Date(showDateTime.getTime() - reminder.reminderTime * 60000)
    const now = new Date()
    
    const delay = reminderDateTime.getTime() - now.getTime()
    
    if (delay > 0) {
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification(`Reminder: ${reminder.title}`, {
            body: `Your show at ${reminder.cinema} starts in ${reminder.reminderTime} minutes!`,
            icon: '/favicon.ico',
            tag: reminder.id,
            requireInteraction: true
          })
        }
        
        // Update reminder as notified
        const reminders = JSON.parse(localStorage.getItem('bookingReminders') || '[]')
        const updated = reminders.map(r => 
          r.id === reminder.id ? { ...r, notified: true } : r
        )
        localStorage.setItem('bookingReminders', JSON.stringify(updated))
      }, delay)
    }
  }
  
  // Check for existing reminders when component mounts
  useEffect(() => {
    const reminders = JSON.parse(localStorage.getItem('bookingReminders') || '[]')
    const upcoming = reminders.find(r => 
      r.title === showDetails?.title && 
      r.showTime === showDetails?.showTime &&
      !r.notified
    )
    
    if (upcoming) {
      setIsScheduled(true)
      setReminderTime(upcoming.reminderTime.toString())
    }
  }, [showDetails])
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#1F1F1F] rounded-2xl w-full max-w-md overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF0040]/10 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#FF0040]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Set Reminder</h2>
              <p className="text-gray-400 text-sm">Get notified before your show</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {showDetails ? (
            <>
              {/* Show Details */}
              <div className="bg-[#2A2A2A] rounded-xl p-4 space-y-2">
                <h3 className="text-white font-semibold">{showDetails.title}</h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{showDetails.showTime}</span>
                </div>
                {showDetails.cinema && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{showDetails.cinema}</span>
                  </div>
                )}
              </div>
              
              {isScheduled ? (
                // Scheduled State
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Reminder Set!</h3>
                  <p className="text-gray-400 text-sm">
                    You'll be notified {reminderOptions.find(o => o.id === reminderTime)?.label.toLowerCase()}
                  </p>
                </div>
              ) : (
                <>
                  {/* Permission Warning */}
                  {permissionStatus !== 'granted' && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-yellow-500 text-sm font-medium">
                          Enable notifications to receive reminders
                        </p>
                        <button
                          onClick={requestPermission}
                          className="text-yellow-500 text-sm underline hover:no-underline mt-1"
                        >
                          Enable notifications
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Reminder Time Selection */}
                  <div>
                    <p className="text-gray-400 text-sm mb-3">Remind me</p>
                    <div className="grid grid-cols-2 gap-2">
                      {reminderOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => setReminderTime(option.id)}
                          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            reminderTime === option.id
                              ? 'bg-[#FF0040] text-white'
                              : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            // No show selected
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">No Show Selected</h3>
              <p className="text-gray-400 text-sm">
                Please select a show time and cinema to set a reminder
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {showDetails && (
          <div className="flex gap-3 p-4 border-t border-gray-700 bg-[#1A1A1A]">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-[#2A2A2A] text-white rounded-lg font-medium hover:bg-[#3A3A3A] transition-colors"
            >
              {isScheduled ? 'Close' : 'Cancel'}
            </button>
            {!isScheduled && (
              <button
                onClick={scheduleReminder}
                className="flex-1 py-3 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#E6003A] transition-colors flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Set Reminder
              </button>
            )}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

export default BookingReminder
