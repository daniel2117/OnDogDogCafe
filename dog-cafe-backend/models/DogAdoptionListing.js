const mongoose = require('mongoose');

const DogAdoptionListingSchema = new mongoose.Schema({
    dogName: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    size: { type: String, enum: ['Small', 'Medium', 'Big'], required: true },
    shortDescription: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    photos: [{ type: String }], // Array of up to 5 photos
    story: { type: String, required: true },
    characteristics: [{
        type: String,
        enum: [
            'Can live with children',
            'Vaccinated',
            'House-Trained',
            'Neutered',
            'Shots up to date',
            'Microchipped'
        ]
    }],
    color: { type: String, required: true },
    weight: { type: Number, required: true }, // in kg
    height: { type: Number, required: true }, // in cm
    vaccination: [{
        age: Number,
        vaccinated: Boolean,
        match: Boolean
    }],
    interestCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Available', 'Adopted'], default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('DogAdoptionListing', DogAdoptionListingSchema);