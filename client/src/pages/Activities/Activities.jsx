import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Calendar, Clock, Users, Heart, Ticket, ChevronRight, Mountain, Scissors, Landmark, FerrisWheel, Star, Filter, X } from 'lucide-react'
import { useToast } from '../../components/Toast/Toast'

const Activities = () => {
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activities, setActivities] = useState([])
  const [favorites, setFavorites] = useState([])
  const { showToast } = useToast()

  const categories = [
    { id: 'all', name: 'All Activities', icon: <Ticket className="w-5 h-5" /> },
    { id: 'adventure', name: 'Adventure', icon: <Mountain className="w-5 h-5" /> },
    { id: 'workshops', name: 'Workshops', icon: <Scissors className="w-5 h-5" /> },
    { id: 'attractions', name: 'Tourist Spots', icon: <Landmark className="w-5 h-5" /> },
    { id: 'theme-parks', name: 'Theme Parks', icon: <FerrisWheel className="w-5 h-5" /> }
  ]

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('activityFavorites') || '[]')
    setFavorites(savedFavorites)

    const activityData = [
      {
        id: '1',
        title: 'White Water Rafting - Rishikesh',
        category: 'adventure',
        description: 'Experience the thrill of white water rafting in the Ganges.',
        image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=400&h=300&fit=crop',
        location: 'Rishikesh, Uttarakhand',
        duration: '3 hours',
        price: 1500,
        rating: 4.8,
        reviews: 256,
        ageGroup: '12+',
        difficulty: 'Moderate'
      },
      {
        id: '2',
        title: 'Bungee Jumping - Rishikesh',
        category: 'adventure',
        description: 'Jump off the 83m high platform at India\'s highest bungee jump.',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
        location: 'Rishikesh, Uttarakhand',
        duration: '2 hours',
        price: 3500,
        rating: 4.9,
        reviews: 189,
        ageGroup: '18+',
        difficulty: 'High'
      },
      {
        id: '3',
        title: 'Paragliding - Bir Billing',
        category: 'adventure',
        description: 'Soar through the skies with stunning mountain views.',
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
        location: 'Bir Billing, Himachal Pradesh',
        duration: '1 hour',
        price: 2500,
        rating: 4.7,
        reviews: 342,
        ageGroup: '6+',
        difficulty: 'Easy'
      },
      {
        id: '4',
        title: 'Rock Climbing - Hampi',
        category: 'adventure',
        description: 'Scale the ancient granite boulders of Hampi.',
        image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=300&fit=crop',
        location: 'Hampi, Karnataka',
        duration: '4 hours',
        price: 1800,
        rating: 4.6,
        reviews: 127,
        ageGroup: '10+',
        difficulty: 'Moderate'
      },
      {
        id: '5',
        title: 'Cooking Workshop - Delhi',
        category: 'workshops',
        description: 'Learn to cook authentic Indian dishes from expert chefs.',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=400&h=300&fit=crop',
        location: 'New Delhi',
        duration: '3 hours',
        price: 1200,
        rating: 4.9,
        reviews: 456,
        ageGroup: 'All',
        difficulty: 'Easy'
      },
      {
        id: '6',
        title: 'Pottery Making - Jaipur',
        category: 'workshops',
        description: 'Get hands-on experience with traditional pottery techniques.',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop',
        location: 'Jaipur, Rajasthan',
        duration: '2 hours',
        price: 800,
        rating: 4.5,
        reviews: 234,
        ageGroup: 'All',
        difficulty: 'Easy'
      },
      {
        id: '7',
        title: 'Photography Tour - Varanasi',
        category: 'workshops',
        description: 'Capture the essence of ancient Varanasi with a professional photographer.',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=300&fit=crop',
        location: 'Varanasi, Uttar Pradesh',
        duration: '4 hours',
        price: 2000,
        rating: 4.8,
        reviews: 167,
        ageGroup: 'All',
        difficulty: 'Easy'
      },
      {
        id: '8',
        title: 'Yoga Retreat - Rishikesh',
        category: 'workshops',
        description: 'Comprehensive yoga and meditation retreat by the Ganges.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        location: 'Rishikesh, Uttarakhand',
        duration: '7 days',
        price: 15000,
        rating: 4.9,
        reviews: 512,
        ageGroup: 'All',
        difficulty: 'Easy'
      },
      {
        id: '9',
        title: 'Taj Mahal Visit',
        category: 'attractions',
        description: 'Visit the iconic monument of love - Taj Mahal.',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop',
        location: 'Agra, Uttar Pradesh',
        duration: '4 hours',
        price: 1100,
        rating: 5.0,
        reviews: 2500,
        ageGroup: 'All',
        difficulty: 'Easy'
      },
      {
        id: '10',
        title: 'Elephant Visit - Jaipur',
        category: 'attractions',
        description: 'Interact with elephants at the Amber Fort.',
        image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&h=300&fit=crop',
        location: 'Jaipur, Rajasthan',
        duration: '3 hours',
        price: 1800,
        rating: 4.7,
        reviews: 345,
        ageGroup: 'All',
        difficulty: 'Easy'
      },
      {
        id: '11',
        title: 'Backwaters - Kerala',
        category: 'attractions',
        description: 'Experience the serene Kerala backwaters on a houseboat.',
        image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop',
        location: 'Alleppey, Kerala',
        duration: '6 hours',
        price: 3500,
        rating: 4.8,
        reviews: 678,
        ageGroup: 'All',
        difficulty: 'Easy'
      },
      {
        id: '12',
        title: 'Neemrana Fort Visit',
        category: 'attractions',
        description: 'Explore the majestic 16th-century Neemrana Fort.',
        image: 'https://images.unsplash.com/photo-1563448728279-3c7ee19e3d97?w=400&h=300&fit=crop',
        location: 'Neemrana, Rajasthan',
        duration: '5 hours',
        price: 2200,
        rating: 4.6,
        reviews: 234,
        ageGroup: 'All',
        difficulty: 'Easy'
      },
      {
        id: '13',
        title: 'Essel World - Mumbai',
        category: 'theme-parks',
        description: 'India\'s largest amusement park with thrilling rides.',
        image: 'https://images.unsplash.com/photo-1519061080387-7c1d21f4dd66?w=400&h=300&fit=crop',
        location: 'Mumbai, Maharashtra',
        duration: '6 hours',
        price: 1200,
        rating: 4.3,
        reviews: 1234,
        ageGroup: 'All',
        difficulty: 'Moderate'
      },
      {
        id: '14',
        title: 'Dharmashala - Lehar',
        category: 'theme-parks',
        description: 'Fun-filled amusement park experience with family.',
        image: 'https://images.unsplash.com/photo-1599658880436-c61792e70672?w=400&h=300&fit=crop',
        location: 'Noida, Uttar Pradesh',
        duration: '5 hours',
        price: 900,
        rating: 4.4,
        reviews: 876,
        ageGroup: 'All',
        difficulty: 'Easy'
      },
      {
        id: '15',
        title: 'Sea World - Bangalore',
        category: 'theme-parks',
        description: 'Aquarium and underwater experiences.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        location: 'Bangalore, Karnataka',
        duration: '4 hours',
        price: 800,
        rating: 4.5,
        reviews: 567,
        ageGroup: 'All',
        difficulty: 'Easy'
      },
      {
        id: '16',
        title: 'Adventure Island - Chennai',
        category: 'theme-parks',
        description: 'Water rides and adventure activities for the whole family.',
        image: 'https://images.unsplash.com/photo-1575356896861-e0d82b845b79?w=400&h=300&fit=crop',
        location: 'Chennai, Tamil Nadu',
        duration: '6 hours',
        price: 1100,
        rating: 4.2,
        reviews: 432,
        ageGroup: 'All',
        difficulty: 'Moderate'
      }
    ]
    setActivities(activityData)
  }, [])

  const filteredActivities = activities.filter(activity => {
    const matchesCategory = category === 'all' || activity.category === category
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (activityId) => {
    let newFavorites
    if (favorites.includes(activityId)) {
      newFavorites = favorites.filter(id => id !== activityId)
      showToast('Removed from favorites', 'info')
    } else {
      newFavorites = [...favorites, activityId]
      showToast('Added to favorites', 'success')
    }
    setFavorites(newFavorites)
    localStorage.setItem('activityFavorites', JSON.stringify(newFavorites))
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400'
      case 'Moderate': return 'bg-yellow-500/20 text-yellow-400'
      case 'High': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Header Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-[#1A1A1A] via-[#1A2A3A] to-[#1A1A1A]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1200&h=400&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-8 h-full flex flex-col justify-end">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Ticket className="w-8 h-8 text-[#FF0040]" />
            Activities
          </h1>
          <p className="text-gray-400">Adventure, workshops, tourist spots & more</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="sticky top-16 z-40 bg-[#1A1A1A] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                  category === cat.id
                    ? 'bg-[#FF0040] text-white'
                    : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search activities, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF0040]"
          />
        </div>
      </div>

      {/* Activities Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {categories.find(c => c.id === category)?.name}
          </h2>
          <p className="text-gray-400 text-sm">{filteredActivities.length} activities available</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredActivities.map((activity) => (
            <div 
              key={activity.id}
              className="bg-[#1F1F1F] rounded-xl overflow-hidden border border-gray-800 hover:border-[#FF0040] transition-all group card-lift"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Favorite Button */}
                <button 
                  onClick={() => toggleFavorite(activity.id)}
                  className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-[#FF0040] transition-colors"
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(activity.id) ? 'text-[#FF0040] fill-[#FF0040]' : 'text-white'}`} />
                </button>

                {/* Category Badge */}
                <span className="absolute top-3 left-3 px-2 py-1 bg-[#FF0040] text-white text-xs font-semibold rounded">
                  {categories.find(c => c.id === activity.category)?.name}
                </span>

                {/* Difficulty Badge */}
                <span className={`absolute bottom-3 left-3 px-2 py-1 text-xs font-semibold rounded ${getDifficultyColor(activity.difficulty)}`}>
                  {activity.difficulty}
                </span>

                {/* Price */}
                <div className="absolute bottom-3 right-3">
                  <span className="text-white font-bold text-lg">₹{activity.price}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg truncate group-hover:text-[#FF0040] transition-colors">
                  {activity.title}
                </h3>
                
                <div className="flex items-center gap-1 mt-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{activity.location}</span>
                </div>

                <div className="flex items-center gap-3 mt-2 text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{activity.ageGroup}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" fill="#fbbf24" />
                    <span className="text-white font-medium">{activity.rating}</span>
                    <span className="text-gray-500 text-sm">({activity.reviews})</span>
                  </div>
                  <button className="px-4 py-2 bg-[#FF0040] text-white text-sm font-semibold rounded-lg hover:bg-[#CC0033] transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium text-lg">No activities found</h3>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#FF0040] rounded-full" />
          <h2 className="text-xl font-bold text-white">Popular Destinations</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Rishikesh', count: 45, image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=200&h=200&fit=crop' },
            { name: 'Jaipur', count: 38, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200&h=200&fit=crop' },
            { name: 'Goa', count: 32, image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=200&h=200&fit=crop' },
            { name: 'Manali', count: 28, image: 'https://images.unsplash.com/photo-1541976844349-718f9bddad2c?w=200&h=200&fit=crop' },
            { name: 'Bangalore', count: 25, image: 'https://images.unsplash.com/photo-1519467435328-550876bf6e53?w=200&h=200&fit=crop' },
            { name: 'Mumbai', count: 22, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=200&h=200&fit=crop' }
          ].map((dest, i) => (
            <div 
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            >
              <img 
                src={dest.image} 
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="text-white font-semibold">{dest.name}</h3>
                <p className="text-gray-300 text-xs">{dest.count} activities</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Activities
