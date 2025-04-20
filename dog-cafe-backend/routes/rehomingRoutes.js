const express = require('express');
const router = express.Router();
const rehomingController = require('../controllers/rehomingController');
const localImageStorage = require('../utils/localImageStorage');
const { validateRehomingApplication } = require('../middleware/validate');

// Public routes
router.post(
    '/submit',
    validateRehomingApplication,
    rehomingController.submitApplication
);

router.post(
    '/upload/photos',
    localImageStorage.upload.array('photos', 5), 
    rehomingController.uploadPhotos
);

router.post(
    '/upload/documents',
    localImageStorage.upload.array('documents', 5), 
    rehomingController.uploadDocuments
);

router.get('/uploads', rehomingController.getUploadedFiles);

router.get('/application/:id', rehomingController.getApplicationById);
router.get('/applications', rehomingController.getApplicationsByEmail);
router.put('/application/:id', rehomingController.updateApplication);

// Admin routes (no auth required for now)
router.get('/admin/applications', rehomingController.getAllApplications);
router.patch('/admin/application/:id/status', rehomingController.updateApplicationStatus);

module.exports = router;
