const express = require('express');
const router = express.Router();
const rehomingController = require('../controllers/rehomingController');
const localImageStorage = require('../utils/localImageStorage');
const { roleCheck } = require('../middleware/roleCheck');
const { validateRehomingApplication } = require('../middleware/validate');

// Public routes
router.post(
    '/submit',
    validateRehomingApplication,
    rehomingController.submitApplication
);

router.post(
    '/upload/photos',
    localImageStorage.upload.array('photos', 5), // Limit to 5 photos
    rehomingController.uploadPhotos
);

router.post(
    '/upload/documents',
    localImageStorage.upload.array('documents', 5), // Limit to 5 documents
    rehomingController.uploadDocuments
);

router.get('/uploads', rehomingController.getUploadedFiles);

router.get('/application/:id', rehomingController.getApplicationById);
router.get('/applications', rehomingController.getApplicationsByEmail);
router.put('/application/:id', rehomingController.updateApplication);

// Admin routes
router.get('/admin/applications', roleCheck('admin'), rehomingController.getAllApplications);
router.patch('/admin/application/:id/status', roleCheck('admin'), rehomingController.updateApplicationStatus);

module.exports = router;
