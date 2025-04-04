const mongoose = require('mongoose');

const adoptionApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DogAdoptionListing',
        required: true
    },
    status: {
        type: String,
        enum: ['Initial', 'PreScreening', 'MeetGreet', 'HomeVisit', 'Trial', 'Completed', 'Rejected', 'Withdrawn'],
        default: 'Initial'
    },
    initialQuestionnaire: {
        hasOtherPets: Boolean,
        hasChildren: Boolean,
        homeType: {
            type: String,
            enum: ['House', 'Apartment', 'Condo', 'Other']
        },
        ownRent: {
            type: String,
            enum: ['Own', 'Rent']
        },
        workSchedule: String,
        primaryCaregiver: String
    },
    formalApplication: {
        personalInfo: {
            fullName: String,
            email: String,
            phone: String,
            address: {
                street: String,
                city: String,
                state: String,
                postalCode: String
            }
        },
        references: [{
            name: String,
            relationship: String,
            phone: String,
            email: String
        }],
        documents: [{
            type: String,
            url: String,
            uploadDate: Date
        }],
        applicationFee: {
            amount: Number,
            paid: Boolean,
            transactionId: String,
            paidDate: Date
        }
    },
    timeline: [{
        stage: String,
        date: Date,
        notes: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
}, {
    timestamps: true
});

// Indexes
adoptionApplicationSchema.index({ userId: 1, dogId: 1 });
adoptionApplicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('AdoptionApplication', adoptionApplicationSchema);