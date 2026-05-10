const request = require('supertest');
const { connect, clearDatabase } = require('../setup/db');
const app = require('../../backend/app');
const User = require('../../backend/models/User');
const Tour = require('../../backend/models/Tour');
const Booking = require('../../backend/models/Booking');
const jwt = require('jsonwebtoken');

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

describe('System: Booking Routes', () => {
  let guideToken;
  let touristToken;
  let guide;
  let tourist;
  let tour;

  beforeEach(async () => {
    guide = await User.create({ name: 'GuideBook', email: 'guide.book@test.com', password: 'password', role: 'Guide' });
    tourist = await User.create({ name: 'TouristBook', email: 'tourist.book@test.com', password: 'password', role: 'Tourist' });
    guideToken = signToken(guide);
    touristToken = signToken(tourist);
    tour = await Tour.create({ guideId: guide._id, title: 'Book Tour', description: 'desc', location: 'Dhaka', category: 'Adventure', language: 'English', price: 100, availabilityDates: [new Date(Date.now() + 86400000)] });
  });

  test('Tourist can create a booking for an available date', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({ tourId: tour._id, date: new Date(Date.now() + 86400000).toISOString() });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('Pending');
  });

  test('Booking creation returns 400 for invalid date format', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({ tourId: tour._id, date: 'not-a-date' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid date format');
  });

  test('GET /api/bookings/my-bookings returns bookings for tourist', async () => {
    await Booking.create({ tourId: tour._id, touristId: tourist._id, date: new Date(Date.now() + 86400000), status: 'Pending' });

    const res = await request(app)
      .get('/api/bookings/my-bookings')
      .set('Authorization', `Bearer ${touristToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].touristId.name).toBe('TouristBook');
  });

  test('GET /api/bookings/my-bookings returns guide bookings for guide tours', async () => {
    await Booking.create({ tourId: tour._id, touristId: tourist._id, date: new Date(Date.now() + 86400000), status: 'Pending' });

    const res = await request(app)
      .get('/api/bookings/my-bookings')
      .set('Authorization', `Bearer ${guideToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test('PATCH /api/bookings/:id/status approves booking for guide', async () => {
    const booking = await Booking.create({ tourId: tour._id, touristId: tourist._id, date: new Date(Date.now() + 86400000), status: 'Pending' });

    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/status`)
      .set('Authorization', `Bearer ${guideToken}`)
      .send({ status: 'Approved' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Approved');
  });

  test('PATCH /api/bookings/:id/status returns 400 for invalid status', async () => {
    const booking = await Booking.create({ tourId: tour._id, touristId: tourist._id, date: new Date(Date.now() + 86400000), status: 'Pending' });

    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/status`)
      .set('Authorization', `Bearer ${guideToken}`)
      .send({ status: 'Completed' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid status');
  });
});
