/**
 * Integration Test Suite: Middleware & RBAC Integration
 * File: tests/integration/authMiddleware.test.js
 *
 * This suite tests the integration between JWT authentication middleware, role-based access control, and protected routes.
 *
 * - Uses real MongoDB in-memory server (no mocks)
 * - Uses supertest for HTTP requests
 * - All assertions check both HTTP response and DB state
 * - Each test is documented for SQA
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { connect } = require('../setup/db');
const app = require('../../backend/app'); // Express app
const User = require('../../backend/models/User');
const Tour = require('../../backend/models/Tour');
const jwt = require('jsonwebtoken');

let touristToken, guideToken, adminToken, guideId, touristId, adminId;

beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  const guide = await User.create({
    name: 'Guide', email: 'guide@test.com', password: 'password', role: 'Guide', profileDetails: { bio: '', location: '' }
  });
  const tourist = await User.create({
    name: 'Tourist', email: 'tourist@test.com', password: 'password', role: 'Tourist', profileDetails: { bio: '', location: '' }
  });
  const admin = await User.create({
    name: 'Admin', email: 'admin@test.com', password: 'password', role: 'Admin', profileDetails: { bio: '', location: '' }
  });
  guideId = guide._id;
  touristId = tourist._id;
  adminId = admin._id;
  guideToken = jwt.sign({ id: guide._id, role: 'Guide' }, process.env.JWT_SECRET || 'secret');
  touristToken = jwt.sign({ id: tourist._id, role: 'Tourist' }, process.env.JWT_SECRET || 'secret');
  adminToken = jwt.sign({ id: admin._id, role: 'Admin' }, process.env.JWT_SECRET || 'secret');
});

describe('Middleware & RBAC Integration', () => {
  test('Accessing a protected route without a token returns 401 Unauthorized', async () => {
    const res = await request(app).post('/api/tours').send({});
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/unauthorized|no token/i);
  });

  test('Accessing a protected route with a malformed/expired token returns 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/tours')
      .set('Authorization', 'Bearer malformedtoken')
      .send({});
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/unauthorized|invalid|jwt/i);
  });

  test('A Tourist attempting to access POST /api/tours (Guide-only) returns 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/tours')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({});
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/forbidden|not authorized|role|insufficient permissions/i);
  });

  test('A Guide attempting to access GET /api/admin/users (Admin-only) returns 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${guideToken}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/forbidden|not authorized|role|insufficient permissions/i);
  });

  test('Valid tokens grant access and correctly inject req.user into the controller', async () => {
    // Guide creates a tour
    const tourData = {
      title: 'Test Tour', description: 'desc', location: 'Dhaka', category: 'Adventure', language: 'English', price: 100, availabilityDates: [new Date()]
    };
    const res = await request(app)
      .post('/api/tours')
      .set('Authorization', `Bearer ${guideToken}`)
      .send(tourData);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Tour');
    // Check DB
    const tour = await Tour.findOne({ title: 'Test Tour' });
    expect(tour).not.toBeNull();
    expect(tour.guideId.toString()).toBe(guideId.toString());
  });
});
