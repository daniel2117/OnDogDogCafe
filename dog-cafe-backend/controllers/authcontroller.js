const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    });
};

const authController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Check if user exists
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create user
            const user = await User.create({
                name,
                email,
                password,
                role: 'user'
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                message: 'Registration failed',
                error: error.message
            });
        }
    },

    registerAdmin: async (req, res) => {
        try {
            const { name, email, password, adminSecret } = req.body;

            // Verify admin secret
            if (adminSecret !== config.admin.secret) {
                return res.status(403).json({ message: 'Invalid admin secret' });
            }

            // Check if user exists
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create admin user
            const user = await User.create({
                name,
                email,
                password,
                role: 'admin'
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } catch (error) {
            console.error('Admin registration error:', error);
            res.status(500).json({
                message: 'Admin registration failed',
                error: error.message
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Check for user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Check password
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                message: 'Login failed',
                error: error.message
            });
        }
    },

    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                message: 'Failed to get profile',
                error: error.message
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const { name, email, password } = req.body;

            // Update fields if provided
            if (name) user.name = name;
            if (email) user.email = email;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                message: 'Failed to update profile',
                error: error.message
            });
        }
    }
};

module.exports = authController;