# BookMyShow Clone - Technical Specification

## Project Overview
- **Project Name:** Book My Show Clone
- **Type:** Full Stack Web Application (Movie & Events Booking Platform)
- **Core Functionality:** A complete movie and events booking platform with seat selection, showtimes, payments, and user management
- **Target Users:** Movie/enthusiasts looking to book tickets online

## Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** TailwindCSS
- **State Management:** React Context + useState
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **Password:** bcryptjs

## UI/UX Specification

### Color Palette
- **Primary:** #F84565 (BookMyShow Red/Pink)
- **Secondary:** #2A9D8F (Teal accent)
- **Dark:** #1A1A1A (Background)
- **Light:** #FFFFFF
- **Gray:** #6B7280, #9CA3AF
- **Success:** #10B981
- **Warning:** #F59E0B

### Typography
- **Primary Font:** 'DM Sans', sans-serif
- **Headings:** Bold, sizes: 48px, 36px, 24px, 20px, 16px
- **Body:** Regular, 14px, 16px

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Layout Structure
- **Header:** Sticky navbar with logo, city selector, search, user menu
- **Hero:** Featured banner carousel
- **Content:** Grid-based movie/event cards
- **Footer:** Links, social, copyright

## Pages & Features

### 1. Homepage (`/`)
- City selector dropdown
- Featured banner carousel (5 slides)
- Quick bookings section
- Trending movies grid (horizontal scroll)
- Popular events section
- Stream (OTT) section
- Sports section

### 2. Movies Page (`/movies`)
- Filter bar (language, genre, format)
- Movie cards grid
- Sort by: popularity, release date, rating

### 3. Movie Details Page (`/movie/:id`)
- Movie poster and info
- Movie trailer embed
- Cast & crew section
- Showtime selection by date
- Book tickets CTA

### 4. Seat Selection Page (`/book/:showId`)
- Screen visualization
- Seat grid (Standard, Premium, VIP categories)
- Price display per category
- Selected seats summary
- Proceed to checkout

### 5. Checkout Page (`/checkout`)
- Order summary
- Apply promo code
- Payment method selection
- Total calculation

### 6. Payment Page (`/payment`)
- Mock payment integration (Razorpay-style)
- Success/Failure states

### 7. Confirmation Page (`/success`)
- Booking confirmation
- Ticket details
- Download ticket option

### 8. User Profile (`/profile`)
- My bookings list
- Profile settings
- Logout

### 9. Authentication
- Login/Signup modals
- Google OAuth button
- JWT-based session

## API Endpoints

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - List all movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/featured` - Get featured movies

### Shows
- `GET /api/shows?movieId=:id` - Get showtimes for movie
- `GET /api/shows/:id` - Get show details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details

## Data Models

### User
```javascript
{
  name: String,
  email: String,
  password: String,
  phone: String,
  avatar: String,
  createdAt: Date
}
```

### Movie
```javascript
{
  title: String,
  description: String,
  poster: String,
  backdrop: String,
  releaseDate: Date,
  duration: Number,
  genre: [String],
  language: String,
  rating: Number,
  cast: [{ name: String, role: String, image: String }],
  director: String,
  trailer: String
}
```

### Show
```javascript
{
  movieId: ObjectId,
  theatre: String,
  city: String,
  date: Date,
  time: String,
  screen: String,
  seats: [{
    row: String,
    number: Number,
    category: String,
    price: Number,
    available: Boolean
  }]
}
```

### Booking
```javascript
{
  userId: ObjectId,
  showId: ObjectId,
  seats: [{ row: String, number: Number }],
  totalAmount: Number,
  status: String,
  paymentId: String,
  createdAt: Date
}
```

## Component Structure

```
src/
├── components/
│   ├── Header/
│   ├── Footer/
│   ├── MovieCard/
│   ├── EventCard/
│   ├── SeatSelector/
│   ├── ShowtimeSelector/
│   ├── FilterBar/
│   ├── Banner/
│   └── AuthModal/
├── pages/
│   ├── Home/
│   ├── Movies/
│   ├── MovieDetails/
│   ├── SeatSelection/
│   ├── Checkout/
│   ├── Payment/
│   ├── Confirmation/
│   └── Profile/
├── context/
│   ├── AuthContext/
│   └── BookingContext/
├── services/
│   └── api.js
└── utils/
    └── helpers.js
```

## Acceptance Criteria

1. ✅ Homepage loads with featured movies and events
2. ✅ User can browse movies by category and filter
3. ✅ User can view movie details with showtimes
4. ✅ User can select seats from interactive seat grid
5. ✅ User can complete checkout flow
6. ✅ User can view their booking history
7. ✅ Responsive design works on mobile/tablet/desktop
8. ✅ Smooth animations and transitions
9. ✅ GitHub repo updated every 30 minutes with progress
