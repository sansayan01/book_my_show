import { Link } from 'react-router-dom'
import { Ticket, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#F84565] rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl">BookMyShow</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              India's biggest online ticket booking platform. Book movies, events, sports and more.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-[#F84565] text-sm transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-[#F84565] text-sm transition-colors">Careers</Link></li>
              <li><Link to="/press" className="text-gray-400 hover:text-[#F84565] text-sm transition-colors">Press</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-[#F84565] text-sm transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-[#F84565] text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-[#F84565] text-sm transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-[#F84565] text-sm transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-[#F84565] text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h3 className="text-white font-semibold mb-4">Top Cities</h3>
            <ul className="space-y-2">
              <li><Link to="/movies?city=mumbai" className="text-gray-400 hover:text-[#F84565] text-sm transition-colors">Mumbai</Link></li>
              <li><Link to="/movies?city=delhi" className="text-gray-400 hover:text-[#F84565] text-sm transition-colors">Delhi</Link></li>
              <li><Link to="/movies?city=bangalore" className="text-gray-400 hover:text-[#F84565] text-sm transition-colors">Bangalore</Link></li>
              <li><Link to="/movies?city=hyderabad" className="text-gray-400 hover:text-[#F84565] text-sm transition-colors">Hyderabad</Link></li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h3 className="text-white font-semibold mb-4">Download App</h3>
            <div className="flex flex-col gap-2">
              <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors text-left">
                <span className="text-xs text-gray-400">Download on the</span>
                <br />App Store
              </button>
              <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors text-left">
                <span className="text-xs text-gray-400">Get it on</span>
                <br />Google Play
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 BookMyShow Clone. All rights reserved. Built with ❤️ by Sayan Mondal
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
