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
    customerInfo: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        petName: String,
        petType: String,
        location: String,
        message: String
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
    selectedServices: [{
        type: String,
        enum: Object.values(SERVICES),
        required: true
    }],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = {
    Reservation: mongoose.model('Reservation', reservationSchema),
    TIME_SLOTS,
    SERVICES
};
