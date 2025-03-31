const express = require('express');
const {
    getAvailableDogs,
    getDogDetails,
    getFilteredDogs,
    toggleDogInterest,
    getTrendingDogs,
    submitAdoptionRequest,
    reviewAdoptionRequest,
    submitAdopterRequest
} = require('../controllers/adoptionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/dogs', getAvailableDogs);
router.get('/dogs/trending', getTrendingDogs);
router.get('/dogs/filtered', getFilteredDogs);
router.get('/dogs/:id', getDogDetails);

// Protected routes
router.post('/dogs/:id/interest', protect, toggleDogInterest);
router.post('/submit', protect, submitAdoptionRequest);
router.put('/review/:id', protect, reviewAdoptionRequest);
router.post('/adopt', protect, submitAdopterRequest);

module.exports = router;