const mongoose = require('mongoose');

const DogAdoptionListingSchema = new mongoose.Schema({
    dogName: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    healthStatus: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, default: null },
    listedDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('DogAdoptionListing', DogAdoptionListingSchema);
