const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    description: String,
    image: String,
    status: {
        type: String,
        enum: ['available', 'pending', 'adopted'],
        default: 'available'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Dog', dogSchema);