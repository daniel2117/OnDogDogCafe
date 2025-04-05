const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        en: String,
        zh: String
    },
    description: {
        en: String,
        zh: String
    },
    image: String,
    pricing: {
        amount: Number,
        currency: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Service', serviceSchema);