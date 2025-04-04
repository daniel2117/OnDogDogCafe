const express = require('express');
const router = express.Router();
const { 
    getAllDogs,
    getDogById,
    createDog,
    updateDog,
    deleteDog,
    uploadDogImage,
    getDogBreeds,
    getDogStats
} = require('../controllers/dogController');
const auth = require('../middleware/auth');

// Middleware for checking admin role
const checkAdminRole = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Public routes (no authentication required)
router.get('/', getAllDogs);
router.get('/breeds', getDogBreeds);
router.get('/stats', getDogStats);
router.get('/:id', getDogById);

// Protected routes
// Apply auth middleware to specific routes instead of using router.use()
router.post('/', auth, checkAdminRole, createDog);
router.put('/:id', auth, checkAdminRole, updateDog);
router.delete('/:id', auth, checkAdminRole, deleteDog);
router.post('/:id/image', auth, checkAdminRole, uploadDogImage);

module.exports = router;