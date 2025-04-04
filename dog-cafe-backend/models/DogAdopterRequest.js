const mongoose = require('mongoose');

const dogAdopterRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DogAdoptionListing',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
        default: 'Pending'
    },
    // Personal Information
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            required: [true, 'State is required']
        },
        postalCode: {
            type: String,
            required: [true, 'Postal code is required']
        }
    },
    // Living Situation
    housingType: {
        type: String,
        enum: ['House', 'Apartment', 'Condo', 'Other'],
        required: true
    },
    hasYard: {
        type: Boolean,
        required: true
    },
    ownRent: {
        type: String,
        enum: ['Own', 'Rent'],
        required: true
    },
    landlordContact: {
        name: String,
        phone: String
    },
    // Household Information
    householdMembers: [{
        relation: String,
        age: Number
    }],
    otherPets: [{
        type: String,
        species: String,
        age: Number
    }],
    // Experience & Plans
    previousPetExperience: {
        type: String,
        required: true
    },
    veterinarianInfo: {
        name: String,
        phone: String,
        address: String
    },
    dailyRoutine: {
        type: String,
        required: true
    },
    exercisePlans: {
        type: String,
        required: true
    },
    // References
    references: [{
        name: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }],
    // Admin Notes
    adminNotes: [{
        note: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
dogAdopterRequestSchema.index({ userId: 1, dogId: 1 });
dogAdopterRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('DogAdopterRequest', dogAdopterRequestSchema);