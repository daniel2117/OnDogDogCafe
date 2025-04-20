const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptioncontroller');
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Maximum 5 files
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'), false);
        }
    }
});

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

module.exports = router;