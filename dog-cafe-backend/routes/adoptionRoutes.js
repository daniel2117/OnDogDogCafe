const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptioncontroller');
const { upload } = require('../utils/gridfsStorage');

// Get all available dogs for adoption
router.get('/dogs', adoptionController.getAllDogs);

// Get specific dog details
router.get('/dogs/:id', adoptionController.getDogById);

// Updated apply route with image upload support
router.post('/apply', upload.array('homeImages', 5), adoptionController.createAdoptionApplication);

// Get similar dogs
router.get('/dogs/:id/similar', adoptionController.getSimilarDogs);

// Get filters
router.get('/filters', adoptionController.getFilters);

// Add new routes for image handling
router.get('/images/:filename', adoptionController.getImage);
router.delete('/images/:filename', adoptionController.deleteImage);

module.exports = router;