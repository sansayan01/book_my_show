import { useState } from 'react'
import { X, Copy, Check, Link as LinkIcon, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

// Custom social icons as SVG components
const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const LinkedInIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const ShareModal = ({ isOpen, onClose, title }) => {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  
  if (!isOpen) return null
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = title || 'Check out this movie on BookMyShow!'
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      'facebook-share',
      'width=580,height=400'
    )
  }
  
  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      'twitter-share',
      'width=580,height=400'
    )
  }
  
  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
      'whatsapp-share'
    )
  }
  
  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      'linkedin-share',
      'width=580,height=400'
    )
  }
  
  const socialPlatforms = [
    { name: 'Facebook', icon: FacebookIcon, color: '#1877F2', action: shareToFacebook },
    { name: 'Twitter', icon: TwitterIcon, color: '#000000', action: shareToTwitter },
    { name: 'WhatsApp', icon: WhatsAppIcon, color: '#25D366', action: shareToWhatsApp },
    { name: 'LinkedIn', icon: LinkedInIcon, color: '#0A66C2', action: shareToLinkedIn }
  ]
  
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
          <h2 className="text-lg font-bold text-white">Share "{title}"</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Social Share Buttons */}
          <div>
            <p className="text-gray-400 text-sm mb-3">Share to</p>
            <div className="grid grid-cols-4 gap-3">
              {socialPlatforms.map(platform => (
                <button
                  key={platform.name}
                  onClick={platform.action}
                  className="flex flex-col items-center gap-2 p-3 bg-[#2A2A2A] rounded-xl hover:bg-[#3A3A3A] transition-colors group"
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: platform.color }}
                  >
                    <platform.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-400 text-xs">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[#1F1F1F] text-gray-500 text-sm">or</span>
            </div>
          </div>
          
          {/* Copy Link Section */}
          <div>
            <p className="text-gray-400 text-sm mb-3">Copy link</p>
            <div className="flex items-center gap-2 p-3 bg-[#2A2A2A] rounded-xl">
              <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="flex-1 bg-transparent text-gray-300 text-sm outline-none truncate"
              />
              <button 
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                  copied 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-[#FF0040] text-white hover:bg-[#E6003A]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* QR Code Section */}
          <div>
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
            >
              <QrCode className="w-4 h-4" />
              {showQR ? 'Hide QR Code' : 'Show QR Code for mobile'}
            </button>
            
            {showQR && (
              <div className="mt-3 flex justify-center p-4 bg-white rounded-xl">
                <QRCodeSVG 
                  value={shareUrl}
                  size={160}
                  level="M"
                  includeMargin={false}
                  bgColor="transparent"
                />
              </div>
            )}
          </div>
        </div>
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

export default ShareModal
