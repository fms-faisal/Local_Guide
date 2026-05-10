const { connect } = require('../setup/db');
const User = require('../../backend/models/User');
const Tour = require('../../backend/models/Tour');
const Booking = require('../../backend/models/Booking');
const Review = require('../../backend/models/Review');
const tourController = require('../../backend/controllers/tourController');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.set = jest.fn(() => res);
  return res;
};

const mockRequest = (query = {}, body = {}, user = {}) => ({ query, body, params: {}, user });

describe('Tour Controller Unit Tests', () => {
  let guide, tour1, tour2;

  beforeAll(async () => {
    await connect();
  });

  beforeEach(async () => {
    guide = await User.create({ name: 'Guide', email: 'guide@tour.unit', password: 'password', role: 'Guide' });
    tour1 = await Tour.create({
      guideId: guide._id,
      title: 'Dhaka Adventure',
      description: 'desc',
      location: 'Dhaka',
      category: 'Adventure',
      language: 'English',
      price: 1500,
      availabilityDates: [new Date(Date.now() + 86400000)],
    });
    tour2 = await Tour.create({
      guideId: guide._id,
      title: 'Sylhet Heritage',
      description: 'desc',
      location: 'Sylhet',
      category: 'Heritage',
      language: 'Bangla',
      price: 3000,
      availabilityDates: [new Date(Date.now() + 86400000)],
    });
  });

  test('getTours filters by location and returns matching tours', async () => {
    const req = mockRequest({ location: 'Dhaka' });
    const res = mockResponse();

    await tourController.getTours(req, res);

    expect(res.status).not.toHaveBeenCalledWith(500);
    expect(res.set).toHaveBeenCalledWith('X-Total-Count', 1);
    expect(res.json).toHaveBeenCalled();
    const result = res.json.mock.calls[0][0];
    expect(result.length).toBe(1);
    expect(result[0].location).toBe('Dhaka');
  });

  test('getTours filters by price range and returns tours in range', async () => {
    const req = mockRequest({ minPrice: '1000', maxPrice: '2000' });
    const res = mockResponse();

    await tourController.getTours(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.length).toBe(1);
    expect(result[0].price).toBe(1500);
  });

  test('getTours filters by availability date correctly', async () => {
    const dateString = new Date(Date.now() + 86400000).toISOString();
    const req = mockRequest({ date: dateString });
    const res = mockResponse();

    await tourController.getTours(req, res);

    const result = res.json.mock.calls[0][0];
    expect(result.length).toBe(2);
  });

  test('getTours pagination returns a subset and correct count header', async () => {
    const req = mockRequest({ page: '1', limit: '1' });
    const res = mockResponse();

    await tourController.getTours(req, res);

    expect(res.set).toHaveBeenCalledWith('X-Total-Count', 2);
    const result = res.json.mock.calls[0][0];
    expect(result.length).toBe(1);
  });

  test('createTour stores new tour with guideId from req.user', async () => {
    const req = mockRequest({}, {
      title: 'New Tour',
      description: 'desc',
      location: 'Chittagong',
      category: 'Nature',
      language: 'English',
      price: 2000,
      availabilityDates: [new Date(Date.now() + 86400000)],
    }, { id: guide._id });
    const res = mockResponse();

    await tourController.createTour(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const created = res.json.mock.calls[0][0];
    expect(created.guideId.toString()).toBe(guide._id.toString());
  });

  test('updateTour returns 404 when tour does not exist', async () => {
    const req = { params: { id: '608d1f2f2f8fb814c8c4b9c2' }, body: { title: 'Changed' }, user: { id: guide._id, role: 'Guide' } };
    const res = mockResponse();

    await tourController.updateTour(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Tour not found' });
  });

  test('updateTour denies users who are not owner or admin', async () => {
    const otherGuide = await User.create({ name: 'Other', email: 'other@tour.unit', password: 'password', role: 'Guide' });
    const req = { params: { id: tour1._id }, body: { title: 'Changed' }, user: { id: otherGuide._id, role: 'Guide' } };
    const res = mockResponse();

    await tourController.updateTour(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
  });

  test('updateTour allows admin to update any tour', async () => {
    const req = { params: { id: tour1._id }, body: { title: 'Changed' }, user: { id: guide._id, role: 'Admin' } };
    const res = mockResponse();

    await tourController.updateTour(req, res);

    expect(res.json).toHaveBeenCalled();
    const updated = res.json.mock.calls[0][0];
    expect(updated.title).toBe('Changed');
  });

  test('deleteTour removes tour and associated records', async () => {
    const review = await Review.create({ tourId: tour1._id, touristId: guide._id, rating: 5, comment: 'Nice' });
    await Booking.create({ tourId: tour1._id, touristId: guide._id, date: new Date(Date.now() + 86400000), status: 'Pending' });
    const req = { params: { id: tour1._id }, user: { id: guide._id.toString(), role: 'Guide' } };
    const res = mockResponse();

    await tourController.deleteTour(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'Tour deleted' });
    const deletedTour = await Tour.findById(tour1._id);
    expect(deletedTour).toBeNull();
    const deletedReview = await Review.findById(review._id);
    expect(deletedReview).toBeNull();
  });
});
