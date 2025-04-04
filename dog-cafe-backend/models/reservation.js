const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    numberOfPeople: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    specialRequests: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);