const mongoose = require('mongoose');

const meetGreetSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdoptionApplication',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
        default: 'Scheduled'
    },
    attendees: [{
        name: String,
        relation: String
    }],
    includingCurrentPets: Boolean,
    staffNotes: {
        dogBehavior: String,
        interactionQuality: String,
        concerns: String,
        recommendations: String
    },
    outcome: {
        type: String,
        enum: ['Positive', 'Neutral', 'Negative']
    },
    nextSteps: String,
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes
meetGreetSchema.index({ applicationId: 1, appointmentDate: 1 });
meetGreetSchema.index({ status: 1 });

module.exports = mongoose.model('MeetGreet', meetGreetSchema);