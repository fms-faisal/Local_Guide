// This script seeds the database with rich Bangladesh tour data, users, and reviews.
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Tour = require('./models/Tour');
const Review = require('./models/Review');
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Local_guide';

const images = {
  hero: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80',
  dhakaHeritage: 'https://images.unsplash.com/photo-1526481280694-3d0f049d96fd?auto=format&fit=crop&w=1200&q=80',
  oldDhakaFood: 'https://images.unsplash.com/photo-1542444459-db200aa7d89d?auto=format&fit=crop&w=1200&q=80',
  dhakaNightMarket: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
  sonargaonCraft: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=1200&q=80',
  mahastangarh: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76d8?auto=format&fit=crop&w=1200&q=80',
  sundarbans: 'https://images.unsplash.com/photo-1497669807734-5bcf9d30c7d6?auto=format&fit=crop&w=1200&q=80',
  sundarbansBoat: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  coxsBazar: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  kuakataSunrise: 'https://images.unsplash.com/photo-1523170408785-2e7ee7938d3d?auto=format&fit=crop&w=1200&q=80',
  bandarbanHills: 'https://images.unsplash.com/photo-1522706604293-1cd61a01f7fc?auto=format&fit=crop&w=1200&q=80',
  rangamatiLake: 'https://images.unsplash.com/photo-1559691469-2e9e005590c8?auto=format&fit=crop&w=1200&q=80',
  srimangalTea: 'https://images.unsplash.com/photo-1528279020-31ad71b23bd8?auto=format&fit=crop&w=1200&q=80',
  teaEstate: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1200&q=80',
  saintMartin: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80',
  chittagongWaterfall: 'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=1200&q=80',
  buddhaMonastery: 'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&w=1200&q=80',
  rajshahiSilk: 'https://images.unsplash.com/photo-1534670007418-9c0af0fe50a5?auto=format&fit=crop&w=1200&q=80',
  barisalRiver: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  paharpur: 'https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?auto=format&fit=crop&w=1200&q=80',
  dhakaPhotoWalk: 'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=1200&q=80',
  sundarbansSunset: 'https://images.unsplash.com/photo-1500537241729-9fe1f53ffabf?auto=format&fit=crop&w=1200&q=80',
  sacredMonuments: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80'
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
    },
    {
      name: 'Leena Chowdhury',
      email: 'leena@guide.bd',
      password: hashedPassword,
      role: 'Guide',
      profileDetails: { bio: 'Coastal specialist creating beach and island adventures.', location: 'Cox’s Bazar' }
    },
    {
      name: 'Taufiq Islam',
      email: 'taufiq@guide.bd',
      password: hashedPassword,
      role: 'Guide',
      profileDetails: { bio: 'Culture and history expert for North Bengal tours.', location: 'Rajshahi' }
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
      guideId: guides[0]._id,
      title: 'Dhaka Evening Market Tour',
      description: 'Experience Dhaka after dark with a guided walk through neon-lit markets, aromatic street food, and lively bazaars.',
      location: 'Dhaka',
      category: 'Food',
      language: 'English',
      price: 50,
      rating: 4.7,
      image: images.dhakaNightMarket,
      availabilityDates: [getDateOffset(2), getDateOffset(5), getDateOffset(8)]
    },
    {
      guideId: guides[0]._id,
      title: 'Dhaka Photography Night Walk',
      description: 'Capture the city’s vibrant lights, historic architecture, and street scenes on a guided photography walk.',
      location: 'Dhaka',
      category: 'Photography',
      language: 'English',
      price: 52,
      rating: 4.8,
      image: images.dhakaPhotoWalk,
      availabilityDates: [getDateOffset(3), getDateOffset(7), getDateOffset(11)]
    },
    {
      guideId: guides[0]._id,
      title: 'Paharpur Buddhist Temple Tour',
      description: 'Visit the UNESCO World Heritage site of Somapura Mahavihara and explore ancient monastic ruins.',
      location: 'Paharpur',
      category: 'History',
      language: 'English',
      price: 68,
      rating: 4.7,
      image: images.paharpur,
      availabilityDates: [getDateOffset(5), getDateOffset(10), getDateOffset(14)]
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
      title: 'Tea Estate Stay & Local Tasting',
      description: 'Spend a night in a scenic tea estate bungalow and sample fresh tea with a local plantation guide.',
      location: 'Srimangal',
      category: 'Wellness',
      language: 'English',
      price: 80,
      rating: 4.8,
      image: images.teaEstate,
      availabilityDates: [getDateOffset(6), getDateOffset(10), getDateOffset(14)]
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
      guideId: guides[1]._id,
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
      guideId: guides[2]._id,
      title: 'Chittagong Waterfall Hike',
      description: 'Hike to hidden waterfalls, swim in natural pools, and explore verdant forest trails outside Chittagong.',
      location: 'Chittagong',
      category: 'Adventure',
      language: 'English',
      price: 70,
      rating: 4.7,
      image: images.chittagongWaterfall,
      availabilityDates: [getDateOffset(4), getDateOffset(8), getDateOffset(12)]
    },
    {
      guideId: guides[2]._id,
      title: 'Ancient Buddhist Monastery Pilgrimage',
      description: 'Visit a serene hillside monastery near Chittagong and learn about centuries of Buddhist tradition in Bangladesh.',
      location: 'Chittagong',
      category: 'Pilgrimage',
      language: 'English',
      price: 68,
      rating: 4.7,
      image: images.buddhaMonastery,
      availabilityDates: [getDateOffset(6), getDateOffset(10), getDateOffset(15)]
    },
    {
      guideId: guides[3]._id,
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
      guideId: guides[3]._id,
      title: 'Kuakata Sunrise & Beach Meditation',
      description: 'Watch the unique sunrise over the Bay of Bengal and enjoy a guided meditation on the tranquil Kuakata beach.',
      location: 'Kuakata',
      category: 'Wellness',
      language: 'English',
      price: 48,
      rating: 4.9,
      image: images.kuakataSunrise,
      availabilityDates: [getDateOffset(2), getDateOffset(5), getDateOffset(11)]
    },
    {
      guideId: guides[3]._id,
      title: 'Saint Martin Island Snorkeling Day Trip',
      description: 'Take a boat to Bangladesh’s coral island, snorkel clear blue waters, and relax on powdery white sand.',
      location: 'Saint Martin Island',
      category: 'Nature',
      language: 'English',
      price: 110,
      rating: 4.9,
      image: images.saintMartin,
      availabilityDates: [getDateOffset(3), getDateOffset(7), getDateOffset(11)]
    },
    {
      guideId: guides[3]._id,
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
      guideId: guides[3]._id,
      title: 'Sundarbans Wildlife Cruise',
      description: 'Cruise through the mangrove channels in search of birds, deer, and river dolphins with an experienced naturalist guide.',
      location: 'Sundarbans',
      category: 'Wildlife',
      language: 'English',
      price: 135,
      rating: 4.9,
      image: images.sundarbansBoat,
      availabilityDates: [getDateOffset(5), getDateOffset(9), getDateOffset(13)]
    },
    {
      guideId: guides[4]._id,
      title: 'Rajshahi Silk Weaving Village Tour',
      description: 'Discover the art of silk weaving and meet local craftsmen in the historic villages of Rajshahi.',
      location: 'Rajshahi',
      category: 'Culture',
      language: 'English',
      price: 60,
      rating: 4.6,
      image: images.rajshahiSilk,
      availabilityDates: [getDateOffset(4), getDateOffset(9), getDateOffset(13)]
    },
    {
      guideId: guides[4]._id,
      title: 'Barisal Riverboat & Floating Market',
      description: 'Enjoy a morning river cruise, browse floating markets, and soak in the waterways of southern Bangladesh.',
      location: 'Barisal',
      category: 'Culture',
      language: 'English',
      price: 58,
      rating: 4.7,
      image: images.barisalRiver,
      availabilityDates: [getDateOffset(3), getDateOffset(8), getDateOffset(12)]
    },
    {
      guideId: guides[4]._id,
      title: 'Sundarbans Sunset River Safari',
      description: 'Watch the mangrove horizon turn gold, with evening birdwatching and peaceful river views.',
      location: 'Sundarbans',
      category: 'Wildlife',
      language: 'English',
      price: 115,
      rating: 4.8,
      image: images.sundarbansSunset,
      availabilityDates: [getDateOffset(6), getDateOffset(11), getDateOffset(15)]
    },
    {
      guideId: guides[4]._id,
      title: 'Sacred Monuments & Temple Tour',
      description: 'Visit ancient temples and sacred sites while learning about Bangladesh’s spiritual heritage.',
      location: 'Dhaka',
      category: 'History',
      language: 'English',
      price: 54,
      rating: 4.7,
      image: images.sacredMonuments,
      availabilityDates: [getDateOffset(2), getDateOffset(7), getDateOffset(11)]
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
