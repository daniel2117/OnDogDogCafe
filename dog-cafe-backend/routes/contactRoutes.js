const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactcontroller');

// Public route for submitting inquiries
router.post('/submit', contactController.submitInquiry);

// Admin routes (no auth required for now)
router.get('/inquiries', contactController.getInquiries);
router.patch('/inquiries/:id/status', contactController.updateInquiryStatus);

module.exports = router;
