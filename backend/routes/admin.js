// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Only Admin can access these routes
router.get('/users', authMiddleware, roleMiddleware('Admin'), adminController.getAllUsers);
router.get('/stats', authMiddleware, roleMiddleware('Admin'), adminController.getStats);

module.exports = router;
