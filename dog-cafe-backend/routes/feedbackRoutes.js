const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Public routes
router.post('/submit', feedbackController.submitFeedback);
router.get('/:id', feedbackController.getFeedbackById);

// Admin routes
router.get('/admin/all', auth, roleCheck('admin'), feedbackController.getAllFeedback);
router.post('/:id/respond', auth, roleCheck('admin'), feedbackController.respondToFeedback);

module.exports = router;
