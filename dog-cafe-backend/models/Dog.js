const mongoose = require('mongoose');

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
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    },
    healthRecords: [{
        type: String,
        description: String,
        date: Date
    }],
    vaccinations: [{
        name: String,
        date: Date,
        nextDue: Date
    }],
    translations: {
        zh: {
            name: String,
            description: String
        }
    }
});

// Add indexes for better query performance
dogSchema.index({ name: 1, breed: 1 });
dogSchema.index({ status: 1 });
dogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Dog', dogSchema);