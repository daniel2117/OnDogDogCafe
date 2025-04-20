const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['cafe', 'adoption', 'general']
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    visitDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'responded'],
        default: 'pending'
    },
    adminResponse: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
