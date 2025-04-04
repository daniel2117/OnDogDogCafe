const mongoose = require('mongoose');

const TIME_SLOTS = [
    '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00'
];

const SERVICES = {
    CAFE_VISIT: 'Cafe Visit',
    DOG_CAKE: 'Dog Cake',
    SWIMMING_POOL: 'Swimming Pool',
    DOG_DAY_CARE: 'Dog Day Care'
};

const reservationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true,
        enum: TIME_SLOTS
    },
    service: {
        type: String,
        required: true,
        enum: Object.values(SERVICES)
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
    Reservation: mongoose.model('Reservation', reservationSchema),
    TIME_SLOTS,
    SERVICES
};