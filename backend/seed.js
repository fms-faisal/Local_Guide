// This script seeds the database with rich Bangladesh tour data, users, and reviews.
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Tour = require('./models/Tour');
const Review = require('./models/Review');
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Local_guide';

const images = {
  dhakaHeritage: 'https://images.unsplash.com/photo-1526481280694-3d0f049d96fd?auto=format&fit=crop&w=1200&q=80',
  oldDhakaFood: 'https://images.unsplash.com/photo-1542444459-db200aa7d89d?auto=format&fit=crop&w=1200&q=80',
  sundarbans: 'https://images.unsplash.com/photo-1497669807734-5bcf9d30c7d6?auto=format&fit=crop&w=1200&q=80',
  coxsBazar: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  srimangalTea: 'https://images.unsplash.com/photo-1528279020-31ad71b23bd8?auto=format&fit=crop&w=1200&q=80',
  rangamatiLake: 'https://images.unsplash.com/photo-1559691469-2e9e005590c8?auto=format&fit=crop&w=1200&q=80',
  bandarbanHills: 'https://images.unsplash.com/photo-1522706604293-1cd61a01f7fc?auto=format&fit=crop&w=1200&q=80',
  mahastangarh: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76d8?auto=format&fit=crop&w=1200&q=80',
  kuakataSunrise: 'https://images.unsplash.com/photo-1523170408785-2e7ee7938d3d?auto=format&fit=crop&w=1200&q=80',
  sonargaonCraft: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1200&q=80'
};

function getDateOffset(days) {
  return new Date(Date.now() + days * 86400000);
}

