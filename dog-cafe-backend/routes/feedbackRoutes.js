const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Public routes
router.post('/submit', feedbackController.submitFeedback);
router.get('/getlist', feedbackController.getFeedbackList);
router.get('/:id', feedbackController.getFeedbackById);

// Admin routes (no auth required for now)
router.get('/admin/all', feedbackController.getAllFeedback);
router.post('/:id/respond', feedbackController.respondToFeedback);

module.exports = router;
