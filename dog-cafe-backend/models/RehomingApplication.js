const mongoose = require('mongoose');

const rehomingApplicationSchema = new mongoose.Schema({
    ownerInfo: {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        }
    },
    petInfo: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['dog', 'cat'],
            required: true
        },
        age: {
            type: Number,
            required: true,
            min: 0
        },
        size: {
            type: String,
            enum: ['small', 'medium', 'large'],
            required: true
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: true
        },
        breed: {
            type: String,
            required: true
        },
        color: String,
        isSpayedNeutered: {
            type: Boolean,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        checklist: {
            shotsUpToDate: Boolean,
            microchipped: Boolean,
            houseTrained: Boolean,
            goodWithDogs: Boolean,
            goodWithCats: Boolean,
            goodWithKids: Boolean,
            purebred: Boolean,
            hasSpecialNeeds: Boolean,
            hasBehaviouralIssues: Boolean
        }
    },
    rehomingDetails: {
        reason: {
            type: String,
            required: true
        },
        timeWindow: {
            type: String,
            required: true
        }
    },
    media: {
        photos: {
            type: [String], // Store URLs of uploaded photos
            required: true,
            validate: [array => array.length > 0, 'At least one photo is required']
        },
        documents: [{
            type: {
                type: String,
                enum: ['vaccine', 'spayNeuter', 'microchip', 'other']
            },
            url: String, // Store URL of uploaded document
            name: String
        }]
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RehomingApplication', rehomingApplicationSchema);
