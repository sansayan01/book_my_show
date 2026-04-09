import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import CitySelector from './components/CitySelector/CitySelector'
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
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/events" element={<Events />} />
                <Route path="/sports" element={<Sports />} />
                <Route path="/plays" element={<Plays />} />
                <Route path="/stream" element={<Stream />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/book/:showId" element={<SeatSelection />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/success" element={<Confirmation />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/gift-cards" element={<GiftCards />} />
                <Route path="/discussion" element={<Discussion />} />
              </Routes>
            </main>
            <Footer />
            <CitySelector isOpen={showCitySelector} onClose={handleCityConfirm} />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  )
}

export default App
