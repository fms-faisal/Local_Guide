// backend/controllers/adminController.js
const User = require('../models/User');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// GET /api/admin/users - Admin only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// DELETE /api/admin/users/:id - Admin only
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'Guide') {
      const tours = await Tour.find({ guideId: user._id });
      const tourIds = tours.map((tour) => tour._id);
      await Tour.deleteMany({ guideId: user._id });
      await Booking.deleteMany({ tourId: { $in: tourIds } });
      await Review.deleteMany({ tourId: { $in: tourIds } });
    }
    if (user.role === 'Tourist') {
      await Booking.deleteMany({ touristId: user._id });
      await Review.deleteMany({ touristId: user._id });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
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
