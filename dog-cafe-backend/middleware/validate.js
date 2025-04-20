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
    const { dogId, livingArrangement, experience, reason, income } = req.body;

    if (!dogId || !livingArrangement || !experience || !reason ) {
        return res.status(400).json({
            message: 'Please provide all required fields: dogId, livingArrangement, experience, reason, income'
        });
    }

    // Validate dogId format
    if (!dogId.match(/^[0-9a-fA-F]{24}$/)) {
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
    const { name, breed, age, size, gender, description, personality, requirements } = req.body;

    if (!name || !breed || !age || !size || !gender || !description) {
        return res.status(400).json({
            message: 'Please provide all required fields: name, breed, age, size, gender, description'
        });
    }

    // Validate name and breed length
    if (name.length < 2 || name.length > 50) {
        return res.status(400).json({
            message: 'Name must be between 2 and 50 characters'
        });
    }

    if (breed.length < 2 || breed.length > 50) {
        return res.status(400).json({
            message: 'Breed must be between 2 and 50 characters'
        });
    }

    // Validate age
    if (!Number.isInteger(age) || age < 0 || age > 30) {
        return res.status(400).json({
            message: 'Age must be a valid number between 0 and 30'
        });
    }

    // Validate size
    const validSizes = ['small', 'medium', 'large'];
    if (!validSizes.includes(size.toLowerCase())) {
        return res.status(400).json({
            message: 'Size must be one of: small, medium, large'
        });
    }

    // Validate gender
    const validGenders = ['male', 'female'];
    if (!validGenders.includes(gender.toLowerCase())) {
        return res.status(400).json({
            message: 'Gender must be either male or female'
        });
    }

    // Validate description length
    if (description.length < 10 || description.length > 1000) {
        return res.status(400).json({
            message: 'Description must be between 10 and 1000 characters'
        });
    }

    // Validate personality array if provided
    if (personality && (!Array.isArray(personality) || personality.length === 0)) {
        return res.status(400).json({
            message: 'Personality must be an array with at least one trait'
        });
    }

    // Validate requirements array if provided
    if (requirements && (!Array.isArray(requirements) || requirements.length === 0)) {
        return res.status(400).json({
            message: 'Requirements must be an array with at least one requirement'
        });
    }

    next();
};

module.exports = {
    validateReservation,
    validateAdoptionApplication,
    validateDog
};