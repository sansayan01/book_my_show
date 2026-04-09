import { useState, useEffect, lazy, Suspense, memo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import CitySelector from './components/CitySelector/CitySelector'
import { BottomNav } from './components/BottomNav/BottomNav'
import PageTransition from './components/PageTransition/PageTransition'
import AddToHomeScreen from './components/AddToHomeScreen/AddToHomeScreen'
import ErrorBoundary, { PageLoader } from './components/ErrorBoundary/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'

// Lazy load all page components for code splitting
const Home = lazy(() => import('./pages/Home/Home'))
const Movies = lazy(() => import('./pages/Movies/Movies'))
const MovieDetails = lazy(() => import('./pages/MovieDetails/MovieDetails'))
const Events = lazy(() => import('./pages/Events/Events'))
const Sports = lazy(() => import('./pages/Sports/Sports'))
const Plays = lazy(() => import('./pages/Plays/Plays'))
const SeatSelection = lazy(() => import('./pages/SeatSelection/SeatSelection'))
const Checkout = lazy(() => import('./pages/Checkout/Checkout'))
const Payment = lazy(() => import('./pages/Payment/Payment'))
const Confirmation = lazy(() => import('./pages/Confirmation/Confirmation'))
const Profile = lazy(() => import('./pages/Profile/Profile'))
const Stream = lazy(() => import('./pages/Stream/Stream'))
const Activities = lazy(() => import('./pages/Activities/Activities'))
const Login = lazy(() => import('./pages/Login/Login'))
const Register = lazy(() => import('./pages/Register/Register'))
const MyBookings = lazy(() => import('./pages/MyBookings/MyBookings'))
const Admin = lazy(() => import('./pages/Admin/Admin'))
const Offers = lazy(() => import('./pages/Offers/Offers'))
const GiftCards = lazy(() => import('./pages/GiftCards/GiftCards'))
const Discussion = lazy(() => import('./pages/Discussion/Discussion'))
const Premiere = lazy(() => import('./pages/Premiere/Premiere'))
const Collections = lazy(() => import('./pages/Collections/Collections'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const Timeline = lazy(() => import('./pages/Timeline/Timeline'))
const Community = lazy(() => import('./pages/Community/Community'))
const Support = lazy(() => import('./pages/Support/Support'))
const Error404 = lazy(() => import('./pages/Error404/Error404'))
const Error500 = lazy(() => import('./pages/Error500/Error500'))
const PrivacySettings = lazy(() => import('./pages/PrivacySettings/PrivacySettings'))

// Memoized wrapper for lazy loaded pages
const LazyPage = memo(({ children }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
))

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
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main id="main-content" className="flex-1">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<PageTransition><LazyPage><Home /></LazyPage></PageTransition>} />
                    <Route path="/movies" element={<PageTransition><LazyPage><Movies /></LazyPage></PageTransition>} />
                    <Route path="/movie/:id" element={<PageTransition><LazyPage><MovieDetails /></LazyPage></PageTransition>} />
                    <Route path="/events" element={<PageTransition><LazyPage><Events /></LazyPage></PageTransition>} />
                    <Route path="/sports" element={<PageTransition><LazyPage><Sports /></LazyPage></PageTransition>} />
                    <Route path="/plays" element={<PageTransition><LazyPage><Plays /></LazyPage></PageTransition>} />
                    <Route path="/stream" element={<PageTransition><LazyPage><Stream /></LazyPage></PageTransition>} />
                    <Route path="/activities" element={<PageTransition><LazyPage><Activities /></LazyPage></PageTransition>} />
                    <Route path="/premiere" element={<PageTransition><LazyPage><Premiere /></LazyPage></PageTransition>} />
                    <Route path="/collections" element={<PageTransition><LazyPage><Collections /></LazyPage></PageTransition>} />
                    <Route path="/book/:showId" element={<PageTransition><LazyPage><SeatSelection /></LazyPage></PageTransition>} />
                    <Route path="/checkout" element={<PageTransition><LazyPage><Checkout /></LazyPage></PageTransition>} />
                    <Route path="/payment" element={<PageTransition><LazyPage><Payment /></LazyPage></PageTransition>} />
                    <Route path="/success" element={<PageTransition><LazyPage><Confirmation /></LazyPage></PageTransition>} />
                    <Route path="/profile" element={<PageTransition><LazyPage><Profile /></LazyPage></PageTransition>} />
                    <Route path="/login" element={<PageTransition><LazyPage><Login /></LazyPage></PageTransition>} />
                    <Route path="/register" element={<PageTransition><LazyPage><Register /></LazyPage></PageTransition>} />
                    <Route path="/my-bookings" element={<PageTransition><LazyPage><MyBookings /></LazyPage></PageTransition>} />
                    <Route path="/admin" element={<PageTransition><LazyPage><Admin /></LazyPage></PageTransition>} />
                    <Route path="/offers" element={<PageTransition><LazyPage><Offers /></LazyPage></PageTransition>} />
                    <Route path="/gift-cards" element={<PageTransition><LazyPage><GiftCards /></LazyPage></PageTransition>} />
                    <Route path="/discussion" element={<PageTransition><LazyPage><Discussion /></LazyPage></PageTransition>} />
                    <Route path="/dashboard" element={<PageTransition><LazyPage><Dashboard /></LazyPage></PageTransition>} />
                    <Route path="/timeline" element={<PageTransition><LazyPage><Timeline /></LazyPage></PageTransition>} />
                    <Route path="/community" element={<PageTransition><LazyPage><Community /></LazyPage></PageTransition>} />
                    <Route path="/support" element={<PageTransition><LazyPage><Support /></LazyPage></PageTransition>} />
                    <Route path="/privacy" element={<PageTransition><LazyPage><PrivacySettings /></LazyPage></PageTransition>} />
                    
                    {/* Error Pages */}
                    <Route path="/404" element={<PageTransition><LazyPage><Error404 /></LazyPage></PageTransition>} />
                    <Route path="/500" element={<PageTransition><LazyPage><Error500 /></LazyPage></PageTransition>} />
                    
                    {/* Catch-all route for 404 */}
                    <Route path="*" element={<PageTransition><LazyPage><Error404 /></LazyPage></PageTransition>} />
                  </Routes>
                </AnimatePresence>
              </main>
              <Footer />
              <BottomNav />
              <CitySelector isOpen={showCitySelector} onClose={handleCityConfirm} />
              <AddToHomeScreen />
            </div>
          </ErrorBoundary>
        </Router>
      </BookingProvider>
    </AuthProvider>
  )
}

export default App
