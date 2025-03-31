const mongoose = require('mongoose');

const DogInterestSchema = new mongoose.Schema({
    dogId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'DogAdoptionListing', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

DogInterestSchema.index({ dogId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('DogInterest', DogInterestSchema);