const Review = require('../models/Review');
const Tour = require('../models/Tour');

// POST /api/reviews (Tourist only)
exports.createReview = async (req, res) => {
  try {
    const { tourId, rating, comment } = req.body;
    if (!tourId || !rating) {
      return res.status(400).json({ message: 'tourId and rating are required' });
    }
    // Check if the user already reviewed this tour
    const existing = await Review.findOne({ tourId, touristId: req.user.id });
    if (existing) {
      return res.status(409).json({ message: 'You have already reviewed this tour' });
    }
    // Optionally: Check if the user booked this tour
    const review = new Review({
      tourId,
      touristId: req.user.id,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create review', error: err.message });
  }
};

// GET /api/reviews/:tourId
exports.getTourReviews = async (req, res) => {
  try {
    const { tourId } = req.params;
    const reviews = await Review.find({ tourId }).populate('touristId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

// DELETE /api/reviews/:id (Tourist or Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.touristId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};
