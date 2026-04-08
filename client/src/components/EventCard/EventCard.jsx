import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock } from 'lucide-react'

const EventCard = ({ event }) => {
  return (
    <Link 
      to={`/events/${event.id}`} 
      className="flex-shrink-0 w-44 group"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#2A2A2A] mb-3">
        <img
          src={event.poster || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&h=450&fit=crop'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Date Badge */}
        {event.date && (
          <div className="absolute top-3 left-3 px-3 py-2 bg-[#FF0040] rounded-lg text-center">
            <div className="text-white font-bold text-lg">{new Date(event.date).getDate()}</div>
            <div className="text-white text-xs">{new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}</div>
          </div>
        )}
        
        {/* Category Badge */}
        {event.category && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded">
            {event.category}
          </span>
        )}

        {/* Book Button on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-full py-2 bg-[#FF0040] text-white rounded-lg font-semibold text-sm">
            Book Now
          </button>
        </div>
      </div>

      <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#FF0040] transition-colors">
        {event.title}
      </h3>
      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
        <Calendar className="w-3 h-3" />
        <span>{event.date ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBA'}</span>
      </div>
      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{event.venue || 'TBA'}</span>
      </div>
      {event.price && (
        <p className="text-[#FF0040] text-sm font-bold mt-1">₹{event.price}</p>
      )}
    </Link>
  )
}

export default EventCard