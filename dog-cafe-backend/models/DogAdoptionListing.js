const mongoose = require('mongoose');

const dogAdoptionListingSchema = new mongoose.Schema({
    dogName: {
        type: String,
        required: [true, 'Dog name is required'],
        trim: true
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['Male', 'Female']
    },
    breed: {
        type: String,
        required: [true, 'Breed is required'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: 0
    },
    size: {
        type: String,
        required: [true, 'Size is required'],
        enum: ['Small', 'Medium', 'Big']
    },
    shortDescription: {
        type: String,
        required: [true, 'Short description is required'],
        maxLength: 200
    },
    story: {
        type: String,
        required: [true, 'Story is required'],
        maxLength: 1000
    },
    characteristics: [{
        type: String,
        required: true
    }],
    color: {
        type: String,
        required: [true, 'Color is required'],
        trim: true
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: 0
    },
    height: {
        type: Number,
        required: [true, 'Height is required'],
        min: 0
    },
    profilePhoto: {
        type: String,
        required: [true, 'Profile photo is required']
    },
    photos: [{
        type: String,
        required: true
    }],
    vaccination: [{
        age: Number,
        vaccinated: String,
        match: Boolean
    }],
    adoptionStatus: {
        type: String,
        enum: ['Available', 'Meet&Greet', 'Trial', 'Adopted', 'Unavailable'],
        default: 'Available'
    },
    currentApplication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdoptionApplication',
        default: null
    },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Pending', 'Adopted'],
        default: 'Available'
    },
    interestCount: {
        type: Number,
        default: 0
    },
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
dogAdoptionListingSchema.index({ status: 1, breed: 1, age: 1 });
dogAdoptionListingSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('DogAdoptionListing', dogAdoptionListingSchema);