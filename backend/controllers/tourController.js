const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/tours (with search/filter)
exports.getTours = async (req, res) => {
  try {
    const { search, location, category, minPrice, maxPrice, language, rating, date, page = 1, limit = 6 } = req.query;
    let filter = {};
    if (search || location) {
      const term = search || location;
      const regex = { $regex: escapeRegex(term), $options: 'i' };
      filter.$or = [
        { location: regex },
        { title: regex },
        { description: regex },
        { category: regex },
        { language: regex }
      ];
    }
    if (category) filter.category = { $regex: escapeRegex(category), $options: 'i' };
    if (language) filter.language = { $regex: escapeRegex(language), $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (date) {
      const requestedDate = new Date(date);
      if (isNaN(requestedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date filter' });
      }
      const startOfDay = new Date(requestedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(requestedDate);
      endOfDay.setHours(23, 59, 59, 999);
      filter.availabilityDates = { $elemMatch: { $gte: startOfDay, $lte: endOfDay } };
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const validPage = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
    const validLimit = Number.isInteger(limitNumber) && limitNumber > 0 ? limitNumber : 6;
    const skip = (validPage - 1) * validLimit;
    const total = await Tour.countDocuments(filter);
    const tours = await Tour.find(filter)
      .populate('guideId', 'name profileDetails')
      .skip(skip)
      .limit(validLimit);
    res.set('X-Total-Count', total);
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tours', error: err.message });
  }
};

// GET /api/tours/:id
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('guideId', 'name profileDetails');
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tour', error: err.message });
  }
};

// POST /api/tours (Guide only)
exports.createTour = async (req, res) => {
  try {
    const { title, description, location, category, language, price, availabilityDates, image } = req.body;
    const tour = new Tour({
      guideId: req.user.id,
      title,
      description,
      location,
      category,
      language,
      price,
      availabilityDates,
      image,
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
    await Booking.deleteMany({ tourId: tour._id });
    await Review.deleteMany({ tourId: tour._id });
    await tour.deleteOne();
    res.json({ message: 'Tour deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete tour', error: err.message });
  }
};
