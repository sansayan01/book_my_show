import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { banners } from '../../data/mockData'

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[200px] sm:h-[280px] md:h-[350px] overflow-hidden bg-[#1A1A1A]">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div 
            key={banner.id}
            className="relative w-full h-full flex-shrink-0"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${banner.image})` }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            
            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                  {banner.title}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base mb-4">
                  {banner.subtitle}
                </p>
                <Link 
                  to={`/movie/${index + 1}`}
                  className="inline-block px-6 py-2.5 bg-[#F84565] text-white rounded-lg font-semibold hover:bg-[#d63a54] transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSlide === index ? 'bg-[#F84565]' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Banner
