const mongoose = require('mongoose');

const adoptionApplicationSchema = new mongoose.Schema({
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
        enum: ['single', 'couple', 'family', 'shared'],
        required: true
    },
    activityLevel: {
        type: String,
        enum: ['low', 'moderate', 'high'],
        required: true
    },
    incomeLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    homeImages: [{
        url: String,
        fileId: String
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
        type: String,
        enum: ['toddler', 'child', 'teen', 'n/a']
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
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AdoptionApplication', adoptionApplicationSchema);
