const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['terms', 'privacy'],
        required: true
    },
    content: {
        en: {
            type: String,
            required: true
        },
        zh: {
            type: String,
            required: true
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Content', contentSchema);
