const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptioncontroller');

// Get all available dogs for adoption
router.get('/dogs', adoptionController.getAllDogs);

// Get specific dog details
router.get('/dogs/:id', adoptionController.getDogById);

// Create adoption application
router.post('/apply', adoptionController.createAdoptionApplication);

// Get similar dogs
router.get('/dogs/:id/similar', adoptionController.getSimilarDogs);

module.exports = router;