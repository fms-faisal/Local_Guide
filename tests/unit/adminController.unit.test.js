const { connect } = require('../setup/db');
const User = require('../../backend/models/User');
const Tour = require('../../backend/models/Tour');
const Booking = require('../../backend/models/Booking');
const Review = require('../../backend/models/Review');
const adminController = require('../../backend/controllers/adminController');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

const mockRequest = (params = {}, body = {}, user = {}) => ({ params, body, user });

describe('Admin Controller Unit Tests', () => {
  beforeAll(async () => {
    await connect();
  });

  test('getAllUsers returns users without password fields', async () => {
    await User.create({ name: 'Admin', email: 'admin@unit.test', password: 'password', role: 'Admin' });
    const req = mockRequest();
    const res = mockResponse();

    await adminController.getAllUsers(req, res);

    expect(res.json).toHaveBeenCalled();
    const users = res.json.mock.calls[0][0];
    expect(users.length).toBeGreaterThanOrEqual(1);
    expect(users[0].password).toBeUndefined();
  });

  test('getStats returns counts for users, tours, and bookings', async () => {
    const admin = await User.create({ name: 'Admin2', email: 'stats@unit.test', password: 'password', role: 'Admin' });
    const guide = await User.create({ name: 'Guide2', email: 'guide2@unit.test', password: 'password', role: 'Guide' });
    const tour = await Tour.create({ guideId: guide._id, title: 'Stats Tour', description: 'desc', location: 'Dhaka', category: 'Adventure', language: 'English', price: 500, availabilityDates: [new Date(Date.now() + 86400000)] });
    await Booking.create({ tourId: tour._id, touristId: admin._id, date: new Date(Date.now() + 86400000), status: 'Pending' });

    const req = mockRequest();
    const res = mockResponse();

    await adminController.getStats(req, res);

    expect(res.json).toHaveBeenCalled();
    const stats = res.json.mock.calls[0][0];
    expect(stats.users).toBeGreaterThanOrEqual(2);
    expect(stats.tours).toBeGreaterThanOrEqual(1);
    expect(stats.bookings).toBeGreaterThanOrEqual(1);
  });

  test('deleteUser removes Guide and cascades Tour, Booking, Review deletion', async () => {
    const guide = await User.create({ name: 'CascadeGuide', email: 'guide.cascade@unit.test', password: 'password', role: 'Guide' });
    const tour = await Tour.create({ guideId: guide._id, title: 'Cascade Tour', description: 'desc', location: 'Dhaka', category: 'Nature', language: 'English', price: 300, availabilityDates: [new Date(Date.now() + 86400000)] });
    await Booking.create({ tourId: tour._id, touristId: guide._id, date: new Date(Date.now() + 86400000), status: 'Pending' });
    await Review.create({ tourId: tour._id, touristId: guide._id, rating: 4, comment: 'Good' });

    const req = mockRequest({ id: guide._id });
    const res = mockResponse();

    await adminController.deleteUser(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
    expect(await User.findById(guide._id)).toBeNull();
    expect(await Tour.findOne({ guideId: guide._id })).toBeNull();
    expect(await Booking.findOne({ tourId: tour._id })).toBeNull();
    expect(await Review.findOne({ tourId: tour._id })).toBeNull();
  });

  test('deleteUser removes Tourist and cascades Booking and Review deletion', async () => {
    const tourist = await User.create({ name: 'CascadeTourist', email: 'tourist.cascade@unit.test', password: 'password', role: 'Tourist' });
    const guide = await User.create({ name: 'GuideX', email: 'guide.x@unit.test', password: 'password', role: 'Guide' });
    const tour = await Tour.create({ guideId: guide._id, title: 'Cascade Tour2', description: 'desc', location: 'Chittagong', category: 'Adventure', language: 'Bangla', price: 400, availabilityDates: [new Date(Date.now() + 86400000)] });
    await Booking.create({ tourId: tour._id, touristId: tourist._id, date: new Date(Date.now() + 86400000), status: 'Pending' });
    await Review.create({ tourId: tour._id, touristId: tourist._id, rating: 5, comment: 'Excellent' });

    const req = mockRequest({ id: tourist._id });
    const res = mockResponse();

    await adminController.deleteUser(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
    expect(await User.findById(tourist._id)).toBeNull();
    expect(await Booking.findOne({ touristId: tourist._id })).toBeNull();
    expect(await Review.findOne({ touristId: tourist._id })).toBeNull();
  });
});
