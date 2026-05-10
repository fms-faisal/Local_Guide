const { connect } = require('../setup/db');
const User = require('../../backend/models/User');
const Tour = require('../../backend/models/Tour');
const Booking = require('../../backend/models/Booking');
const bookingController = require('../../backend/controllers/bookingController');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

const mockRequest = (body, user) => ({ body, user });

describe('Booking Controller Unit Tests', () => {
  let tourist, guide, tour;

  beforeAll(async () => {
    await connect();
  });

  beforeEach(async () => {
    guide = await User.create({
      name: 'Guide',
      email: 'guide@unit.test',
      password: 'password',
      role: 'Guide',
    });
    tourist = await User.create({
      name: 'Tourist',
      email: 'tourist@unit.test',
      password: 'password',
      role: 'Tourist',
    });
    tour = await Tour.create({
      guideId: guide._id,
      title: 'Unit Tour',
      description: 'desc',
      location: 'Dhaka',
      category: 'Adventure',
      language: 'English',
      price: 100,
      availabilityDates: [new Date(Date.now() + 86400000), new Date(Date.now() + 2 * 86400000)],
    });
  });

  test('createBooking returns 400 when required fields are missing', async () => {
    const req = mockRequest({ tourId: tour._id }, tourist);
    const res = mockResponse();

    await bookingController.createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'tourId and date are required' });
  });

  test('createBooking returns 400 for invalid date format', async () => {
    const req = mockRequest({ tourId: tour._id, date: 'invalid-date' }, tourist);
    const res = mockResponse();

    await bookingController.createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid date format' });
  });

  test('createBooking returns 404 if tour does not exist', async () => {
    const req = mockRequest({ tourId: '608d1f2f2f8fb814c8c4b9c0', date: new Date() }, tourist);
    const res = mockResponse();

    await bookingController.createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Tour not found' });
  });

  test('createBooking returns 400 when date is unavailable', async () => {
    const req = mockRequest({ tourId: tour._id, date: new Date(Date.now() + 10 * 86400000) }, tourist);
    const res = mockResponse();

    await bookingController.createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Selected date is not available for this tour' });
  });

  test('createBooking returns 409 for already approved booking date', async () => {
    const conflictDate = new Date(Date.now() + 86400000);
    await Booking.create({
      tourId: tour._id,
      touristId: tourist._id,
      date: conflictDate,
      status: 'Approved',
    });
    const req = mockRequest({ tourId: tour._id, date: conflictDate }, tourist);
    const res = mockResponse();

    await bookingController.createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Tour already booked for selected date' });
  });

  test('createBooking saves a valid booking and returns 201', async () => {
    const bookingDate = new Date(Date.now() + 2 * 86400000);
    const req = mockRequest({ tourId: tour._id, date: bookingDate }, tourist);
    const res = mockResponse();

    await bookingController.createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    const created = res.json.mock.calls[0][0];
    expect(created.status).toBe('Pending');
    expect(created.tourId.toString()).toBe(tour._id.toString());
  });

  test('updateBookingStatus returns 400 for invalid status', async () => {
    const booking = await Booking.create({
      tourId: tour._id,
      touristId: tourist._id,
      date: new Date(Date.now() + 86400000),
      status: 'Pending',
    });
    const req = { params: { id: booking._id }, body: { status: 'Completed' }, user: { id: guide._id } };
    const res = mockResponse();

    await bookingController.updateBookingStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid status' });
  });

  test('updateBookingStatus returns 404 when booking is missing', async () => {
    const req = { params: { id: '608d1f2f2f8fb814c8c4b9c1' }, body: { status: 'Approved' }, user: { id: guide._id } };
    const res = mockResponse();

    await bookingController.updateBookingStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Booking not found' });
  });

  test('updateBookingStatus denies a guide who does not own the tour', async () => {
    const otherGuide = await User.create({ name: 'OtherGuide', email: 'other@unit.test', password: 'password', role: 'Guide' });
    const booking = await Booking.create({ tourId: tour._id, touristId: tourist._id, date: new Date(Date.now() + 86400000), status: 'Pending' });
    const req = { params: { id: booking._id }, body: { status: 'Approved' }, user: { id: otherGuide._id } };
    const res = mockResponse();

    await bookingController.updateBookingStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
  });

  test('updateBookingStatus approves a booking when the guide owns the tour', async () => {
    const booking = await Booking.create({ tourId: tour._id, touristId: tourist._id, date: new Date(Date.now() + 86400000), status: 'Pending' });
    const req = { params: { id: booking._id }, body: { status: 'Approved' }, user: { id: guide._id.toString() } };
    const res = mockResponse();

    await bookingController.updateBookingStatus(req, res);

    expect(res.json).toHaveBeenCalled();
    const updated = res.json.mock.calls[0][0];
    expect(updated.status).toBe('Approved');
  });
});
