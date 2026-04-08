const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const Show = require('../models/Show');

dotenv.config();

// Movie data with realistic Indian movie information
const movies = [
  {
    title: "Stree 2",
    description: "Stree is back! A ghost appears in Chanderi, but this time the villagers are baffled as she's not the same Stree they dealt with before. The horror comedy continues as the townspeople must once again seek help from the tailor who previously saved them.",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/Stree_2_poster.jpg/220px-Stree_2_poster.jpg",
    backdrop: "https://upload.wikimedia.org/wikipedia/en/0/0e/Stree_2_poster.jpg",
    releaseDate: new Date("2024-08-15"),
    duration: 150,
    genre: ["Comedy", "Horror"],
    language: "Hindi",
    rating: 8.2,
    voteCount: 12500,
    popularity: 95,
    isFeatured: true,
    isNowShowing: true,
    cast: [
      { name: "Shraddha Kapoor", role: "Stree", image: "https://upload.wikimedia.org/wikipedia/en/7/77/Shraddha_Kapoor_pink_dress.jpg" },
      { name: "Rajkummar Rao", role: "Vicky", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Rajkumar_Rao_at_Launch_of _Livpure_Healthy_Living_ Campaign_%28cropped%29.jpg/220px-Rajkumar_Rao_at_Launch_of _Livpure_Healthy_Living_ Campaign_%28cropped%29.jpg" },
      { name: "Pankaj Tripathi", role: "Sharad", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Pankaj_Tripathi_at_ICFDA_2023_%28cropped%29.jpg/220px-Pankaj_Tripathi_at_ICFDA_2023_%28cropped%29.jpg" }
    ],
    director: "Amar Kaushik",
    trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    title: "Dhadak 2",
    description: "Years after the events of Dhadak, the story follows the next generation as they navigate love, ambition, and family expectations in the competitive world of Bollywood.",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Dhadak_2_poster.jpg/220px-Dhadak_2_poster.jpg",
    backdrop: "https://upload.wikimedia.org/wikipedia/en/9/9a/Dhadak_2_poster.jpg",
    releaseDate: new Date("2024-11-01"),
    duration: 165,
    genre: ["Drama", "Romance"],
    language: "Hindi",
    rating: 7.8,
    voteCount: 8200,
    popularity: 88,
    isFeatured: true,
    isNowShowing: true,
    cast: [
      { name: "Shahid Kapoor", role: "Akshay", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Shahid_Kapoor_promoting_Jab_Harry_Met_Sejal.jpg/220px-Shahid_Kapoor_promoting_Jab_Harry_Met_Sejal.jpg" },
      { name: "Mrunal Thakur", role: "Rhea", image: "https://upload.wikimedia.org/wikipedia/en/c/c5/Mrunal_Thakur_promoting_Mohnesh_Bahl.jpg" }
    ],
    director: "Parchand Ghodke",
    trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    title: "Pushpa 2: The Rule",
    description: "The vendetta continues as Pushpa Raj faces the might of the police force and political rivals. Allu Arjun delivers another action-packed performance in this sequel to the blockbuster Pushpa.",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Pushpa_2_The_Rule.jpg/220px-Pushpa_2_The_Rule.jpg",
    backdrop: "https://upload.wikimedia.org/wikipedia/en/d/d3/Pushpa_2_The_Rule.jpg",
    releaseDate: new Date("2024-12-05"),
    duration: 180,
    genre: ["Action", "Thriller"],
    language: "Telugu",
    rating: 8.5,
    voteCount: 25000,
    popularity: 98,
    isFeatured: true,
    isNowShowing: true,
    cast: [
      { name: "Allu Arjun", role: "Pushpa Raj", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Allu_Arjun_promoting_%27Pushpa%27.jpg/220px-Allu_Arjun_promoting_%27Pushpa%27.jpg" },
      { name: "Rashmika Mandanna", role: "Srividya", image: "https://upload.wikimedia.org/wikipedia/en/c/c4/Rashmika_Mandanna_promoting_Saananaki.jpg" },
      { name: "Fahadh Faasil", role: "Bhanwar Singh", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Fahadh_Faasil_at_the_IIFA_Urdu_2018_%28cropped%29.jpg/220px-Fahadh_Faasil_at_the_IIFA_Urdu_2018_%28cropped%29.jpg" }
    ],
    director: "Sukumar",
    trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    title: "Jawan",
    description: "A high-octane action drama about a man who embarks on a mission to expose corruption and bring justice. Shah Rukh Khan delivers a power-packed performance in this pan-India film.",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Jawan_film_poster.jpg/220px-Jawan_film_poster.jpg",
    backdrop: "https://upload.wikimedia.org/wikipedia/en/1/1e/Jawan_film_poster.jpg",
    releaseDate: new Date("2023-09-07"),
    duration: 165,
    genre: ["Action", "Drama"],
    language: "Hindi",
    rating: 7.9,
    voteCount: 15000,
    popularity: 92,
    isFeatured: true,
    isNowShowing: true,
    cast: [
      { name: "Shah Rukh Khan", role: "Vikram Rathore", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Shah_Rukh_Khan_2015.jpg/220px-Shah_Rukh_Khan_2015.jpg" },
      { name: "Deepika Padukone", role: "Nanda", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Deepika_Padukone_Cannes_2022.jpg/220px-Deepika_Padukone_Cannes_2022.jpg" },
      { name: "Vijay Sethupathi", role: "Monika", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Vijay_Sethupathi_promoting_Super_Producer.jpg/220px-Vijay_Sethupathi_promoting_Super_Producer.jpg" }
    ],
    director: "Atlee",
    trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    title: "Dunki",
    description: "A heartwarming tale of friendship and dreams. A group of friends from Punjab embarks on a treacherous journey to reach London, facing challenges and forming unbreakable bonds.",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Dunki_film_poster.jpg/220px-Dunki_film_poster.jpg",
    backdrop: "https://upload.wikimedia.org/wikipedia/en/3/3e/Dunki_film_poster.jpg",
    releaseDate: new Date("2023-12-21"),
    duration: 152,
    genre: ["Comedy", "Drama"],
    language: "Hindi",
    rating: 7.5,
    voteCount: 9500,
    popularity: 85,
    isFeatured: true,
    isNowShowing: true,
    cast: [
      { name: "Shah Rukh Khan", role: "Mannu", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Shah_Rukh_Khan_2015.jpg/220px-Shah_Rukh_Khan_2015.jpg" },
      { name: "Taapsee Pannu", role: "Geet", image: "https://upload.wikimedia.org/wikipedia/en/7/77/Taapsee_Pannu_promoting_Saand_Ki_Aankh.jpg" },
      { name: "Vicky Kaushal", role: "Buggu", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Vicky_Kaushal_promoting_Raazi.jpg/220px-Vicky_Kaushal_promoting_Raazi.jpg" }
    ],
    director: "Rajkumar Hirani",
    trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    title: "Animal",
    description: "A complex father-son relationship unfolds in this dark drama. The son tries to earn his father's approval while dealing with his own demons, leading to a violent and emotional climax.",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/6/65/Animal_film_poster.jpg/220px-Animal_film_poster.jpg",
    backdrop: "https://upload.wikimedia.org/wikipedia/en/6/65/Animal_film_poster.jpg",
    releaseDate: new Date("2023-12-01"),
    duration: 176,
    genre: ["Action", "Drama", "Crime"],
    language: "Hindi",
    rating: 8.1,
    voteCount: 18000,
    popularity: 94,
    isFeatured: true,
    isNowShowing: true,
    cast: [
      { name: "Ranbir Kapoor", role: "Arjun Singh", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Ranbir_Kapoor_promoting_Brahmastra.jpg/220px-Ranbir_Kapoor_promoting_Brahmastra.jpg" },
      { name: "Anil Kapoor", role: "Balbir Singh", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Anil_Kapoor_at_IIFA_2017.jpg/220px-Anil_Kapoor_at_IIFA_2017.jpg" },
      { name: "Rashmika Mandanna", role: "Geetanjali", image: "https://upload.wikimedia.org/wikipedia/en/c/c4/Rashmika_Mandanna_promoting_Saananaki.jpg" }
    ],
    director: "Sandeep Reddy Vanga",
    trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    title: "Pathaan",
    description: "India's deadliest spy returns for an action-packed mission. Pathaan must stop a rogue ISI agent from launching a devastating attack on India.",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Pathaan_film_poster.jpg/220px-Pathaan_film_poster.jpg",
    backdrop: "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Pathaan_film_poster.jpg",
    releaseDate: new Date("2023-01-25"),
    duration: 146,
    genre: ["Action", "Thriller"],
    language: "Hindi",
    rating: 8.0,
    voteCount: 22000,
    popularity: 96,
    isFeatured: true,
    isNowShowing: true,
    cast: [
      { name: "Shah Rukh Khan", role: "Pathaan", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Shah_Rukh_Khan_2015.jpg/220px-Shah_Rukh_Khan_2015.jpg" },
      { name: "Deepika Padukone", role: "Rubina", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Deepika_Padukone_Cannes_2022.jpg/220px-Deepika_Padukone_Cannes_2022.jpg" },
      { name: "John Abraham", role: "Jim", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/John_Abraham_promoting_Batman.jpg/220px-John_Abraham_promoting_Batman.jpg" }
    ],
    director: "Siddharth Anand",
    trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    title: " Salaar: Part 1 - Ceasefire",
    description: "A fierce warrior is drawn into a massive war between two kingdoms. His sole mission becomes protecting the rightful heir at all costs.",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ea/Salaar_poster.jpg/220px-Salaar_poster.jpg",
    backdrop: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ea/Salaar_poster.jpg",
    releaseDate: new Date("2023-12-22"),
    duration: 170,
    genre: ["Action", "Drama"],
    language: "Telugu",
    rating: 7.7,
    voteCount: 12000,
    popularity: 89,
    isFeatured: true,
    isNowShowing: true,
    cast: [
      { name: "Prabhas", role: "Vardha", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Prabhas_at_the_launch_of_Himesh_Reshammiya%27s_song_%28cropped%29.jpg/220px-Prabhas_at_the_launch_of_Himesh_Reshammiya%27s_song_%28cropped%29.jpg" },
      { name: "Shruti Haasan", role: "Devi", image: "https://upload.wikimedia.org/wikipedia/en/d/d4/Shruti_Haasan_promoting_Kram.jpg" }
    ],
    director: "Prashanth Neel",
    trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    title: "Leo",
    description: "A mild-mannered cafe owner in Himachal Pradesh gets caught in a gang war. What follows is an action-packed drama exploring his hidden past.",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/6/68/Leo_2023_poster.jpg/220px-Leo_2023_poster.jpg",
    backdrop: "https://upload.wikimedia.org/wikipedia/en/thumb/6/68/Leo_2023_poster.jpg",
    releaseDate: new Date("2023-10-19"),
    duration: 165,
    genre: ["Action", "Crime", "Drama"],
    language: "Tamil",
    rating: 7.6,
    voteCount: 16000,
    popularity: 91,
    isFeatured: true,
    isNowShowing: true,
    cast: [
      { name: "Vijay", role: "Leo Das", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Vijay_2019.jpg/220px-Vijay_2019.jpg" },
      { name: "Trisha Krishnan", role: "Sathya", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Trisha_Krishnan_Aug_2018.jpg/220px-Trisha_Krishnan_Aug_2018.jpg" },
      { name: "Sanjay Dutt", role: "Harold", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Sanjay_Dutt_promoting_Sadhna.jpg/220px-Sanjay_Dutt_promoting_Sadhna.jpg" }
    ],
    director: "Lokesh Kanagaraj",
    trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    title: "Jawan",
    description: "A high-octane action drama about a man who embarks on a mission to expose corruption and bring justice.",
    poster: "https://m.media-amazon.com/images/M/MV5BM2IwNzIwMmMtMzQxMS00NTdlLWJlMDUtZDQ4NDI1OGQ5OGE4XkEyXkFqcGc@._V1_.jpg",
    releaseDate: new Date("2023-09-07"),
    duration: 165,
    genre: ["Action", "Thriller"],
    language: "Hindi",
    rating: 8.1,
    voteCount: 15000,
    popularity: 90,
    isFeatured: true,
    isNowShowing: true,
    cast: [
      { name: "Shah Rukh Khan", role: "Vikram Rathore", image: "" }
    ],
    director: "Atlee"
  },
  {
    title: "RRR",
    description: "A fictional tale of two Indian revolutionaries in the 1920s. Their journey forms an epic action-filled drama.",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/RRR_film_poster.jpg/220px-RRR_film_poster.jpg",
    releaseDate: new Date("2022-03-24"),
    duration: 182,
    genre: ["Action", "Drama"],
    language: "Telugu",
    rating: 8.3,
    voteCount: 18000,
    popularity: 95,
    isFeatured: true,
    isNowShowing: true,
    cast: [
      { name: "NTR Jr.", role: "Komaram Bheem", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/NTR_Jr_at_IIFA_Urdu_2018_%28cropped%29.jpg/220px-NTR_Jr_at_IIFA_Urdu_2018_%28cropped%29.jpg" },
      { name: "Ram Charan", role: "Alluri Sitarama Raju", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Ram_Charan_Ram_Charan_at_T-Series_office.jpg/220px-Ram_Charan_Ram_Charan_at_T-Series_office.jpg" },
      { name: "Alia Bhatt", role: "Sita", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Alia_Bhatt_promoting_Brahmastra.jpg/220px-Alia_Bhatt_promoting_Brahmastra.jpg" }
    ],
    director: "S.S. Rajamouli",
    trailer: "https://www.youtube.com/watch?v=8Vt-DtYq-JI"
  },
  {
    title: "Brahmāstra: Part One Shiva",
    description: "A fantasy adventure where a young man discovers he has a powerful connection to the world of astras and must protect the world from evil forces.",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7d/Brahmastra_2022_film_poster.jpg/220px-Brahmastra_2022_film_poster.jpg",
    releaseDate: new Date("2022-09-09"),
    duration: 167,
    genre: ["Action", "Fantasy", "Adventure"],
    language: "Hindi",
    rating: 7.5,
    voteCount: 14000,
    popularity: 87,
    isFeatured: true,
    isNowShowing: true,
    cast: [
      { name: "Ranbir Kapoor", role: "Shiva", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Ranbir_Kapoor_promoting_Brahmastra.jpg/220px-Ranbir_Kapoor_promoting_Brahmastra.jpg" },
      { name: "Alia Bhatt", role: "Isha", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Alia_Bhatt_promoting_Brahmastra.jpg/220px-Alia_Bhatt_promoting_Brahmastra.jpg" },
      { name: "Amitabh Bachchan", role: "Guru", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Amitabh_Bachchan_promoting_Raazi.jpg/220px-Amitabh_Bachchan_promoting_Raazi.jpg" }
    ],
    director: "Ayan Mukerji",
    trailer: "https://www.youtube.com/watch?v=vU0LqywbM5k"
  }
];

// Cinema data
const cinemas = [
  {
    name: "INOX - Phoenix Mall",
    address: "Phoenix Mall, Senapati Bapat Marg, Lower Parel",
    city: "Mumbai",
    location: "Lower Parel",
    screens: [
      { name: "Screen 1", capacity: 250, format: "IMAX" },
      { name: "Screen 2", capacity: 180, format: "3D" },
      { name: "Screen 3", capacity: 150, format: "2D" }
    ],
    facilities: ["Parking", "Food Court", "Recliner Seats", "VIP Lounge"],
    rating: 4.5
  },
  {
    name: "PVR - Logix Mall",
    address: "Logix Mall, Sector 32, Noida",
    city: "Delhi",
    location: "Noida",
    screens: [
      { name: "Screen 1", capacity: 300, format: "4DX" },
      { name: "Screen 2", capacity: 200, format: "3D" },
      { name: "Screen 3", capacity: 180, format: "2D" },
      { name: "Screen 4", capacity: 120, format: "2D" }
    ],
    facilities: ["Parking", "Food Court", "Recliner Seats", "Wheelchair Access"],
    rating: 4.3
  },
  {
    name: "Cineplex - Orion Mall",
    address: "Orion Mall, Dr. Rajkumar Road",
    city: "Bangalore",
    location: "Rajajinagar",
    screens: [
      { name: "Screen 1", capacity: 280, format: "IMAX" },
      { name: "Screen 2", capacity: 200, format: "3D" },
      { name: "Screen 3", capacity: 160, format: "2D" }
    ],
    facilities: ["Parking", "Food Court", "Recliner Seats"],
    rating: 4.4
  },
  {
    name: "Erode Theater",
    address: "100 Feet Road, Vadivel Nager",
    city: "Chennai",
    location: "Vadivel Nager",
    screens: [
      { name: "Screen 1", capacity: 150, format: "3D" },
      { name: "Screen 2", capacity: 120, format: "2D" }
    ],
    facilities: ["Parking", "Food Court"],
    rating: 4.0
  },
  {
    name: "AMC - GVK Mall",
    address: "GVK One, Road No. 36",
    city: "Hyderabad",
    location: "Jubilee Hills",
    screens: [
      { name: "Screen 1", capacity: 200, format: "IMAX" },
      { name: "Screen 2", capacity: 160, format: "3D" },
      { name: "Screen 3", capacity: 140, format: "2D" }
    ],
    facilities: ["Parking", "Food Court", "VIP Lounge"],
    rating: 4.2
  },
  {
    name: "South City Mall",
    address: "Prince Anwar Shah Road",
    city: "Kolkata",
    location: "Jadavpur",
    screens: [
      { name: "Screen 1", capacity: 180, format: "3D" },
      { name: "Screen 2", capacity: 150, format: "2D" }
    ],
    facilities: ["Parking", "Food Court", "Wheelchair Access"],
    rating: 4.1
  }
];

// Time slots
const timeSlots = [
  "09:00", "10:30", "12:00", "14:00", "16:30", "19:00", "21:00", "22:30"
];

// Price by format
const prices = {
  "2D": 250,
  "3D": 350,
  "IMAX": 500,
  "4DX": 600
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await Cinema.deleteMany({});
    await Show.deleteMany({});
    console.log('Cleared existing data');

    // Seed movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`Seeded ${createdMovies.length} movies`);

    // Seed cinemas
    const createdCinemas = await Cinema.insertMany(cinemas);
    console.log(`Seeded ${createdCinemas.length} cinemas`);

    // Seed shows for each movie at each cinema
    const shows = [];
    const today = new Date();
    
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      
      createdMovies.forEach((movie, movieIndex) => {
        // Only add shows for featured movies or first few movies
        if (movieIndex >= 6) return;
        
        createdCinemas.forEach((cinema) => {
          cinema.screens.forEach((screen) => {
            // Add 2-3 random time slots per screen
            const selectedSlots = timeSlots
              .sort(() => 0.5 - Math.random())
              .slice(0, 3);
            
            selectedSlots.forEach(time => {
              shows.push({
                movie: movie._id,
                cinema: cinema._id,
                screen: screen.name,
                screenFormat: screen.format,
                date: new Date(date),
                time,
                duration: movie.duration,
                price: prices[screen.format] || 250,
                availableSeats: screen.capacity,
                totalSeats: screen.capacity
              });
            });
          });
        });
      });
    }

    await Show.insertMany(shows);
    console.log(`Seeded ${shows.length} shows`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, movies, cinemas };