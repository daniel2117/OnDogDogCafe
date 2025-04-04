const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authcontroller');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', authcontroller.register);
router.post('/login', authcontroller.login);

// Protected routes (require authentication)
router.get('/profile', auth, authcontroller.getProfile);
router.post('/register-admin', authcontroller.registerAdmin);
router.put('/profile', auth, authcontroller.updateProfile);

// Route to check if token is valid
router.get('/verify', auth, (req, res) => {
    res.json({ 
        valid: true, 
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

module.exports = router;