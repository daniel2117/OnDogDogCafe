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

// Route imports
const reservationRoutes = require("./routes/reservationRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Enhanced Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(compression());

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 3600
};
app.use(cors(corsOptions));

// Rate Limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});

const adoptionLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 5,
    message: 'Maximum adoption applications limit reached for today.'
});

const reservationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Maximum reservation limit reached for this hour.'
});

app.use('/api/', generalLimiter);
app.use('/api/adoption/applications', adoptionLimiter);
app.use('/api/reservations', reservationLimiter);

// File Upload Middleware
app.use(fileUpload({
    limits: { fileSize: config.uploads.maxSize },
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: '/tmp/',
    debug: process.env.NODE_ENV === 'development'
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const connectDB = require('./db');
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/adoption", adoptionRoutes);

// Error Handler
app.use(errorHandler);

// Root Route
app.get("/", (req, res) => {
    res.json({
        message: "Dog Cafe API is Running",
        version: "2.0",
        endpoints: {
            auth: "/api/auth",
            reservations: "/api/reservations",
            adoption: "/api/adoption"
        }
    });
});

// Cleanup function
const cleanup = async () => {
    try {
        console.log("\n Shutting down server...");
        await mongoose.connection.close();
        console.log(" Database connection closed.");
        process.exit(0);
    } catch (err) {
        console.error(" Error during cleanup:", err);
        process.exit(1);
    }
};

// Event handlers
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});
process.on("uncaughtException", (err) => {
    console.error(" Uncaught Exception:", err);
    cleanup();
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV}`);
});

module.exports = app; // Export for testing