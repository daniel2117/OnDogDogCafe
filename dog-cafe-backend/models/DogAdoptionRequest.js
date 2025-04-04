const mongoose = require('mongoose');

const DogAdoptionRequestSchema = new mongoose.Schema({
    dogName: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    healthStatus: { type: String, required: true },
    description: { type: String },
    ownerEmail: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    rejectionReason: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('DogAdoptionRequest', DogAdoptionRequestSchema);
