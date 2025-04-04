const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dog',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    applicationDetails: {
        livingArrangement: String,
        hasOtherPets: Boolean,
        experience: String,
        reason: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Adoption', adoptionSchema);