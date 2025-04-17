const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                message: 'No authentication token, access denied',
                error: 'TOKEN_MISSING'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, config.jwt.secret);

            // Check token expiration
            if (decoded.exp < Date.now() / 1000) {
                return res.status(401).json({
                    message: 'Token has expired',
                    error: 'TOKEN_EXPIRED'
                });
            }

            // Find user and exclude sensitive fields
            const user = await User.findById(decoded.id)
                .select('-password -createdAt -__v')
                .lean();

            if (!user) {
                return res.status(401).json({
                    message: 'User not found',
                    error: 'USER_NOT_FOUND'
                });
            }

            // Add user and token data to request
            req.user = user;
            req.token = token;
            next();
        } catch (jwtError) {
            return res.status(401).json({
                message: 'Invalid token',
                error: 'TOKEN_INVALID'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: 'SERVER_ERROR'
        });
    }
};

module.exports = auth;