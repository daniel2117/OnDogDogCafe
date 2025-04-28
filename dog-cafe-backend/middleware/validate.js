const { TIME_SLOTS } = require('../models/Reservation');

const validateReservation = (req, res, next) => {
    const { date, timeSlot, numberOfPeople } = req.body;

    // Check required fields
    if (!date || !timeSlot || !numberOfPeople) {
        return res.status(400).json({
            message: 'Please provide all required fields: date, timeSlot, numberOfPeople'
        });
    }

    // Validate date
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(reservationDate)) {
        return res.status(400).json({
            message: 'Invalid date format'
        });
    }

    if (reservationDate < today) {
        return res.status(400).json({
            message: 'Reservation date must be in the future'
        });
    }

    // Maximum 30 days in advance
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    if (reservationDate > maxDate) {
        return res.status(400).json({
            message: 'Reservations can only be made up to 30 days in advance'
        });
    }

    // Validate time slot
    if (!TIME_SLOTS.includes(timeSlot)) {
        return res.status(400).json({
            message: `Invalid time slot. Must be one of: ${TIME_SLOTS.join(', ')}`
        });
    }

    // Validate number of people
    if (!Number.isInteger(numberOfPeople) || numberOfPeople < 1 || numberOfPeople > 10) {
        return res.status(400).json({
            message: 'Number of people must be between 1 and 10'
        });
    }

    next();
};

const validateAdoptionApplication = (req, res, next) => {
    const { livingArrangement, experience, reason } = req.body;

    if (!livingArrangement || !experience || !reason ) {
        return res.status(400).json({
            message: 'Please provide all required fields: livingArrangement, experience, reason'
        });
    }

    // Optional dogId validation
    if (req.body.dogId && !req.body.dogId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            message: 'Invalid dog ID format'
        });
    }

    // Validate text field lengths
    if (livingArrangement.length < 10 || livingArrangement.length > 500) {
        return res.status(400).json({
            message: 'Living arrangement description must be between 10 and 500 characters'
        });
    }

    if (experience.length < 10 || experience.length > 500) {
        return res.status(400).json({
            message: 'Experience description must be between 10 and 500 characters'
        });
    }

    if (reason.length < 10 || reason.length > 1000) {
        return res.status(400).json({
            message: 'Reason for adoption must be between 10 and 1000 characters'
        });
    }

    next();
};

const validateDog = (req, res, next) => {
    const { name, breed, age, size, gender, description } = req.body;

    // Combined validation object
    const validations = {
        name: { min: 2, max: 50, message: 'Name must be between 2 and 50 characters' },
        breed: { min: 2, max: 50, message: 'Breed must be between 2 and 50 characters' },
        description: { min: 10, max: 1000, message: 'Description must be between 10 and 1000 characters' }
    };

    // Check required fields
    const requiredFields = ['name', 'breed', 'age', 'size', 'gender', 'description'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Please provide all required fields: ${missingFields.join(', ')}`
        });
    }

    // Validate string lengths
    for (const [field, rules] of Object.entries(validations)) {
        const value = req.body[field];
        if (value.length < rules.min || value.length > rules.max) {
            return res.status(400).json({ message: rules.message });
        }
    }

    // Validate age
    if (!Number.isInteger(age) || age < 0 || age > 30) {
        return res.status(400).json({
            message: 'Age must be a valid number between 0 and 30'
        });
    }

    // Validate enums
    if (!['small', 'medium', 'large'].includes(size.toLowerCase())) {
        return res.status(400).json({
            message: 'Size must be one of: small, medium, large'
        });
    }

    if (!['male', 'female'].includes(gender.toLowerCase())) {
        return res.status(400).json({
            message: 'Gender must be either male or female'
        });
    }

    next();
};

const validateRehomingApplication = (req, res, next) => {
    const { ownerInfo, petInfo, rehomingDetails, media } = req.body;

    // Validate ownerInfo
    if (!ownerInfo || !ownerInfo.email || !ownerInfo.firstName || !ownerInfo.lastName) {
        return res.status(400).json({ message: 'Owner information is incomplete' });
    }

    // Validate petInfo
    if (!petInfo || !petInfo.name || !petInfo.type || !petInfo.age || !petInfo.size || !petInfo.gender || !petInfo.breed || !petInfo.description) {
        return res.status(400).json({ message: 'Pet information is incomplete' });
    }

    // Validate rehomingDetails
    if (!rehomingDetails || !rehomingDetails.reason || !rehomingDetails.timeWindow) {
        return res.status(400).json({ message: 'Rehoming details are incomplete' });
    }

    // Validate media
    if (!media || !media.photos || media.photos.length === 0) {
        return res.status(400).json({ message: 'At least one photo is required' });
    }

    next();
};

module.exports = {
    validateReservation,
    validateAdoptionApplication,
    validateDog,
    validateRehomingApplication
};