const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactcontroller');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Public route for submitting inquiries
router.post('/submit', contactController.submitInquiry);

// Admin routes
router.get('/inquiries', auth, roleCheck('admin'), contactController.getInquiries);
router.patch('/inquiries/:id/status', auth, roleCheck('admin'), contactController.updateInquiryStatus);

module.exports = router;
