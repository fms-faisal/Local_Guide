// backend/routes/bookings.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware('Tourist'), bookingController.createBooking);
router.get('/my-bookings', authMiddleware, bookingController.getMyBookings);
router.patch('/:id/status', authMiddleware, roleMiddleware('Guide'), bookingController.updateBookingStatus);

module.exports = router;
