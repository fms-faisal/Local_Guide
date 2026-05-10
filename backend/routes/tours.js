// backend/routes/tours.js
const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', tourController.getTours);
router.get('/:id', tourController.getTourById);
router.post('/', authMiddleware, roleMiddleware('Guide'), tourController.createTour);
router.put('/:id', authMiddleware, roleMiddleware(['Guide', 'Admin']), tourController.updateTour);
router.delete('/:id', authMiddleware, roleMiddleware(['Guide', 'Admin']), tourController.deleteTour);

module.exports = router;
