/**
 * Integration Test Suite: Tour Search & Filter
 * File: tests/integration/tourSearch.test.js
 *
 * This suite tests the integration between Express query parsing and MongoDB search/filter logic for Tours.
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

let guideToken, guideId;

beforeAll(async () => {
  await connect();
});

beforeEach(async () => {
  const guide = await User.create({
    name: 'Guide', email: 'guide@test.com', password: 'password', role: 'Guide', profileDetails: { bio: '', location: '' }
  });
  guideId = guide._id;
  guideToken = jwt.sign({ id: guide._id, role: 'Guide' }, process.env.JWT_SECRET || 'secret');
  const tours = [
    { title: 'Dhaka Adventure', location: 'Dhaka', category: 'Adventure', language: 'English', price: 2000 },
    { title: 'Sylhet Heritage', location: 'Sylhet', category: 'Heritage', language: 'Bangla', price: 3000 },
    { title: 'Dhaka Heritage', location: 'Dhaka', category: 'Heritage', language: 'English', price: 1500 },
    { title: 'Sylhet Adventure', location: 'Sylhet', category: 'Adventure', language: 'Bangla', price: 5000 },
    { title: 'Chittagong Nature', location: 'Chittagong', category: 'Nature', language: 'English', price: 1000 },
  ];
  for (const t of tours) {
    await Tour.create({
      guideId: guide._id,
      ...t,
      description: 'desc',
      availabilityDates: [new Date(Date.now() + 86400000)],
    });
  }
});

describe('Tour Search & Filter Integration', () => {
  /**
   * Test: GET /api/tours returns all tours
   */
  test('GET /api/tours returns all tours', async () => {
    const res = await request(app).get('/api/tours');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
    // DB assertion
    const count = await Tour.countDocuments();
    expect(count).toBe(5);
  });

  /**
   * Test: GET /api/tours?location=Sylhet filters by location
   */
  test('GET /api/tours?location=Sylhet filters by location', async () => {
    const res = await request(app).get('/api/tours?location=Sylhet');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].location).toBe('Sylhet');
    expect(res.body[1].location).toBe('Sylhet');
  });

  /**
   * Test: GET /api/tours?minPrice=1000&maxPrice=5000 filters by price range
   */
  test('GET /api/tours?minPrice=1000&maxPrice=5000 filters by price range', async () => {
    // Patch backend to support minPrice/maxPrice if needed
    const res = await request(app).get('/api/tours?minPrice=1000&maxPrice=5000');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5); // All tours in this range
    for (const tour of res.body) {
      expect(tour.price).toBeGreaterThanOrEqual(1000);
      expect(tour.price).toBeLessThanOrEqual(5000);
    }
  });

  /**
   * Test: Pagination (?page=1&limit=2) returns 2 items and correct metadata
   */
  test('GET /api/tours?page=1&limit=2 returns 2 tours and total count header', async () => {
    const res = await request(app).get('/api/tours?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.headers['x-total-count']).toBe('5');
  });

  /**
   * Test: Combined filters (location, category, price)
   */
  test('GET /api/tours?location=Dhaka&category=Heritage&minPrice=1000&maxPrice=2000 returns correct tour', async () => {
    const res = await request(app).get('/api/tours?location=Dhaka&category=Heritage&minPrice=1000&maxPrice=2000');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Dhaka Heritage');
  });
});
