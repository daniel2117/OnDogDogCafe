const mongoose = require('mongoose');

const finalAdoptionSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdoptionApplication',
        required: true
    },
    completionDate: {
        type: Date,
        required: true
    },
    contract: {
        signedDate: Date,
        documentUrl: String,
        terms: [String]
    },
    payment: {
        amount: Number,
        method: String,
        transactionId: String,
        date: Date
    },
    medicalRecords: [{
        type: String,
        date: Date,
        documentUrl: String
    }],
    supplies: [{
        item: String,
        quantity: Number
    }],
    instructions: {
        feeding: String,
        medication: String,
        exercise: String,
        training: String,
        veterinary: String
    }
}, {
    timestamps: true
});

// Indexes
finalAdoptionSchema.index({ applicationId: 1 });
finalAdoptionSchema.index({ completionDate: -1 });

module.exports = mongoose.model('FinalAdoption', finalAdoptionSchema);