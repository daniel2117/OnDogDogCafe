const mongoose = require('mongoose');

const adoptionHistorySchema = new mongoose.Schema({
    dogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DogAdoptionListing',
        required: true
    },
    adopterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    adopterRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DogAdopterRequest',
        required: true
    },
    adoptionDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    // Follow-up Information
    followUps: [{
        date: Date,
        notes: String,
        photos: [String],
        conductedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['Successful', 'Needs Attention', 'Critical'],
            required: true
        }
    }],
    // Contract Information
    contract: {
        signedDate: Date,
        documentUrl: String,
        terms: [String]
    },
    // Payment Information
    payment: {
        amount: Number,
        method: String,
        transactionId: String,
        date: Date
    },
    // Additional Documents
    documents: [{
        type: {
            type: String,
            enum: ['Medical Records', 'Behavioral Assessment', 'Home Visit Report', 'Other']
        },
        url: String,
        uploadDate: Date,
        description: String
    }],
    status: {
        type: String,
        enum: ['Active', 'Returned', 'Deceased'],
        default: 'Active'
    },
    notes: [{
        text: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Indexes
adoptionHistorySchema.index({ adopterId: 1, adoptionDate: -1 });
adoptionHistorySchema.index({ dogId: 1 });

module.exports = mongoose.model('AdoptionHistory', adoptionHistorySchema);