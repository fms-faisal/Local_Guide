const mongoose = require('mongoose');
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

const generateBookingTemplates = () => {
  const cases = [];
  const invalidIds = [null, '', '507f1f77bcf86cd799439011', 'invalid'];
  const invalidDates = [null, '', '2024-02-30', 'bad-date', new Date(Date.now() + 30 * 86400000).toISOString()];
  invalidIds.forEach((id) => {
    invalidDates.forEach((date) => {
      cases.push({ tourId: id, date, expected: 400, useTourId: false });
    });
  });
  const availableDates = [new Date(Date.now() + 86400000), new Date(Date.now() + 2 * 86400000), new Date(Date.now() + 3 * 86400000)];
  availableDates.forEach((date) => {
    cases.push({ tourId: '__TOUR_ID__', date: date.toISOString(), expected: 201, useTourId: true });
    cases.push({ tourId: '__TOUR_ID__', date: date.toISOString(), expected: 409, preApproved: true, approvedDate: date, useTourId: true });
  });
  return cases.slice(0, 300);
};

beforeAll(async () => {
  await connect();
});

describe('Booking Bulk Tests', () => {
  const templates = generateBookingTemplates();

  templates.forEach((template, index) => {
    test(`createBooking boundary case ${index + 1}`, async () => {
      const guide = await User.create({ name: `BookingGuide${index}`, email: `guide${index}@test.com`, password: 'password', role: 'Guide' });
      const tour = await Tour.create({ guideId: guide._id, title: `Bulk Tour ${index}`, description: 'desc', location: 'Dhaka', category: 'Adventure', language: 'English', price: 1200, availabilityDates: [new Date(Date.now() + 86400000), new Date(Date.now() + 2 * 86400000), new Date(Date.now() + 3 * 86400000)] });
      const tourId = template.useTourId ? tour._id.toString() : template.tourId;
      if (template.preApproved) {
        await Booking.create({ tourId: tour._id, touristId: new mongoose.Types.ObjectId(), date: template.approvedDate, status: 'Approved' });
      }
      const req = { body: { tourId, date: template.date }, user: { id: new mongoose.Types.ObjectId().toString(), role: 'Tourist' } };
      const res = mockResponse();
      await bookingController.createBooking(req, res);
      if (template.expected === 201) {
        expect(res.status).toHaveBeenCalledWith(201);
      } else {
        expect(res.status).toHaveBeenCalled();
      }
    });
  });
});
