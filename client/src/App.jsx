import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Movies from './pages/Movies/Movies'
import MovieDetails from './pages/MovieDetails/MovieDetails'
import SeatSelection from './pages/SeatSelection/SeatSelection'
import Checkout from './pages/Checkout/Checkout'
import Payment from './pages/Payment/Payment'
import Confirmation from './pages/Confirmation/Confirmation'
import Profile from './pages/Profile/Profile'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'

function App() {
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
                <Route path="/book/:showId" element={<SeatSelection />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/success" element={<Confirmation />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  )
}

export default App
