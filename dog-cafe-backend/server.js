const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dogRoutes = require('./routes/dogRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Connect to MongoDB
mongoose.connect(config.database.url, config.database.options)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dogs', dogRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/adoption', adoptionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});