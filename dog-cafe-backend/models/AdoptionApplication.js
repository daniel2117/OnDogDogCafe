const mongoose = require('mongoose');

const adoptionApplicationSchema = new mongoose.Schema({
    dogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dog'
    },
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
        town: { type: String, required: true }
    },
    phone: {
        type: String,
        required: true
    },
    garden: {
        type: String,
        enum: ['yes', 'no'],
        required: true
    },
    homeSituation: {
        type: String,
        enum: ['apartment', 'house', 'shared'],
        required: true
    },
    householdSetting: {
        type: String,
        required: true
    },
    activityLevel: {
        type: String,
        required: true
    },
    incomeLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    homeImages: [{
        type: String,
        validate: {
            validator: function(url) {
                return /^\/?(?:api\/)?files\/[a-f0-9]{24}$/.test(url);
            },
            message: 'Invalid file URL format'
        }
    }],
    adults: {
        type: String,
        required: true
    },
    children: {
        type: String,
        required: true
    },
    youngestAge: {
        type: String,
        required: true
    },
    hasVisitingChildren: {
        type: String,
        enum: ['yes', 'no'],
        required: true
    },
    visitingAge: {
        type: String
    },
    hasFlatmates: {
        type: String,
        enum: ['yes', 'no'],
        required: true
    },
    allergies: String,
    hasOtherAnimals: {
        type: String,
        enum: ['yes', 'no'],
        required: true
    },
    otherAnimalDetails: String,
    neutered: {
        type: String,
        enum: ['yes', 'no', 'n/a'],
        required: true
    },
    vaccinated: {
        type: String,
        enum: ['yes', 'no', 'n/a'],
        required: true
    },
    experience: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'withdrawn'],
        default: 'pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AdoptionApplication', adoptionApplicationSchema);
