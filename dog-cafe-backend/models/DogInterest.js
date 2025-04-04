const mongoose = require('mongoose');

const dogInterestSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure unique user-dog combinations
dogInterestSchema.index({ userId: 1, dogId: 1 }, { unique: true });

// Pre-save middleware to update interest count in DogAdoptionListing
dogInterestSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {
            await mongoose.model('DogAdoptionListing').findByIdAndUpdate(
                this.dogId,
                { $inc: { interestCount: 1 } }
            );
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-remove middleware to decrease interest count
dogInterestSchema.pre('remove', async function(next) {
    try {
        await mongoose.model('DogAdoptionListing').findByIdAndUpdate(
            this.dogId,
            { $inc: { interestCount: -1 } }
        );
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('DogInterest', dogInterestSchema);