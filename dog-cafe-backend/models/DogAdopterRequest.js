const mongoose = require('mongoose');

const DogAdopterRequestSchema = new mongoose.Schema({
    adopterName: { type: String, required: true },
    adopterEmail: { type: String, required: true },
    dogId: { type: mongoose.Schema.Types.ObjectId, ref: 'DogAdoptionListing', required: true },
    experience: { type: String, required: true },
    homeSize: { type: String, required: true },
    occupation: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Reviewed'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('DogAdopterRequest', DogAdopterRequestSchema);
