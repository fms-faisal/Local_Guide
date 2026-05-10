// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

// POST /api/bookings (Tourist only)
exports.createBooking = async (req, res) => {
  try {
    const { tourId, date } = req.body;
    if (!tourId || !date) return res.status(400).json({ message: 'tourId and date are required' });
    const requestedDate = new Date(date);
    if (isNaN(requestedDate.getTime())) return res.status(400).json({ message: 'Invalid date format' });
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    const matchesAvailability = tour.availabilityDates.some((availableDate) => {
      const a = new Date(availableDate).toISOString().slice(0, 10);
      const r = requestedDate.toISOString().slice(0, 10);
      return a === r;
    });
    if (!matchesAvailability) {
      return res.status(400).json({ message: 'Selected date is not available for this tour' });
    }
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);
    const existingApproved = await Booking.findOne({
      tourId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: 'Approved',
    });
    if (existingApproved) {
      return res.status(409).json({ message: 'Tour already booked for selected date' });
    }
    const booking = new Booking({
      tourId,
      touristId: req.user.id,
      status: 'Pending',
      paymentStatus: 'Pending',
      date: requestedDate,
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create booking', error: err.message });
  }
};

// GET /api/bookings/my-bookings
exports.getMyBookings = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Tourist') {
      filter.touristId = req.user.id;
    } else if (req.user.role === 'Guide') {
      filter['tourId'] = { $in: await Tour.find({ guideId: req.user.id }).distinct('_id') };
    }
    const bookings = await Booking.find(filter).populate('tourId').populate('touristId', 'name');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

// PATCH /api/bookings/:id/status (Guide only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await Booking.findById(req.params.id).populate('tourId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Only guide of the tour can approve/reject
    if (booking.tourId.guideId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update booking', error: err.message });
  }
};
