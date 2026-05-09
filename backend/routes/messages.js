const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Send message
router.post('/', authMiddleware, messageController.sendMessage);
// Get messages between users (optionally for a tour)
router.get('/', authMiddleware, messageController.getMessages);

module.exports = router;
