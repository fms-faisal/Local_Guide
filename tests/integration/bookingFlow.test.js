/**
 * Integration Test Suite: The Core Booking Flow
 * File: tests/integration/bookingFlow.test.js
 *
 * This suite tests the integration between Users, Tours, and Bookings.
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
const Booking = require('../../backend/models/Booking');
const jwt = require('jsonwebtoken');

let touristToken, guideToken, guideId, touristId, tourId;

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
  guideId = guide._id;
  touristId = tourist._id;
  guideToken = jwt.sign({ id: guide._id, role: 'Guide' }, process.env.JWT_SECRET || 'secret');
  touristToken = jwt.sign({ id: tourist._id, role: 'Tourist' }, process.env.JWT_SECRET || 'secret');
  const tour = await Tour.create({
    guideId: guide._id,
    title: 'Test Tour',
    description: 'desc',
    location: 'Dhaka',
    category: 'Adventure',
    language: 'English',
    price: 100,
    availabilityDates: [new Date(Date.now() + 86400000), new Date(Date.now() + 2 * 86400000)]
  });
  tourId = tour._id;
});

describe('Core Booking Flow Integration', () => {
  /**
   * Test 1: Creation
   * Tourist requests a booking for the Tour.
   * - Expects 201 Created
   * - Booking document exists in DB with status 'Pending', correct tourId and touristId
   */
  test('Tourist can request a booking for a Tour (201, DB state)', async () => {
    const bookingDate = new Date(Date.now() + 86400000);
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({ tourId, date: bookingDate });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('Pending');
    expect(res.body.tourId).toBe(tourId.toString());
    expect(res.body.touristId).toBe(touristId.toString());
    // DB assertion
    const booking = await Booking.findOne({ tourId, touristId });
    expect(booking).not.toBeNull();
    expect(booking.status).toBe('Pending');
  });

  /**
   * Test 2: Validation
   * Tourist attempts to book a Tour with a date outside availabilityDates.
   * - Expects 400 Bad Request
   * - No booking created in DB
   */
  test('Tourist cannot book a Tour on unavailable date (400, DB state)', async () => {
    const unavailableDate = new Date(Date.now() + 10 * 86400000);
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({ tourId, date: unavailableDate });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/unavailable|date|not available/i);
    // DB assertion
    const booking = await Booking.findOne({ tourId, date: unavailableDate });
    expect(booking).toBeNull();
  });

  /**
   * Test 3: Conflict
   * Tourist attempts to book a Tour on a date already booked and approved.
   * - Expects 409 Conflict
   * - No duplicate booking in DB
   */
  test('Tourist cannot double-book an approved date (409, DB state)', async () => {
    // First, approve a booking for a date
    const bookingDate = new Date(Date.now() + 2 * 86400000);
    const booking = await Booking.create({
      tourId,
      touristId,
      date: bookingDate,
      status: 'Approved',
    });
    // Attempt to book same date
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({ tourId, date: bookingDate });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already booked|conflict/i);
    // DB assertion
    const bookings = await Booking.find({ tourId, date: bookingDate });
    expect(bookings.length).toBe(1);
  });

  /**
   * Test 4: State Change
   * Guide changes booking status from Pending to Approved.
   * - Expects 200 OK
   * - DB reflects status change
   * - Tourist cannot trigger this route (403)
   */
  test('Guide can approve a booking, Tourist cannot (200/403, DB state)', async () => {
    // Create a pending booking
    const bookingDate = new Date(Date.now() + 86400000);
    const booking = await Booking.create({
      tourId,
      touristId,
      date: bookingDate,
      status: 'Pending',
    });
    // Guide approves
    const res = await request(app)
      .patch(`/api/bookings/${booking._id}/status`)
      .set('Authorization', `Bearer ${guideToken}`)
      .send({ status: 'Approved' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Approved');
    // DB assertion
    const updated = await Booking.findById(booking._id);
    expect(updated.status).toBe('Approved');
    // Tourist tries to approve
    const res2 = await request(app)
      .patch(`/api/bookings/${booking._id}/status`)
      .set('Authorization', `Bearer ${touristToken}`)
      .send({ status: 'Approved' });
    expect(res2.status).toBe(403);
    expect(res2.body.message).toMatch(/forbidden|not authorized|role|insufficient permissions/i);
  });
});
