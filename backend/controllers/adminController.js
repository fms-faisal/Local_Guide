// backend/controllers/adminController.js
const User = require('../models/User');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');

// GET /api/users - Admin only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// GET /api/stats - Admin only
exports.getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const tours = await Tour.countDocuments();
    const bookings = await Booking.countDocuments();
    res.json({ users, tours, bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};
