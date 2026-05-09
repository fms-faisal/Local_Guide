const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content, tourId } = req.body;
    const message = new Message({
      sender: req.user.id,
      receiver,
      tourId,
      content
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
};

// Get messages between two users (optionally for a tour)
exports.getMessages = async (req, res) => {
  try {
    const { userId, tourId } = req.query;
    const filter = {
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    };
    if (tourId) filter.tourId = tourId;
    const messages = await Message.find(filter).sort('createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
};
