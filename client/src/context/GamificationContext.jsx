import { createContext, useContext, useState, useEffect } from 'react'

// Sample achievements
export const achievements = [
  {
    id: 'first_booking',
    name: 'First Steps',
    description: 'Book your first movie ticket',
    icon: '🎬',
    points: 100,
    requirement: 1
  },
  {
    id: 'movie_buff',
    name: 'Movie Buff',
    description: 'Book 5 movies',
    icon: '🍿',
    points: 250,
    requirement: 5
  },
  {
    id: 'cinema_fanatic',
    name: 'Cinema Fanatic',
    description: 'Book 10 movies',
    icon: '🎥',
    points: 500,
    requirement: 10
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Book tickets 7+ days in advance',
    icon: '🌅',
    points: 150,
    requirement: 1
  },
  {
    id: 'gold_member',
    name: 'Gold Member',
    description: 'Become a Gold member',
    icon: '💎',
    points: 1000,
    requirement: 1
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain 7-day booking streak',
    icon: '💪',
    points: 300,
    requirement: 7
  },
  {
    id: 'month_master',
    name: 'Month Master',
    description: 'Maintain 30-day booking streak',
    icon: '👑',
    points: 1000,
    requirement: 30
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Share 3 movie reviews',
    icon: '🦋',
    points: 200,
    requirement: 3
  },
  {
    id: 'premiere_exclusive',
    name: 'Premiere Exclusive',
    description: 'Watch a premiere show',
    icon: '⭐',
    points: 400,
    requirement: 1
  },
  {
    id: 'vip_tier',
    name: 'VIP',
    description: 'Reach VIP tier status',
    icon: '🏆',
    points: 2000,
    requirement: 1
  },
  {
    id: 'mega_fan',
    name: 'Mega Fan',
    description: 'Book 50 movies',
    icon: '🚀',
    points: 2500,
    requirement: 50
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Book 100 movies',
    icon: '🌟',
    points: 5000,
    requirement: 100
  }
]

// Leaderboard data
export const leaderboardData = [
  { id: '1', name: 'Priya S.', avatar: '👩‍💼', points: 15420, streak: 45, rank: 1 },
  { id: '2', name: 'Rahul M.', avatar: '👨‍💻', points: 12850, streak: 32, rank: 2 },
  { id: '3', name: 'Ananya K.', avatar: '👩‍🎨', points: 11340, streak: 28, rank: 3 },
  { id: '4', name: 'Vikram J.', avatar: '👨‍🔬', points: 9870, streak: 21, rank: 4 },
  { id: '5', name: 'Sneha P.', avatar: '👩‍🏫', points: 8540, streak: 18, rank: 5 },
  { id: '6', name: 'Arjun R.', avatar: '👨‍🎓', points: 7230, streak: 15, rank: 6 },
  { id: '7', name: 'Kavya N.', avatar: '👩‍🔧', points: 6890, streak: 14, rank: 7 },
  { id: '8', name: 'Dev S.', avatar: '👨‍🚀', points: 5450, streak: 12, rank: 8 },
  { id: '9', name: 'Meera L.', avatar: '👩‍🎤', points: 4320, streak: 9, rank: 9 },
  { id: '10', name: 'Rohan K.', avatar: '👨‍🎸', points: 3890, streak: 7, rank: 10 }
]

const GamificationContext = createContext()

