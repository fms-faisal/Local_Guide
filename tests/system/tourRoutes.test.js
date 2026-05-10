const request = require('supertest');
const { connect, clearDatabase } = require('../setup/db');
const app = require('../../backend/app');
const User = require('../../backend/models/User');
const Tour = require('../../backend/models/Tour');
const jwt = require('jsonwebtoken');

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

describe('System: Tour Routes', () => {
  let guideToken;
  let touristToken;
  let adminToken;
  let tour;
  let guide;

  beforeEach(async () => {
    guide = await User.create({ name: 'GuideSys', email: 'guide.sys@test.com', password: 'password', role: 'Guide' });
    const tourist = await User.create({ name: 'TouristSys', email: 'tourist.sys@test.com', password: 'password', role: 'Tourist' });
    const admin = await User.create({ name: 'AdminSys', email: 'admin.sys@test.com', password: 'password', role: 'Admin' });
    guideToken = signToken(guide);
    touristToken = signToken(tourist);
    adminToken = signToken(admin);
    tour = await Tour.create({ guideId: guide._id, title: 'Guide Tour', description: 'desc', location: 'Dhaka', category: 'Adventure', language: 'English', price: 100, availabilityDates: [new Date(Date.now() + 86400000)] });
  });

  test('Guide can create a tour', async () => {
    const res = await request(app)
      .post('/api/tours')
      .set('Authorization', `Bearer ${guideToken}`)
      .send({ title: 'New Tour', description: 'desc', location: 'Chittagong', category: 'Nature', language: 'Bangla', price: 200, availabilityDates: [new Date(Date.now() + 86400000)] });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Tour');
  });

  test('Tourist cannot create a tour', async () => {
    const res = await request(app)
      .post('/api/tours')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({ title: 'Invalid Tour', description: 'desc', location: 'Dhaka', category: 'Adventure', language: 'English', price: 100, availabilityDates: [new Date(Date.now() + 86400000)] });

    expect(res.status).toBe(403);
  });

  test('Guide cannot update tour owned by another guide', async () => {
    const otherGuide = await User.create({ name: 'GuideOther', email: 'guide.other@test.com', password: 'password', role: 'Guide' });
    const otherToken = signToken(otherGuide);
    const res = await request(app)
      .put(`/api/tours/${tour._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Changed Title' });

    expect(res.status).toBe(403);
  });

  test('Admin can update any tour', async () => {
    const res = await request(app)
      .put(`/api/tours/${tour._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Admin Updated' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Admin Updated');
  });

  test('Admin can delete a tour', async () => {
    const res = await request(app)
      .delete(`/api/tours/${tour._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Tour deleted');
  });

  test('GET /api/tours returns empty array for page beyond range', async () => {
    const res = await request(app).get('/api/tours?page=10&limit=5');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    expect(res.headers['x-total-count']).toBe('1');
  });
});
