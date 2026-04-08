/**
 * Startup Script
 * Automatically seeds the database and starts the server
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { seedDatabase } = require('../seeds/seed');

const connectDB = require('../config/db');

const STARTUP_OPTIONS = {
  seed: process.argv.includes('--seed') || process.argv.includes('-s'),
  skipSeed: process.argv.includes('--skip-seed') || process.argv.includes('-n'),
  forceSeed: process.argv.includes('--force') || process.argv.includes('-f')
};

const startup = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Database connected successfully');

    // Check if we should seed the database
    if (STARTUP_OPTIONS.skipSeed) {
      console.log('Skipping database seeding as per --skip-seed flag');
    } else if (STARTUP_OPTIONS.seed || STARTUP_OPTIONS.forceSeed) {
      console.log('Starting database seeding...');
      await seedDatabase();
      console.log('Database seeding completed');
    } else {
      // Check if database has data
      const Movie = require('../models/Movie');
      const Cinema = require('../models/Cinema');
      const Show = require('../models/Show');

      const [movieCount, cinemaCount, showCount] = await Promise.all([
        Movie.countDocuments(),
        Cinema.countDocuments(),
        Show.countDocuments()
      ]);

      console.log(`Current database state: ${movieCount} movies, ${cinemaCount} cinemas, ${showCount} shows`);

      if (movieCount === 0 || cinemaCount === 0 || showCount === 0) {
        console.log('Database appears to be empty. Seeding data...');
        await seedDatabase();
        console.log('Database seeding completed');
      } else if (STARTUP_OPTIONS.forceSeed) {
        console.log('Force seeding as per --force flag');
        await seedDatabase();
        console.log('Database seeding completed');
      } else {
        console.log('Database already has data. Use --seed or --force to re-seed.');
      }
    }

    // Start the Express server
    console.log('Starting application server...');
    const app = require('./index');
    
    // Server is already listening in index.js
    console.log('Application started successfully');
  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
};

// Run startup
startup();

module.exports = { startup, STARTUP_OPTIONS };