import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Bell, Eye, Share2, Trash2, ChevronRight, Check, AlertTriangle, Lock, Save, Download, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const PrivacySettings = () => {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('data')
  
  // Privacy Settings State
  const [settings, setSettings] = useState({
    // Data Sharing
    shareWithPartners: false,
    shareAnalytics: true,
    sharePersonalization: true,
    
    // Marketing
    emailMarketing: false,
    smsMarketing: false,
    pushNotifications: true,
    whatsappUpdates: false,
    
    // Activity
    showWatchHistory: true,
    showBookings: false,
    showReviews: true,
    
    // Cookies
    essentialCookies: true,
    performanceCookies: true,
    functionalCookies: true,
    advertisingCookies: false
  })
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('privacySettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])
  
  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }
  
  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    localStorage.setItem('privacySettings', JSON.stringify(settings))
    setIsSaving(false)
    setSaveSuccess(true)
    
    setTimeout(() => setSaveSuccess(false), 3000)
  }
  
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') return
    
    // In production, this would call an API to delete the account
    alert('Account deletion request submitted. You will receive an email confirmation.')
    setShowDeleteConfirm(false)
    setDeleteConfirmText('')
  }
  
  const handleExportData = () => {
    // Create a JSON blob with user data
    const userData = {
      profile: user,
      privacySettings: settings,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bookmyshow-data-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }
  
  const sections = [
    { id: 'data', label: 'Data Sharing', icon: Share2 },
    { id: 'marketing', label: 'Marketing', icon: Bell },
    { id: 'activity', label: 'Activity', icon: Eye },
    { id: 'cookies', label: 'Cookies', icon: Lock },
    { id: 'account', label: 'Account', icon: Shield }
  ]
  
  const renderContent = () => {
    switch (activeSection) {
      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Data Sharing Preferences</h3>
              <p className="text-gray-400 text-sm mb-4">
                Control how your data is shared with third parties.
              </p>
            </div>
            
            <div className="space-y-4">
              <ToggleItem
                title="Share with Partners"
                description="Allow sharing your booking data with our partner theaters and service providers"
                checked={settings.shareWithPartners}
                onChange={() => handleToggle('shareWithPartners')}
              />
              
              <ToggleItem
                title="Analytics Data"
                description="Help us improve by sharing anonymous usage analytics"
                checked={settings.shareAnalytics}
                onChange={() => handleToggle('shareAnalytics')}
              />
              
              <ToggleItem
                title="Personalization"
                description="Allow us to personalize your experience based on your activity"
                checked={settings.sharePersonalization}
                onChange={() => handleToggle('sharePersonalization')}
              />
            </div>
          </div>
        )
        
      case 'marketing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Marketing Preferences</h3>
              <p className="text-gray-400 text-sm mb-4">
                Choose how you want to receive promotional content.
              </p>
            </div>
            
            <div className="space-y-4">
              <ToggleItem
                title="Email Marketing"
                description="Receive newsletters, offers, and promotional emails"
                checked={settings.emailMarketing}
                onChange={() => handleToggle('emailMarketing')}
              />
              
              <ToggleItem
                title="SMS Marketing"
                description="Receive SMS alerts for offers and booking confirmations"
                checked={settings.smsMarketing}
                onChange={() => handleToggle('smsMarketing')}
              />
              
              <ToggleItem
                title="Push Notifications"
                description="Get push notifications for order updates and offers"
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
              />
              
              <ToggleItem
                title="WhatsApp Updates"
                description="Receive booking updates via WhatsApp"
                checked={settings.whatsappUpdates}
                onChange={() => handleToggle('whatsappUpdates')}
              />
            </div>
          </div>
        )
        
      case 'activity':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Activity Visibility</h3>
              <p className="text-gray-400 text-sm mb-4">
                Control who can see your activity on BookMyShow.
              </p>
            </div>
            
            <div className="space-y-4">
              <ToggleItem
                title="Watch History"
                description="Show your watch history on your public profile"
                checked={settings.showWatchHistory}
                onChange={() => handleToggle('showWatchHistory')}
              />
              
              <ToggleItem
                title="Recent Bookings"
                description="Display your recent bookings on your profile"
                checked={settings.showBookings}
                onChange={() => handleToggle('showBookings')}
              />
              
              <ToggleItem
                title="Reviews & Ratings"
                description="Show your reviews and ratings publicly"
                checked={settings.showReviews}
                onChange={() => handleToggle('showReviews')}
              />
            </div>
          </div>
        )
        
      case 'cookies':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Cookie Preferences</h3>
              <p className="text-gray-400 text-sm mb-4">
                Manage how we use cookies to enhance your experience.
              </p>
            </div>
            
            <div className="space-y-4">
              <ToggleItem
                title="Essential Cookies"
                description="Required for the website to function properly (cannot be disabled)"
                checked={settings.essentialCookies}
                onChange={() => {}}
                disabled
              />
              
              <ToggleItem
                title="Performance Cookies"
                description="Help us understand how visitors interact with our website"
                checked={settings.performanceCookies}
                onChange={() => handleToggle('performanceCookies')}
              />
              
              <ToggleItem
                title="Functional Cookies"
                description="Remember your preferences and settings"
                checked={settings.functionalCookies}
                onChange={() => handleToggle('functionalCookies')}
              />
              
              <ToggleItem
                title="Advertising Cookies"
                description="Used to deliver relevant ads based on your interests"
                checked={settings.advertisingCookies}
                onChange={() => handleToggle('advertisingCookies')}
              />
            </div>
          </div>
        )
        
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Account Management</h3>
              <p className="text-gray-400 text-sm mb-4">
                Manage your account data and privacy settings.
              </p>
            </div>
            
            {/* Export Data */}
            <div className="bg-[#2A2A2A] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Export Your Data</h4>
                  <p className="text-gray-400 text-sm">Download a copy of your data in JSON format</p>
                </div>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF0040] text-white rounded-lg text-sm font-medium hover:bg-[#E6003A] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
            
            {/* Delete Account */}
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-red-500 font-medium">Delete Account</h4>
                  <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }
  
  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/profile" className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Privacy Settings</h1>
            <p className="text-gray-400 text-sm">Manage your data and privacy preferences</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-[#1F1F1F] rounded-xl p-2 sticky top-4">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-[#FF0040] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="bg-[#1F1F1F] rounded-xl p-6">
              {renderContent()}
            </div>
            
            {/* Save Button */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-500">
                {saveSuccess && (
                  <>
                    <Check className="w-5 h-5" />
                    <span className="text-sm">Settings saved successfully</span>
                  </>
                )}
              </div>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#E6003A] transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          
          <div className="relative bg-[#1F1F1F] rounded-2xl p-6 max-w-md w-full">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Delete Account?
            </h3>
            
            <p className="text-gray-400 text-center mb-6">
              This action cannot be undone. All your data, bookings, and preferences will be permanently deleted.
            </p>
            
            <div className="mb-6">
              <label className="text-gray-400 text-sm mb-2 block">
                Type "DELETE" to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-[#2A2A2A] text-white rounded-lg font-medium hover:bg-[#3A3A3A] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Toggle Item Component
const ToggleItem = ({ title, description, checked, onChange, disabled = false }) => (
  <div className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
    disabled ? 'bg-[#2A2A2A]/50' : 'bg-[#2A2A2A]'
  }`}>
    <div className="flex-1">
      <h4 className={`font-medium ${disabled ? 'text-gray-500' : 'text-white'}`}>{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? 'bg-[#FF0040]' : 'bg-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span 
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-7' : 'translate-x-1'
        }`} 
      />
    </button>
  </div>
)

export default PrivacySettings
