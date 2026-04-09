import { useState } from 'react'
import { Trophy, Medal, Star, Zap, Flame, TrendingUp, X, ChevronRight, Lock, Check, Crown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGamification, achievements, leaderboardData } from '../../context/GamificationContext'

const Gamification = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('achievements')
  const { 
    userPoints, 
    userStreak, 
    unlockedAchievements, 
    getRank,
    getProgressToNextAchievement,
    getNextMilestone,
    leaderboardData: globalLeaderboard 
  } = useGamification()

  const rank = getRank()
  const progress = getProgressToNextAchievement()
  const nextMilestone = getNextMilestone()

  const tabs = [
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
    { id: 'streaks', label: 'Streaks', icon: Flame }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1A1A1A] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-r from-[#FF0040] to-[#FF6B35]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* User Stats */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Rewards & Achievements</h2>
                <p className="text-white/80 text-sm">Keep booking to unlock more rewards!</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <span className="text-2xl font-bold text-white">{userPoints.toLocaleString()}</span>
                </div>
                <p className="text-white/70 text-xs">Points</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-orange-300 fill-orange-300" />
                  <span className="text-2xl font-bold text-white">{userStreak}</span>
                </div>
                <p className="text-white/70 text-xs">Day Streak</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-amber-300" />
                  <span className="text-2xl font-bold text-white">#{rank}</span>
                </div>
                <p className="text-white/70 text-xs">Rank</p>
              </div>
            </div>

            {/* Progress to next level */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/80">Progress to next milestone</span>
                <span className="text-white font-medium">{userPoints} / {nextMilestone}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#FF0040] border-b-2 border-[#FF0040]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'achievements' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {achievements.map(achievement => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id)
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative p-4 rounded-xl border ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-[#FF0040]/20 to-[#FF6B35]/20 border-[#FF0040]/30'
                          : 'bg-[#2A2A2A] border-gray-700'
                      }`}
                    >
                      {isUnlocked && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className={`text-3xl mb-2 ${!isUnlocked && 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-yellow-500">{achievement.points} pts</span>
                      </div>
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                          <Lock className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="space-y-3">
                {/* Top 3 podium */}
                <div className="flex items-end justify-center gap-4 mb-8">
                  {/* 2nd place */}
                  {globalLeaderboard[1] && (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center text-2xl mx-auto mb-2 ring-4 ring-gray-600">
                        {globalLeaderboard[1].avatar}
                      </div>
                      <p className="text-white font-medium text-sm truncate max-w-20">{globalLeaderboard[1].name}</p>
                      <p className="text-gray-400 text-xs">{globalLeaderboard[1].points.toLocaleString()} pts</p>
                      <div className="mt-2 text-2xl">🥈</div>
                    </div>
                  )}
                  {/* 1st place */}
                  {globalLeaderboard[0] && (
                    <div className="text-center">
                      <Crown className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-3xl mx-auto mb-2 ring-4 ring-yellow-400">
                        {globalLeaderboard[0].avatar}
                      </div>
                      <p className="text-white font-semibold truncate max-w-24">{globalLeaderboard[0].name}</p>
                      <p className="text-yellow-400 text-xs">{globalLeaderboard[0].points.toLocaleString()} pts</p>
                      <div className="mt-2 text-3xl">🥇</div>
                    </div>
                  )}
                  {/* 3rd place */}
                  {globalLeaderboard[2] && (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-amber-700 flex items-center justify-center text-2xl mx-auto mb-2 ring-4 ring-amber-600">
                        {globalLeaderboard[2].avatar}
                      </div>
                      <p className="text-white font-medium text-sm truncate max-w-20">{globalLeaderboard[2].name}</p>
                      <p className="text-gray-400 text-xs">{globalLeaderboard[2].points.toLocaleString()} pts</p>
                      <div className="mt-2 text-2xl">🥉</div>
                    </div>
                  )}
                </div>

                {/* Rest of leaderboard */}
                <div className="space-y-2">
                  {globalLeaderboard.slice(3).map((entry, idx) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-4 p-3 bg-[#2A2A2A] rounded-lg"
                    >
                      <span className="w-8 text-center text-gray-400 font-medium">#{entry.rank}</span>
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                        {entry.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{entry.name}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {entry.points.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            {entry.streak} days
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'streaks' && (
              <div className="space-y-6">
                {/* Current Streak */}
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6 text-center">
                  <Flame className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-4xl font-bold text-white mb-2">{userStreak}</h3>
                  <p className="text-gray-400">Day Streak</p>
                  {userStreak >= 7 && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full">
                      <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                      <span className="text-orange-400 text-sm font-medium">On Fire! Keep it up!</span>
                    </div>
                  )}
                </div>

                {/* Streak Milestones */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Streak Milestones</h4>
                  <div className="space-y-3">
                    {[
                      { days: 5, reward: '50 bonus points', icon: '🔥' },
                      { days: 7, reward: '100 bonus points + Week Warrior badge', icon: '💪' },
                      { days: 14, reward: '200 bonus points', icon: '⭐' },
                      { days: 30, reward: '500 bonus points + Month Master badge', icon: '👑' }
                    ].map(milestone => {
                      const achieved = userStreak >= milestone.days
                      return (
                        <div
                          key={milestone.days}
                          className={`flex items-center gap-4 p-4 rounded-lg ${
                            achieved ? 'bg-green-500/20 border border-green-500/30' : 'bg-[#2A2A2A]'
                          }`}
                        >
                          <span className="text-2xl">{milestone.icon}</span>
                          <div className="flex-1">
                            <p className={`font-medium ${achieved ? 'text-green-400' : 'text-gray-400'}`}>
                              {milestone.days} Days
                            </p>
                            <p className="text-sm text-gray-500">{milestone.reward}</p>
                          </div>
                          {achieved ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Tips to maintain streak */}
                <div className="bg-[#2A2A2A] rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FF0040]" />
                    Tips to maintain your streak
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Book tickets daily to keep your streak alive</li>
                    <li>• Set reminders for upcoming movies</li>
                    <li>• Plan ahead - you can pre-book shows up to 7 days in advance</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Gamification
