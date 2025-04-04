const express = require('express');
const router = express.Router();
const { 
    getAllDogs, 
    getDogById, 
    createAdoptionApplication, 
    getMyApplications 
} = require('../controllers/adoptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dogs', getAllDogs);
router.get('/dogs/:id', getDogById);
router.post('/apply', protect, createAdoptionApplication);
router.get('/applications', protect, getMyApplications);

module.exports = router;