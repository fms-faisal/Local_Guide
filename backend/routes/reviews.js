const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Create review (Tourist only)
router.post('/', authMiddleware, roleMiddleware('Tourist'), reviewController.createReview);
// Get all reviews for a tour
router.get('/:tourId', reviewController.getTourReviews);
// Delete review (Tourist or Admin)
router.delete('/:id', authMiddleware, roleMiddleware(['Tourist', 'Admin']), reviewController.deleteReview);

module.exports = router;
