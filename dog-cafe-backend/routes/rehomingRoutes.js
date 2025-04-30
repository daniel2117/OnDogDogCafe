const express = require('express');
const router = express.Router();
const rehomingController = require('../controllers/rehomingController');
const gridfsStorage = require('../utils/gridfsStorage');
const { validateRehomingApplication } = require('../middleware/validate');

// Public routes
router.post(
    '/submit',
    validateRehomingApplication,
    rehomingController.submitApplication
);

// Add withdrawal endpoint
router.post('/application/:id/withdraw', rehomingController.withdrawApplication);

router.post(
    '/upload/photos',
    gridfsStorage.upload.array('photos', 5), 
    async (req, res) => {
        try {
            const files = await Promise.all(
                req.files.map(file => gridfsStorage.saveFile(file, 'photos'))
            );
            res.json(files);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.post(
    '/upload/documents',
    gridfsStorage.upload.array('documents', 5), 
    async (req, res) => {
        try {
            const files = await Promise.all(
                req.files.map(file => gridfsStorage.saveFile(file, 'documents'))
            );
            res.json(files);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.get('/uploads', rehomingController.getUploadedFiles);

router.get('/application/:id', rehomingController.getApplicationById);
router.get('/applications', rehomingController.getApplicationsByEmail);
router.put('/application/:id', rehomingController.updateApplication);

// Admin routes (no auth required for now)
router.get('/admin/applications', rehomingController.getAllApplications);
router.patch('/admin/application/:id/status', rehomingController.updateApplicationStatus);

module.exports = router;
