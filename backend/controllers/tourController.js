// backend/controllers/tourController.js
const Tour = require('../models/Tour');

// GET /api/tours (with search/filter)
exports.getTours = async (req, res) => {
  try {
    const { location, category, price, language } = req.query;
    let filter = {};
    if (location) filter.location = location;
    if (category) filter.category = category;
    if (language) filter.language = language;
    if (price) filter.price = { $lte: Number(price) };
    const tours = await Tour.find(filter).populate('guideId', 'name profileDetails');
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tours', error: err.message });
  }
};

// POST /api/tours (Guide only)
exports.createTour = async (req, res) => {
  try {
    const { title, description, location, category, language, price, availabilityDates } = req.body;
    const tour = new Tour({
      guideId: req.user.id,
      title,
      description,
      location,
      category,
      language,
      price,
      availabilityDates,
    });
    await tour.save();
    res.status(201).json(tour);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create tour', error: err.message });
  }
};

// PUT /api/tours/:id (Guide/Admin)
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    // Only guide who created or admin can update
    if (tour.guideId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    Object.assign(tour, req.body);
    await tour.save();
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update tour', error: err.message });
  }
};

// DELETE /api/tours/:id (Guide/Admin)
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    if (tour.guideId.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await tour.deleteOne();
    res.json({ message: 'Tour deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete tour', error: err.message });
  }
};
