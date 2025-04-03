const mongoose = require('mongoose');

const homeVisitSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdoptionApplication',
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Rescheduled', 'Cancelled'],
        default: 'Scheduled'
    },
    inspector: {
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String
    },
    assessment: {
        propertyDetails: {
            fencing: String,
            yardSize: String,
            hazards: [String],
            petProofing: String
        },
        livingSpace: {
            suitableAreas: [String],
            concerns: [String]
        },
        familyInteraction: {
            observations: String,
            concerns: String
        },
        existingPets: {
            observed: Boolean,
            interaction: String
        }
    },
    photos: [String],
    recommendation: {
        type: String,
        enum: ['Approved', 'Pending', 'Rejected']
    },
    requiredChanges: [String],
    followUpNeeded: Boolean
}, {
    timestamps: true
});

// Indexes
homeVisitSchema.index({ applicationId: 1, scheduledDate: 1 });
homeVisitSchema.index({ status: 1 });

module.exports = mongoose.model('HomeVisit', homeVisitSchema);