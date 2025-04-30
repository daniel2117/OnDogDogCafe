const mongoose = require('mongoose');

const TIME_SLOTS = [
    '13:00', '14:00', '15:00', '16:00', 
    '17:00', '18:00'
];

const SERVICES = {
    CAFE_VISIT: 'Cafe Visit',
    DOG_PARTY: 'Dog Party',  // Changed from DOG_CAKE
    SWIMMING_POOL: 'Swimming Pool',
    DOG_DAY_CARE: 'Dog Day Care'
};

const SERVICE_CONSTRAINTS = {
    'Dog Party': {
        maxPerSlot: 1,
        excludes: ['Cafe Visit']
    },
    'Cafe Visit': {
        maxPerSlot: 2,
        excludes: ['Dog Party']
    }
};

const reservationSchema = new mongoose.Schema({
    customerInfo: {
        name: { 
            type: String, 
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        phone: { 
            type: String, 
            required: [true, 'Phone is required'],
            match: [/^\+?[\d\s-]+$/, 'Please enter a valid phone number']
        },
        email: { 
            type: String, 
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
        },
        petName: {
            type: String,
            trim: true,
            maxlength: [30, 'Pet name cannot exceed 30 characters']
        },
        petType: String,
        location: String,
        message: {
            type: String,
            maxlength: [500, 'Message cannot exceed 500 characters']
        }
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v >= new Date().setHours(0, 0, 0, 0);
            },
            message: 'Reservation date must be in the future'
        }
    },
    timeSlot: {
        type: String,
        required: true,
        enum: {
            values: TIME_SLOTS,
            message: 'Invalid time slot'
        }
    },
    numberOfPeople: {
        type: Number,
        required: [true, 'Number of people is required'],
        min: [1, 'Minimum number of people is 1'],
        max: [10, 'Maximum number of people is 10'],
        validate: {
            validator: Number.isInteger,
            message: 'Number of people must be a whole number'
        }
    },
    selectedServices: [{
        type: String,
        enum: {
            values: Object.values(SERVICES),
            message: 'Invalid service selected'
        },
        required: true
    }],
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed',
        index: true
    },
    verificationCode: {
        code: String,
        expiresAt: Date
    }
}, { 
    timestamps: true,
    // Add optimistic concurrency control
    version: true
});

// Add compound indexes for better query performance
reservationSchema.index({ date: 1, timeSlot: 1, status: 1 });
reservationSchema.index({ 'customerInfo.email': 1 });
reservationSchema.index({ createdAt: -1 });

// Add method to check availability
reservationSchema.statics.checkAvailability = async function(date, timeSlot, services) {
    // Get existing reservations for this time slot
    const existingReservations = await this.find({
        date: date,
        timeSlot: timeSlot,
        status: { $ne: 'cancelled' }
    });

    // Check for each requested service
    for (const service of services) {
        const constraint = SERVICE_CONSTRAINTS[service];
        if (!constraint) continue;

        // Count existing reservations with this service
        const serviceCount = existingReservations.filter(res => 
            res.selectedServices.includes(service)
        ).length;

        // Check if adding this reservation would exceed the limit
        if (serviceCount >= constraint.maxPerSlot) {
            return false;
        }

        // Check for mutually exclusive services
        if (constraint.excludes) {
            const hasExcludedService = existingReservations.some(res =>
                res.selectedServices.some(s => constraint.excludes.includes(s))
            );
            if (hasExcludedService) {
                return false;
            }
        }
    }

    return true;
};

// Add middleware to prevent duplicate reservations
reservationSchema.pre('save', async function(next) {
    if (this.isNew) {
        const isAvailable = await this.constructor.checkAvailability(
            this.date,
            this.timeSlot,
            this.selectedServices
        );

        if (!isAvailable) {
            throw new Error('This time slot is no longer available');
        }
    }
    next();
});

module.exports = {
    Reservation: mongoose.model('Reservation', reservationSchema),
    TIME_SLOTS,
    SERVICES
};
