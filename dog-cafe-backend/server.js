const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const fileUpload = require('express-fileupload');
const path = require('path');
const config = require('./config/config');

// Model imports
const Dog = require('./models/Dog'); // Add this line

// Route imports
const reservationRoutes = require("./routes/reservationRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require('./middleware/errorHandler');

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(compression());

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File Upload
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    createParentPath: true
}));

// Static Files
app.use('/uploads', express.static('uploads'));

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/adoption", adoptionRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Basic CRUD test routes for dogs
app.get('/api/dogs', async (req, res) => {
    try {
        const dogs = await Dog.find({});
        res.json(dogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/dogs', async (req, res) => {
    try {
        const dog = new Dog(req.body);
        const savedDog = await dog.save();
        res.status(201).json(savedDog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Error Handler (should be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    app.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});