export const GamificationProvider = ({ children }) => {
  const [userPoints, setUserPoints] = useState(0)
  const [userStreak, setUserStreak] = useState(0)
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [totalBookings, setTotalBookings] = useState(0)
  const [lastBookingDate, setLastBookingDate] = useState(null)
  const [bookingsThisMonth, setBookingsThisMonth] = useState(0)

  // Load from localStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem('user_points')
    const savedStreak = localStorage.getItem('user_streak')
    const savedAchievements = localStorage.getItem('unlocked_achievements')
    const savedTotalBookings = localStorage.getItem('total_bookings')
    const savedLastBookingDate = localStorage.getItem('last_booking_date')
    const savedBookingsThisMonth = localStorage.getItem('bookings_this_month')

    if (savedPoints) setUserPoints(parseInt(savedPoints))
    if (savedStreak) setUserStreak(parseInt(savedStreak))
    if (savedAchievements) setUnlockedAchievements(JSON.parse(savedAchievements))
    if (savedTotalBookings) setTotalBookings(parseInt(savedTotalBookings))
    if (savedLastBookingDate) setLastBookingDate(savedLastBookingDate)
    if (savedBookingsThisMonth) setBookingsThisMonth(parseInt(savedBookingsThisMonth))
  }, [])

  // Calculate rank
  const getRank = () => {
    if (userPoints >= 15000) return 1
    if (userPoints >= 12000) return 2
    if (userPoints >= 10000) return 3
    if (userPoints >= 8000) return 4
    if (userPoints >= 6000) return 5
    if (userPoints >= 4000) return 6
    if (userPoints >= 2000) return 7
    if (userPoints >= 1000) return 8
    if (userPoints >= 500) return 9
    return 10
  }

  // Get progress to next achievement
  const getProgressToNextAchievement = () => {
    const milestones = [0, 500, 1000, 2000, 5000, 10000, 15000]
    for (let i = milestones.length - 1; i >= 0; i--) {
      if (userPoints >= milestones[i]) {
        const currentMilestone = milestones[i]
        const nextMilestone = milestones[i + 1] || milestones[i] * 2
        return Math.round(((userPoints - currentMilestone) / (nextMilestone - currentMilestone)) * 100)
      }
    }
    return 0
  }

  // Get next milestone
  const getNextMilestone = () => {
    const milestones = [500, 1000, 2000, 5000, 10000, 15000, 30000]
    for (const milestone of milestones) {
      if (userPoints < milestone) return milestone
    }
    return 30000
  }

  // Add points
  const addPoints = (points, reason) => {
    const newPoints = userPoints + points
    setUserPoints(newPoints)
    localStorage.setItem('user_points', newPoints.toString())
    
    // Check for new achievements
    checkAchievements()
  }

  // Record booking
  const recordBooking = () => {
    const today = new Date().toDateString()
    
    setTotalBookings(prev => prev + 1)
    localStorage.setItem('total_bookings', (totalBookings + 1).toString())
    
    // Update streak
    if (lastBookingDate) {
      const lastDate = new Date(lastBookingDate)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        const newStreak = userStreak + 1
        setUserStreak(newStreak)
        localStorage.setItem('user_streak', newStreak.toString())
      } else if (diffDays > 1) {
        setUserStreak(1)
        localStorage.setItem('user_streak', '1')
      }
    } else {
      setUserStreak(1)
      localStorage.setItem('user_streak', '1')
    }
    
    setLastBookingDate(today)
    localStorage.setItem('last_booking_date', today)
    
    // Check for achievements
    checkAchievements()
  }

  // Check and unlock achievements
  const checkAchievements = () => {
    const newUnlocked = []
    
    // First booking
    if (totalBookings >= 0 && !unlockedAchievements.includes('first_booking')) {
      newUnlocked.push({ id: 'first_booking', points: 100 })
    }
    
    // Movie buff
    if (totalBookings >= 5 && !unlockedAchievements.includes('movie_buff')) {
      newUnlocked.push({ id: 'movie_buff', points: 250 })
    }
    
    // Cinema fanatic
    if (totalBookings >= 10 && !unlockedAchievements.includes('cinema_fanatic')) {
      newUnlocked.push({ id: 'cinema_fanatic', points: 500 })
    }
    
    // Mega fan
    if (totalBookings >= 50 && !unlockedAchievements.includes('mega_fan')) {
      newUnlocked.push({ id: 'mega_fan', points: 2500 })
    }
    
    // Legend
    if (totalBookings >= 100 && !unlockedAchievements.includes('legend')) {
      newUnlocked.push({ id: 'legend', points: 5000 })
    }
    
    // Streak achievements
    if (userStreak >= 7 && !unlockedAchievements.includes('week_warrior')) {
      newUnlocked.push({ id: 'week_warrior', points: 300 })
    }
    
    if (userStreak >= 30 && !unlockedAchievements.includes('month_master')) {
      newUnlocked.push({ id: 'month_master', points: 1000 })
    }
    
    if (newUnlocked.length > 0) {
      const achievementIds = newUnlocked.map(a => a.id)
      setUnlockedAchievements([...unlockedAchievements, ...achievementIds])
      localStorage.setItem('unlocked_achievements', JSON.stringify([...unlockedAchievements, ...achievementIds]))
      
      // Add points for achievements
      newUnlocked.forEach(achievement => {
        addPoints(achievement.points, `Achievement: ${achievement.id}`)
      })
    }
  }

  return (
    <GamificationContext.Provider value={{
      userPoints,
      userStreak,
      unlockedAchievements,
      totalBookings,
      bookingsThisMonth,
      addPoints,
      recordBooking,
      checkAchievements,
      getRank,
      getProgressToNextAchievement,
      getNextMilestone,
      leaderboardData
    }}>
      {children}
    </GamificationContext.Provider>
  )
}

export const useGamification = () => useContext(GamificationContext)
