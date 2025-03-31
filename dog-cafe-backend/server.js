const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const rateLimit = require('express-rate-limit'); // Add rate limiting
const helmet = require('helmet'); // Add security headers
const mongoSanitize = require('express-mongo-sanitize'); // Prevent NoSQL injection
const compression = require('compression'); // Add compression

// Route imports
const reservationRoutes = require("./routes/reservationRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const authRoutes = require("./routes/authRoutes"); // Add authentication routes

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
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Special rate limit for interest toggles
const interestLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // limit each IP to 50 interest toggles per hour
    message: 'Too many interest actions, please try again later.'
});
app.use('/api/adoption/dogs/:id/interest', interestLimiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection with enhanced options
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true, // Build indexes
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        });

        console.log("🟢 MongoDB Connected Successfully");

        // Handle connection events
        mongoose.connection.on("error", (err) => {
            console.error("🔴 MongoDB Connection Error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("🟡 MongoDB Disconnected");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("🟢 MongoDB Reconnected");
        });

    } catch (err) {
        console.error("🔴 Initial MongoDB Connection Error:", err);
        process.exit(1);
    }
};

// Call Database Connection
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/adoption", adoptionRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('🔴 Error:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
});

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
        console.log("\n🟡 Shutting down server...");
        await mongoose.connection.close();
        console.log("🟢 Database connection closed.");
        process.exit(0);
    } catch (err) {
        console.error("🔴 Error during cleanup:", err);
        process.exit(1);
    }
};

// Graceful shutdown handlers
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Error handlers
process.on("unhandledRejection", (err) => {
    console.error("🔴 Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
    console.error("🔴 Uncaught Exception:", err);
    cleanup();
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🟢 Server running on port ${PORT}`);
    console.log(`🌐 API Documentation: http://localhost:${PORT}/api-docs`);
});