import { Link } from 'react-router-dom'
import { Ticket } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-[#FF0040] font-bold text-2xl tracking-tight">book</span>
              <span className="text-white font-bold text-2xl tracking-tight">MyShow</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's leading entertainment destination. Book tickets for movies, events, sports, and more.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#3A3A3A] rounded-lg flex items-center justify-center transition-colors text-sm font-bold">
                f
              </a>
              <a href="#" className="w-9 h-9 bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#3A3A3A] rounded-lg flex items-center justify-center transition-colors">
                <span className="text-xs">𝕏</span>
              </a>
              <a href="#" className="w-9 h-9 bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#3A3A3A] rounded-lg flex items-center justify-center transition-colors">
                📷
              </a>
              <a href="#" className="w-9 h-9 bg-[#2A2A2A] text-gray-400 hover:text-white hover:bg-[#3A3A3A] rounded-lg flex items-center justify-center transition-colors">
                ▶
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Careers</Link></li>
              <li><Link to="/press" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Press</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Support</h3>
            <ul className="space-y-2.5">
              <li><Link to="/contact" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Top Cities</h3>
            <ul className="space-y-2.5">
              <li><Link to="/movies?city=mumbai" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Mumbai</Link></li>
              <li><Link to="/movies?city=delhi" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Delhi NCR</Link></li>
              <li><Link to="/movies?city=bangalore" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Bangalore</Link></li>
              <li><Link to="/movies?city=hyderabad" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Hyderabad</Link></li>
            </ul>
          </div>

          {/* Movies */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Movies</h3>
            <ul className="space-y-2.5">
              <li><Link to="/movies?lang=hindi" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Hindi Movies</Link></li>
              <li><Link to="/movies?lang=english" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">English Movies</Link></li>
              <li><Link to="/movies?lang=tamil" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Tamil Movies</Link></li>
              <li><Link to="/movies?lang=telugu" className="text-gray-400 hover:text-[#FF0040] text-sm transition-colors">Telugu Movies</Link></li>
            </ul>
          </div>
        </div>

        {/* App Download Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Download BookMyShow App</h3>
              <p className="text-gray-400 text-sm">Get exclusive offers and easy booking experience</p>
            </div>
            <div className="flex gap-4">
              <button className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium border border-gray-700 hover:border-gray-500 transition-colors">
                App Store
              </button>
              <button className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium border border-gray-700 hover:border-gray-500 transition-colors">
                Google Play
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-xs">
            © 2026 BookMyShow Clone. All rights reserved. Built with ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
