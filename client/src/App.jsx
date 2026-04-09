import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import CitySelector from './components/CitySelector/CitySelector'
import { BottomNav } from './components/BottomNav/BottomNav'
import PageTransition from './components/PageTransition/PageTransition'
import AddToHomeScreen from './components/AddToHomeScreen/AddToHomeScreen'
import Home from './pages/Home/Home'
import Movies from './pages/Movies/Movies'
import MovieDetails from './pages/MovieDetails/MovieDetails'
import Events from './pages/Events/Events'
import Sports from './pages/Sports/Sports'
import Plays from './pages/Plays/Plays'
import SeatSelection from './pages/SeatSelection/SeatSelection'
import Checkout from './pages/Checkout/Checkout'
import Payment from './pages/Payment/Payment'
import Confirmation from './pages/Confirmation/Confirmation'
import Profile from './pages/Profile/Profile'
import Stream from './pages/Stream/Stream'
import Activities from './pages/Activities/Activities'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import MyBookings from './pages/MyBookings/MyBookings'
import Admin from './pages/Admin/Admin'
import Offers from './pages/Offers/Offers'
import GiftCards from './pages/GiftCards/GiftCards'
import Discussion from './pages/Discussion/Discussion'
import Premiere from './pages/Premiere/Premiere'
import Collections from './pages/Collections/Collections'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'

function App() {
  const [showCitySelector, setShowCitySelector] = useState(false)

  useEffect(() => {
    const citySelected = localStorage.getItem('citySelected')
    if (!citySelected) {
      setShowCitySelector(true)
    }
  }, [])

  const handleCityConfirm = () => {
    setShowCitySelector(false)
  }

  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                  <Route path="/movies" element={<PageTransition><Movies /></PageTransition>} />
                  <Route path="/movie/:id" element={<PageTransition><MovieDetails /></PageTransition>} />
                  <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
                  <Route path="/sports" element={<PageTransition><Sports /></PageTransition>} />
                  <Route path="/plays" element={<PageTransition><Plays /></PageTransition>} />
                  <Route path="/stream" element={<PageTransition><Stream /></PageTransition>} />
                  <Route path="/activities" element={<PageTransition><Activities /></PageTransition>} />
                  <Route path="/premiere" element={<PageTransition><Premiere /></PageTransition>} />
                  <Route path="/collections" element={<PageTransition><Collections /></PageTransition>} />
                  <Route path="/book/:showId" element={<PageTransition><SeatSelection /></PageTransition>} />
                  <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
                  <Route path="/payment" element={<PageTransition><Payment /></PageTransition>} />
                  <Route path="/success" element={<PageTransition><Confirmation /></PageTransition>} />
                  <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
                  <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                  <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                  <Route path="/my-bookings" element={<PageTransition><MyBookings /></PageTransition>} />
                  <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
                  <Route path="/offers" element={<PageTransition><Offers /></PageTransition>} />
                  <Route path="/gift-cards" element={<PageTransition><GiftCards /></PageTransition>} />
                  <Route path="/discussion" element={<PageTransition><Discussion /></PageTransition>} />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
            <BottomNav />
            <CitySelector isOpen={showCitySelector} onClose={handleCityConfirm} />
            <AddToHomeScreen />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  )
}

export default App
