const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    console.warn('Server running in mock mode - data will not persist');
    // Don't exit - allow server to run without DB for demo purposes
    return null;
  }
};

module.exports = connectDB;
