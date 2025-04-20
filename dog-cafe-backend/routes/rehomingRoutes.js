const express = require('express');
const router = express.Router();
const rehomingController = require('../controllers/rehomingController');
const auth = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Public routes
router.post('/submit', rehomingController.submitApplication);
router.get('/application/:id', rehomingController.getApplicationById);
router.get('/applications', rehomingController.getApplicationsByEmail);
router.put('/application/:id', rehomingController.updateApplication);

// Admin routes
router.get('/admin/applications', auth, roleCheck('admin'), rehomingController.getAllApplications);
router.patch('/admin/application/:id/status', auth, roleCheck('admin'), rehomingController.updateApplicationStatus);

module.exports = router;
