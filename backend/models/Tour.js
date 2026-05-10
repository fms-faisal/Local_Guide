// backend/models/Tour.js
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  language: { type: String, required: true },
  price: { type: Number, required: true },
  availabilityDates: [{ type: Date, required: true }],
  image: { type: String },
  rating: { type: Number, default: 4.8 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tour', tourSchema);
