const request = require('supertest');
const { connect, clearDatabase } = require('../setup/db');
const app = require('../../backend/app');
const User = require('../../backend/models/User');
const Tour = require('../../backend/models/Tour');
const Booking = require('../../backend/models/Booking');
const Review = require('../../backend/models/Review');
const jwt = require('jsonwebtoken');

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

describe('Regression Test Suite', () => {
  test('Approved booking prevents duplicate bookings on the same day', async () => {
    const guide = await User.create({ name: 'GuideReg', email: 'guide.reg@test.com', password: 'password', role: 'Guide' });
    const tourist = await User.create({ name: 'TouristReg', email: 'tourist.reg@test.com', password: 'password', role: 'Tourist' });
    const bookingTour = await Tour.create({ guideId: guide._id, title: 'Reg Tour', description: 'desc', location: 'Dhaka', category: 'Adventure', language: 'English', price: 100, availabilityDates: [new Date(Date.now() + 86400000)] });
    const booking = await Booking.create({ tourId: bookingTour._id, touristId: tourist._id, date: new Date(Date.now() + 86400000), status: 'Approved' });
    const token = signToken(tourist);

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({ tourId: bookingTour._id, date: new Date(Date.now() + 86400000).toISOString() });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already booked/i);
  });

  test('Admin deleting guide user cascades tour and resource cleanup', async () => {
    const admin = await User.create({ name: 'AdminReg', email: 'admin.reg@test.com', password: 'password', role: 'Admin' });
    const guide = await User.create({ name: 'GuideReg2', email: 'guide2.reg@test.com', password: 'password', role: 'Guide' });
    const tourist = await User.create({ name: 'TouristReg2', email: 'tourist2.reg@test.com', password: 'password', role: 'Tourist' });
    const tour = await Tour.create({ guideId: guide._id, title: 'Reg Tour2', description: 'desc', location: 'Sylhet', category: 'Heritage', language: 'Bangla', price: 200, availabilityDates: [new Date(Date.now() + 86400000)] });
    const booking = await Booking.create({ tourId: tour._id, touristId: tourist._id, date: new Date(Date.now() + 86400000), status: 'Pending' });
    await Review.create({ tourId: tour._id, touristId: tourist._id, rating: 4, comment: 'Good' });

    const token = signToken(admin);
    const res = await request(app)
      .delete(`/api/admin/users/${guide._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(await Tour.findById(tour._id)).toBeNull();
    expect(await Booking.findById(booking._id)).toBeNull();
    expect(await Review.findOne({ tourId: tour._id })).toBeNull();
  });

  test('Unauthorized user cannot access admin user list', async () => {
    const tourist = await User.create({ name: 'TouristReg3', email: 'tourist3.reg@test.com', password: 'password', role: 'Tourist' });
    const token = signToken(tourist);
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  test('Search filters remain valid when using boundary range values', async () => {
    const guide = await User.create({ name: 'GuideReg4', email: 'guide4.reg@test.com', password: 'password', role: 'Guide' });
    await Tour.create({ guideId: guide._id, title: 'LowPrice', description: 'desc', location: 'Dhaka', category: 'Nature', language: 'English', price: 1000, availabilityDates: [new Date(Date.now() + 86400000)] });
    await Tour.create({ guideId: guide._id, title: 'HighPrice', description: 'desc', location: 'Dhaka', category: 'Nature', language: 'English', price: 5000, availabilityDates: [new Date(Date.now() + 86400000)] });

    const res = await request(app).get('/api/tours?minPrice=1000&maxPrice=5000');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
});
