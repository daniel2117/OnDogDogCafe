const mongoose = require('mongoose');

const businessInfoSchema = new mongoose.Schema({
    name: {
        en: String,
        zh: String
    },
    address: {
        en: String,
        zh: String
    },
    contact: {
        phone: String,
        email: String
    },
    openingHours: [{
        day: String,
        hours: String
    }],
    location: {
        coordinates: {
            lat: Number,
            lng: Number
        }
    }
});

module.exports = mongoose.model('BusinessInfo', businessInfoSchema);