async function seed() {
  await mongoose.connect(MONGO_URI, { dbName: 'Local_guide' });
  await User.deleteMany({});
  await Tour.deleteMany({});
  await Review.deleteMany({});

  const hashedPassword = await bcrypt.hash('password', 10);

  const guides = await User.create([
    {
      name: 'Arif Hossain',
      email: 'arif@guide.bd',
      password: hashedPassword,
      role: 'Guide',
      profileDetails: { bio: 'Local historian and Dhaka storytelling guide.', location: 'Dhaka' }
    },
    {
      name: 'Nusrat Begum',
      email: 'nusrat@guide.bd',
      password: hashedPassword,
      role: 'Guide',
      profileDetails: { bio: 'Tea garden specialist from Sylhet.', location: 'Sylhet' }
    },
    {
      name: 'Hasan Rafi',
      email: 'hasan@guide.bd',
      password: hashedPassword,
      role: 'Guide',
      profileDetails: { bio: 'Adventure guide for Chittagong and hill country.', location: 'Chittagong' }
    }
  ]);

  const tourists = await User.create([
    {
      name: 'Rafi Ahmed',
      email: 'rafi@tourist.bd',
      password: hashedPassword,
      role: 'Tourist',
      profileDetails: { bio: 'Photography lover and nature traveler.', location: 'Dhaka' }
    },
    {
      name: 'Ayesha Rahman',
      email: 'ayesha@tourist.bd',
      password: hashedPassword,
      role: 'Tourist',
      profileDetails: { bio: 'Food and culture explorer.', location: 'Chittagong' }
    },
    {
      name: 'Samira Islam',
      email: 'samira@tourist.bd',
      password: hashedPassword,
      role: 'Tourist',
      profileDetails: { bio: 'Adventure seeker and weekend trekker.', location: 'Sylhet' }
    }
  ]);

  const tours = await Tour.create([
    {
      guideId: guides[0]._id,
      title: 'Old Dhaka Heritage Walk',
      description: 'Dive into centuries of history across Old Dhaka’s winding lanes, vibrant markets, and iconic mosques.',
      location: 'Old Dhaka',
      category: 'Culture',
      language: 'English',
      price: 45,
      rating: 4.9,
      image: images.dhakaHeritage,
      availabilityDates: [getDateOffset(2), getDateOffset(4), getDateOffset(6)]
    },
    {
      guideId: guides[0]._id,
      title: 'Old Dhaka Food Safari',
      description: 'Taste authentic Bengali street food and secret family recipes across Dhaka’s historic culinary districts.',
      location: 'Old Dhaka',
      category: 'Food',
      language: 'English',
      price: 55,
      rating: 4.8,
      image: images.oldDhakaFood,
      availabilityDates: [getDateOffset(3), getDateOffset(6), getDateOffset(9)]
    },
    {
      guideId: guides[1]._id,
      title: 'Sylhet Tea Garden Bicycle Tour',
      description: 'Pedal through emerald tea gardens, learn about tea harvesting, and enjoy a serene riverside lunch.',
      location: 'Srimangal',
      category: 'Nature',
      language: 'English',
      price: 65,
      rating: 4.7,
      image: images.srimangalTea,
      availabilityDates: [getDateOffset(5), getDateOffset(8), getDateOffset(11)]
    },
    {
      guideId: guides[1]._id,
      title: 'Sundarbans Mangrove Safari',
      description: 'Explore the largest mangrove forest in the world with a guided boat tour and wildlife spotting adventure.',
      location: 'Sundarbans',
      category: 'Adventure',
      language: 'English',
      price: 120,
      rating: 4.9,
      image: images.sundarbans,
      availabilityDates: [getDateOffset(4), getDateOffset(7), getDateOffset(10)]
    },
    {
      guideId: guides[2]._id,
      title: 'Cox’s Bazar Beach Sunrise Walk',
      description: 'Experience the world’s longest sea beach at dawn, with sand dunes, fishing boats, and peaceful seaside views.',
      location: 'Cox’s Bazar',
      category: 'Nature',
      language: 'English',
      price: 50,
      rating: 4.8,
      image: images.coxsBazar,
      availabilityDates: [getDateOffset(1), getDateOffset(5), getDateOffset(9)]
    },
    {
      guideId: guides[2]._id,
      title: 'Bandarban Hill Trek & Tribal Village',
      description: 'Trek gentle hills, visit hill tribe communities, and enjoy luminous lake scenery in the Chittagong Hill Tracts.',
      location: 'Bandarban',
      category: 'Adventure',
      language: 'English',
      price: 95,
      rating: 4.8,
      image: images.bandarbanHills,
      availabilityDates: [getDateOffset(7), getDateOffset(10), getDateOffset(14)]
    },
    {
      guideId: guides[0]._id,
      title: 'Sonargaon Craft Village Experience',
      description: 'Visit ancient Sonargaon, meet artisans, and learn traditional crafts like pottery, weaving, and paper making.',
      location: 'Sonargaon',
      category: 'Culture',
      language: 'English',
      price: 58,
      rating: 4.7,
      image: images.sonargaonCraft,
      availabilityDates: [getDateOffset(3), getDateOffset(7), getDateOffset(12)]
    },
    {
      guideId: guides[1]._id,
      title: 'Rangamati Lake & Boat Cruise',
      description: 'Relax on a scenic boat cruise through Rangamati Lake while discovering tribal markets and lush hillside scenery.',
      location: 'Rangamati',
      category: 'Nature',
      language: 'English',
      price: 72,
      rating: 4.8,
      image: images.rangamatiLake,
      availabilityDates: [getDateOffset(2), getDateOffset(6), getDateOffset(10)]
    },
    {
      guideId: guides[0]._id,
      title: 'Mahasthangarh Archaeological Tour',
      description: 'Explore ancient ruins, learn about the prehistoric city, and see excavated temples dating back over two thousand years.',
      location: 'Mahasthangarh',
      category: 'History',
      language: 'English',
      price: 63,
      rating: 4.6,
      image: images.mahastangarh,
      availabilityDates: [getDateOffset(4), getDateOffset(8), getDateOffset(13)]
    },
    {
      guideId: guides[2]._id,
      title: 'Kuakata Sunrise & Beach Meditation',
      description: 'Watch the unique sunrise over the Bay of Bengal and enjoy a guided meditation on the tranquil Kuakata beach.',
      location: 'Kuakata',
      category: 'Wellness',
      language: 'English',
      price: 48,
      rating: 4.9,
      image: images.kuakataSunrise,
      availabilityDates: [getDateOffset(2), getDateOffset(5), getDateOffset(11)]
    }
  ]);

  const reviews = [
    {
      tourId: tours[0]._id,
      touristId: tourists[0]._id,
      rating: 5,
      comment: 'The Old Dhaka walk was unforgettable, full of culture and local flavor.'
    },
    {
      tourId: tours[1]._id,
      touristId: tourists[1]._id,
      rating: 5,
      comment: 'The food tour was delicious and the guide knew all the best local dishes.'
    },
    {
      tourId: tours[3]._id,
      touristId: tourists[2]._id,
      rating: 5,
      comment: 'Sundarbans safari was magical, and we saw river dolphins and beautiful mangroves.'
    },
    {
      tourId: tours[4]._id,
      touristId: tourists[0]._id,
      rating: 4,
      comment: 'Cox’s Bazar sunrise was stunning and the beach walk felt so peaceful.'
    },
    {
      tourId: tours[5]._id,
      touristId: tourists[2]._id,
      rating: 5,
      comment: 'Bandarban trek was an amazing adventure with incredible views and friendly hosts.'
    }
  ];

  await Review.create(reviews);

  console.log('Database seeded with Bangladesh tours!');
  process.exit();
}

seed();
