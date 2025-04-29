const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptioncontroller');
const gridfsStorage = require('../utils/gridfsStorage');

// Get all available dogs for adoption
router.get('/dogs', adoptionController.getAllDogs);

// Get specific dog details
router.get('/dogs/:id', adoptionController.getDogById);

// New route for image uploads
router.post(
    '/upload/images',
    gridfsStorage.upload.array('images', 5),
    async (req, res) => {
        try {
            const files = await Promise.all(
                req.files.map(file => gridfsStorage.saveFile(file, 'adoption-images'))
            );
            res.json(files);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Updated apply route without image upload middleware
router.post('/apply', adoptionController.createAdoptionApplication);

// Get similar dogs
router.get('/dogs/:id/similar', adoptionController.getSimilarDogs);

// Get filters
router.get('/filters', adoptionController.getFilters);

// Add new route for getting applications by dog ID
router.get('/application/:id', adoptionController.getApplicationsByDogId);

// Add new routes for image handling
router.get('/images/:filename', adoptionController.getImage);
router.delete('/images/:filename', adoptionController.deleteImage);

module.exports = router;