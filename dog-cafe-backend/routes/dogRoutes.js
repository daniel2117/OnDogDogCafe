const express = require('express');
const router = express.Router();
const dogController = require('../controllers/dogcontroller');

// Destructure all required controller methods
const {
    getAllDogs,
    getDogById,
    createDog,
    updateDog,
    deleteDog,
    uploadDogImage,
    getDogBreeds,
    getDogStats,
    getSimilarDogs
} = dogController;

// Public routes (no authentication required)
router.get('/', getAllDogs);
router.get('/breeds', getDogBreeds);
router.get('/stats', getDogStats);
router.get('/:id', getDogById);
router.get('/:id/similar', getSimilarDogs);

// Protected routes (admin only)
router.post('/', createDog);
router.put('/:id', updateDog);
router.delete('/:id', deleteDog);
router.post('/:id/image', uploadDogImage);

module.exports = router;