import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'

const EventCard = ({ event }) => {
  return (
    <Link 
      to={`/event/${event.id}`}
      className="group flex-shrink-0 w-[280px] sm:w-[300px] transition-transform hover:scale-105 duration-300"
    >
      <div className="bg-[#2A2A2A] rounded-xl overflow-hidden">
        {/* Poster */}
        <div className="relative h-[160px]">
          <img 
            src={event.poster} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-[#FF0040] rounded-full text-xs font-medium text-white">
            {event.category}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-base truncate group-hover:text-[#FF0040] transition-colors">
            {event.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-3 text-gray-400 text-sm">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{new Date(event.date).toLocaleDateString('en-IN', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-[#FF0040] font-bold">
              Starting from ₹{event.price}
            </span>
            <button className="px-4 py-1.5 bg-[#FF0040] text-white rounded-lg text-sm font-medium hover:bg-[#d63a54] transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
