const express = require('express');
const router = express.Router();
const { 
    getAllDogs,
    getDogById,
    createAdoptionApplication,
    getMyApplications,
    updateApplication,
    withdrawApplication
} = require('../controllers/adoptionController');
const auth = require('../middleware/auth');
const { validateAdoptionApplication } = require('../middleware/validate');

// Public routes
router.get('/dogs', getAllDogs);
router.get('/dogs/:id', getDogById);

// Protected routes
router.use(auth); // Apply auth middleware to all routes below
router.post('/apply', validateAdoptionApplication, createAdoptionApplication);
router.get('/my-applications', getMyApplications);
router.put('/applications/:id', validateAdoptionApplication, updateApplication);
router.delete('/applications/:id', withdrawApplication);

module.exports = router;