// backend/config/db.js
// Mongoose connection to local MongoDB instance

const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    // Always use the same dbName as the seed script for consistency
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'Local_guide' });
    console.log('MongoDB connected successfully (db: Local_guide)');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
