const mongoose = require('mongoose');

const trialPeriodSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdoptionApplication',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Ongoing', 'Completed', 'Terminated'],
        default: 'Ongoing'
    },
    dailyLogs: [{
        date: Date,
        behaviors: [String],
        concerns: [String],
        positives: [String],
        photos: [String]
    }],
    supportRequests: [{
        date: Date,
        issue: String,
        response: String,
        resolved: Boolean
    }],
    checkIns: [{
        date: Date,
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        notes: String,
        nextCheckInDate: Date
    }]
}, {
    timestamps: true
});

// Indexes
trialPeriodSchema.index({ applicationId: 1, status: 1 });
trialPeriodSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('TrialPeriod', trialPeriodSchema);