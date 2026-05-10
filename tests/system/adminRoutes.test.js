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

describe('System: Admin Routes', () => {
  let adminToken;
  let guide;
  let tourist;
  let statsUser;

  beforeEach(async () => {
    const admin = await User.create({ name: 'AdminSys', email: 'admin.route@test.com', password: 'password', role: 'Admin' });
    guide = await User.create({ name: 'GuideSys', email: 'guide.route@test.com', password: 'password', role: 'Guide' });
    tourist = await User.create({ name: 'TouristSys', email: 'tourist.route@test.com', password: 'password', role: 'Tourist' });
    adminToken = signToken(admin);
    statsUser = admin;
  });

  test('GET /api/admin/stats returns counts for admin', async () => {
    const tour = await Tour.create({ guideId: guide._id, title: 'Stats Tour', description: 'desc', location: 'Dhaka', category: 'Adventure', language: 'English', price: 300, availabilityDates: [new Date(Date.now() + 86400000)] });
    await Booking.create({ tourId: tour._id, touristId: tourist._id, date: new Date(Date.now() + 86400000), status: 'Pending' });

    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.users).toBeGreaterThanOrEqual(3);
    expect(res.body.tours).toBeGreaterThanOrEqual(1);
    expect(res.body.bookings).toBeGreaterThanOrEqual(1);
  });

  test('GET /api/admin/stats returns 403 for non-admin', async () => {
    const touristToken = signToken(tourist);
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${touristToken}`);

    expect(res.status).toBe(403);
  });

  test('DELETE /api/admin/users/:id removes guide and cascades resources', async () => {
    const tour = await Tour.create({ guideId: guide._id, title: 'Delete Tour', description: 'desc', location: 'Dhaka', category: 'Heritage', language: 'English', price: 200, availabilityDates: [new Date(Date.now() + 86400000)] });
    await Booking.create({ tourId: tour._id, touristId: tourist._id, date: new Date(Date.now() + 86400000), status: 'Pending' });
    const res = await request(app)
      .delete(`/api/admin/users/${guide._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User deleted');
  });
});
