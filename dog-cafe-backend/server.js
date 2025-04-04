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
    windowMs: 15 * 60 * 1000,
    max: 100
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/adoption", adoptionRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));