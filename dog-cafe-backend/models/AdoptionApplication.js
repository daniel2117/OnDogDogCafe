const mongoose = require('mongoose');

const adoptionApplicationSchema = new mongoose.Schema({
    personalInfo: {
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
        },
        address: {
            line1: { type: String, required: true },
            line2: String,
            town: { type: String, required: true },
            phone: { type: String, required: true }
        }
    },
    environment: {
        hasGarden: Boolean,
        homeSituation: {
            type: String,
            enum: ['apartment', 'house', 'shared', 'others']
        },
        householdSetting: {
            type: String,
            enum: ['single', 'couple', 'family', 'shared housing']
        },
        activityLevel: {
            type: String,
            enum: ['low', 'moderate', 'high']
        },
        incomeLevel: {
            type: String,
            enum: ['low', 'medium', 'high']
        }
    },
    homeImages: [String],
    roommates: {
        numAdults: {
            type: Number,
            min: 0,
            max: 10
        },
        numChildren: {
            type: Number,
            min: 0,
            max: 10
        },
        youngestChildAge: Number,
        visitingChildren: Boolean,
        visitingChildrenAge: [{
            type: String,
            enum: ['toddler', 'child', 'teen']
        }],
        hasFlatmates: Boolean
    },
    otherAnimals: {
        allergies: String,
        hasOtherAnimals: Boolean,
        animalDetails: String,
        neutered: {
            type: String,
            enum: ['yes', 'no', 'n/a']
        },
        vaccinated: {
            type: String,
            enum: ['yes', 'no', 'n/a']
        },
        experience: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AdoptionApplication', adoptionApplicationSchema);
