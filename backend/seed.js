// This script seeds the database with some dummy users, tours, and reviews.
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Tour = require('./models/Tour');
const Review = require('./models/Review');
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Local_guide';

async function seed() {
  await mongoose.connect(MONGO_URI, { dbName: 'Local_guide' });
  await User.deleteMany({});
  await Tour.deleteMany({});
  await Review.deleteMany({});

  // Hash passwords
  const hashedGuidePassword = await bcrypt.hash('password', 10);
  const hashedTouristPassword = await bcrypt.hash('password', 10);

  // Create users
  const guide = await User.create({
    name: 'Alice Guide',
    email: 'alice@guide.com',
    password: hashedGuidePassword,
    role: 'Guide',
    profileDetails: { bio: 'Experienced city guide.', location: 'New York' }
  });
  const tourist = await User.create({
    name: 'Bob Tourist',
    email: 'bob@tourist.com',
    password: hashedTouristPassword,
    role: 'Tourist',
    profileDetails: { bio: 'Loves to travel.', location: 'London' }
  });

  // Create tours
  const tour = await Tour.create({
    guideId: guide._id,
    title: 'Historic City Walk',
    description: 'Explore the city’s history and landmarks.',
    location: 'New York',
    category: 'Walking',
    language: 'English',
    price: 50,
    availabilityDates: [
      new Date(Date.now() + 86400000),
      new Date(Date.now() + 2 * 86400000),
      new Date(Date.now() + 3 * 86400000)
    ]
  });

  // Create reviews
  await Review.create({
    tourId: tour._id,
    touristId: tourist._id,
    rating: 5,
    comment: 'Amazing tour! Highly recommended.'
  });

  console.log('Database seeded!');
  process.exit();
}

seed();
