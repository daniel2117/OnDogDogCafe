const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dogRoutes = require('./routes/dogRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');
const contentRoutes = require('./routes/contentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const rehomingRoutes = require('./routes/rehomingRoutes');
const myPageRoutes = require('./routes/myPageRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Define allowed origins
const allowedOrigins = [
    'http://localhost:3000',
    'https://ondogdogcafe.onrender.com'
];

// Updated CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    maxAge: 86400 // CORS preflight cache time
}));

app.use(mongoSanitize());
app.use(compression());
app.use(express.json({ limit: '10kb' }));

// Middleware
app.use('/api', contentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.use((req, res, next) => {
    req.language = req.headers['accept-language']?.includes('zh') ? 'zh' : 'en';
    next();
});

// Connect to MongoDB with timeout
const connectWithRetry = async () => {
    try {
        await mongoose.connect(config.database.url, {
            ...config.database.options,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.log('Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dogs', dogRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/adoption', adoptionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/rehoming', rehomingRoutes);
app.use('/api/mypage', myPageRoutes);
app.use('/api/feedback', feedbackRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Global error handler should be last
app.use(errorHandler);

// Improved shutdown handling
const shutdown = async () => {
    console.log('Shutting down gracefully...');
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server with proper error handling
const PORT = config.port;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
});