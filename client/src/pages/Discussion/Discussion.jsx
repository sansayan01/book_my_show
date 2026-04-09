import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MessageCircle, Users, ThumbsUp, ThumbsDown, Share2, 
  Bookmark, Search, Filter, TrendingUp, Clock, Flame,
  Film, Plus, MoreHorizontal, Reply, Send, Heart,
  Eye, Pin
} from 'lucide-react'

const Discussion = () => {
  const [activeTab, setActiveTab] = useState('trending')
  const [showNewPost, setShowNewPost] = useState(false)
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [selectedMovie, setSelectedMovie] = useState('')
  const [likedPosts, setLikedPosts] = useState(new Set([1, 3]))
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set([2]))

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'hot', label: 'Hot', icon: Flame },
  ]

  const posts = [
    {
      id: 1,
      title: 'Pushpa 2: The Rule - Best Action Scene Ever?',
      content: "I just watched Pushpa 2 and the interval block is absolutely insane! The way Allu Arjun performs those steps while fighting... chills every time. What's your favorite scene from the movie?",
      author: 'Cinephile_2024',
      authorAvatar: 'C',
      movie: 'Pushpa 2',
      movieId: 1,
      likes: 234,
      comments: 89,
      views: 5600,
      timeAgo: '2 hours ago',
      isPinned: true,
      tags: ['Action', 'Review', 'AlluArjun'],
    },
    {
      id: 2,
      title: 'Dhoom 4: Fan Theory - What Really Happened?',
      content: "After watching Dhoom 4 twice, I've noticed some mind-blowing details that connect to the original Dhoom! Let me break down the hidden connections and what they might mean for the franchise's future. **SPOILERS AHEAD**",
      author: 'MysterySolver',
      authorAvatar: 'M',
      movie: 'Dhoom 4',
      movieId: 2,
      likes: 567,
      comments: 156,
      views: 12000,
      timeAgo: '5 hours ago',
      tags: ['Theory', 'Spoilers', 'Dhoom'],
    },
    {
      id: 3,
      title: 'Animal - Is Ranbir Kapoor\'s Acting Overrated?',
      content: "I know this might be controversial, but after watching Animal, I feel like Ranbir's performance was... good but not Oscar-worthy as some people claim. The movie had great cinematography but the runtime was a killer. Thoughts?",
      author: 'MovieBuff_Mumbai',
      authorAvatar: 'M',
      movie: 'Animal',
      movieId: 3,
      likes: 189,
      comments: 342,
      views: 8900,
      timeAgo: '1 day ago',
      tags: ['Discussion', 'Opinion', 'RanbirKapoor'],
    },
    {
      id: 4,
      title: 'Upcoming Movies in 2026 - What Are You Most Excited For?',
      content: "With so many big releases announced for 2026, which movies are you most looking forward to? I'm personally excited for the new Marvel films and hopefully more South Indian dubs!",
      author: 'FilmEnthusiast',
      authorAvatar: 'F',
      movie: null,
      likes: 445,
      comments: 234,
      views: 15000,
      timeAgo: '1 day ago',
      tags: ['Upcoming', '2026', 'Discussion'],
    },
    {
      id: 5,
      title: 'Jawan - Shah Rukh Khan\'s Best Comeback?',
      content: "Rewatched Jawan yesterday and it's still so good! SRK's energy, the action sequences, the social message... everything hits different. It's definitely in my top 5 SRK movies. What do you think?",
      author: 'SRKArmy_Forever',
      authorAvatar: 'S',
      movie: 'Jawan',
      movieId: 4,
      likes: 678,
      comments: 198,
      views: 21000,
      timeAgo: '2 days ago',
      tags: ['SRK', 'Action', 'Review'],
    },
    {
      id: 6,
      title: 'Theatres vs OTT - Where Should Movies Release First?',
      content: "With more films going directly to OTT, the debate continues. As a movie lover, I still prefer the theatrical experience but OTT has its own charm. Where do you think movies should release first?",
      author: 'CinemaLover',
      authorAvatar: 'C',
      movie: null,
      likes: 312,
      comments: 456,
      views: 9800,
      timeAgo: '3 days ago',
      tags: ['OTT', 'Theatres', 'Debate'],
    },
  ]

  const popularMovies = [
    { name: 'Pushpa 2', discussions: 1245 },
    { name: 'Dhoom 4', discussions: 987 },
    { name: 'Animal', discussions: 756 },
    { name: 'Jawan', discussions: 654 },
    { name: 'Tiger 3', discussions: 543 },
  ]

  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const toggleBookmark = (postId) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const handleSubmitPost = (e) => {
    e.preventDefault()
    // In real app, this would submit to backend
    setShowNewPost(false)
    setPostTitle('')
    setPostContent('')
    setSelectedMovie('')
  }

  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      {/* Header */}
      <div className="bg-[#1F1F1F] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-[#FF0040]" />
              <div>
                <h1 className="text-xl font-bold text-white">Movie Discussions</h1>
                <p className="text-gray-400 text-sm">Talk about your favorite movies</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewPost(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF0040] text-white rounded-lg font-medium hover:bg-[#CC0033] transition-colors"
            >
              <Plus className="w-5 h-5" /> New Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 bg-[#1F1F1F] p-1 rounded-xl w-fit">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#FF0040] text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.map(post => (
                <div 
                  key={post.id} 
                  className={`bg-[#1F1F1F] rounded-xl p-6 ${post.isPinned ? 'border-2 border-[#FF0040]/50' : ''}`}
                >
                  {post.isPinned && (
                    <div className="flex items-center gap-2 text-[#FF0040] text-sm mb-3">
                      <Pin className="w-4 h-4" /> Pinned by Admin
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#2A2A2A] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {post.authorAvatar}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold">{post.author}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-500 text-sm">{post.timeAgo}</span>
                          </div>
                          {post.movie && (
                            <Link 
                              to={`/movie/${post.movieId}`}
                              className="inline-flex items-center gap-1 text-sm text-[#FF0040] hover:underline mb-2"
                            >
                              <Film className="w-3 h-3" /> {post.movie}
                            </Link>
                          )}
                        </div>
                        <button className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      <Link to={`/discussion/${post.id}`} className="block group">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FF0040] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 line-clamp-3">{post.content}</p>
                      </Link>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-[#2A2A2A] text-gray-400 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-800">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-2 transition-colors ${
                            likedPosts.has(post.id) ? 'text-[#FF0040]' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                        </button>
                        
                        <Link 
                          to={`/discussion/${post.id}`}
                          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.comments}</span>
                        </Link>
                        
                        <div className="flex items-center gap-2 text-gray-400">
                          <Eye className="w-5 h-5" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        
                        <button
                          onClick={() => toggleBookmark(post.id)}
                          className={`ml-auto transition-colors ${
                            bookmarkedPosts.has(post.id) ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <Bookmark className={`w-5 h-5 ${bookmarkedPosts.has(post.id) ? 'fill-current' : ''}`} />
                        </button>
                        
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                className="w-full pl-10 pr-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
              />
            </div>

            {/* Popular Movies */}
            <div className="bg-[#1F1F1F] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-[#FF0040]" /> Trending Movies
              </h3>
              <div className="space-y-3">
                {popularMovies.map((movie, i) => (
                  <div key={movie.name} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 w-4">{i + 1}</span>
                      <span className="text-white group-hover:text-[#FF0040] transition-colors">{movie.name}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{movie.discussions}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-[#1F1F1F] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-5 h-5" /> Members
                  </div>
                  <span className="text-white font-semibold">45.2K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MessageCircle className="w-5 h-5" /> Discussions
                  </div>
                  <span className="text-white font-semibold">12.8K</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Heart className="w-5 h-5" /> Posts Today
                  </div>
                  <span className="text-white font-semibold">328</span>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-[#1F1F1F] rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0040]">•</span>
                  Be respectful to fellow movie lovers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0040]">•</span>
                  No spoilers without warning
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0040]">•</span>
                  Keep discussions related to movies
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF0040]">•</span>
                  No hate speech or harassment
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F1F1F] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Create New Post</h3>
              <button 
                onClick={() => setShowNewPost(false)}
                className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitPost} className="p-6 space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Related Movie (Optional)</label>
                <select
                  value={selectedMovie}
                  onChange={(e) => setSelectedMovie(e.target.value)}
                  className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white"
                >
                  <option value="">Select a movie</option>
                  <option value="1">Pushpa 2</option>
                  <option value="2">Dhoom 4</option>
                  <option value="3">Animal</option>
                  <option value="4">Jawan</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Title</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Enter a catchy title..."
                  required
                  className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040]"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Content</label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF0040] resize-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
                  className="flex-1 py-3 border border-gray-700 rounded-lg text-gray-400 hover:bg-[#2A2A2A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#FF0040] rounded-lg text-white font-medium hover:bg-[#CC0033] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" /> Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Discussion
