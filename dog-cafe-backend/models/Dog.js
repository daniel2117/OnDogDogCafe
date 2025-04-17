const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const dogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    breed: {
        type: String,
        required: [true, 'Please add a breed'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Please add age'],
        min: 0,
        max: 30
    },
    size: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium'
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'unknown'],
        default: 'unknown'
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    personality: [{
        type: String,
        trim: true
    }],
    requirements: [{
        type: String,
        trim: true
    }],
    vaccinated: {
        type: Boolean,
        default: false
    },
    neutered: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'adopted', 'unavailable'],
        default: 'available'
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide a main image URL'],
        validate: {
            validator: function(v) {
                return /^(\/images\/|https?:\/\/).*\.(jpg|jpeg|png|webp)$/i.test(v);
            },
            message: 'Invalid image URL format'
        }
    },
    images: [{
        type: String,
        validate: {
            validator: function(v) {
                return /^(\/images\/|https?:\/\/).*\.(jpg|jpeg|png|webp)$/i.test(v);
            },
            message: 'Invalid image URL format'
        }
    }],
    checklist: {
        canLiveWithChildren: Boolean,
        isVaccinated: Boolean,
        isHouseTrained: Boolean,
        isNeutered: Boolean,
        hasUpToDateShots: Boolean,
        isMicrochipped: Boolean
    },
    color: String,
    weight: String,
    height: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    },
    healthRecords: [healthRecordSchema],
    vaccinations: [{
        age: String,
        vaccinated: String,
        match: String
    }],
    translations: {
        zh: {
            name: String,
            description: String
        }
    },
    petId: {
        type: String,
        required: true,
        unique: true
    },
    profile: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    health: [{
        type: String,
        required: true
    }],
    stats: {
        gender: String,
        breed: String,
        age: String,
        color: String,
        weight: String,
        height: String
    }
});

// Add indexes for better query performance
dogSchema.index({ name: 1, breed: 1 });
dogSchema.index({ status: 1 });
dogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Dog', dogSchema);