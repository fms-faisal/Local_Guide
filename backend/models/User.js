// backend/models/User.js
const mongoose = require('mongoose');

const profileDetailsSchema = new mongoose.Schema({
  bio: { type: String },
  location: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Tourist', 'Guide', 'Admin'],
    default: 'Tourist',
    required: true,
  },
  profileDetails: profileDetailsSchema,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
