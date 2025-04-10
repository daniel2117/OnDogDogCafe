const validator = require('validator');

const validators = {
    // User validation
    isValidEmail: (email) => {
        return validator.isEmail(email);
    },

    isStrongPassword: (password) => {
        return validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        });
    },

    // Phone number validation
    isValidPhone: (phone) => {
        return validator.isMobilePhone(phone, 'any', { strictMode: false });
    },

    // Date and time validation
    isValidDate: (date) => {
        return validator.isDate(date, { format: 'YYYY-MM-DD' });
    },

    isValidTime: (time) => {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
    },

    // General input validation
    sanitizeString: (str) => {
        return validator.trim(validator.escape(str));
    },

    isValidObjectId: (id) => {
        return validator.isMongoId(id);
    },

    // Custom validators
    isValidReservation: (reservation) => {
        const errors = [];

        if (!reservation.date) {
            errors.push('Date is required');
        } else if (!validators.isValidDate(reservation.date)) {
            errors.push('Invalid date format');
        }

        if (!reservation.timeSlot) {
            errors.push('Time slot is required');
        } else if (!validators.isValidTime(reservation.timeSlot)) {
            errors.push('Invalid time format');
        }

        if (!reservation.numberOfPeople) {
            errors.push('Number of people is required');
        } else if (reservation.numberOfPeople < 1 || reservation.numberOfPeople > 5) {
            errors.push('Number of people must be between 1 and 5');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    isValidAdoptionApplication: (application) => {
        const errors = [];

        if (!application.livingArrangement) {
            errors.push('Living arrangement is required');
        }

        if (!application.experience) {
            errors.push('Previous experience information is required');
        }

        if (!application.reason) {
            errors.push('Reason for adoption is required');
        }

        if (application.income && !validator.isNumeric(application.income.toString())) {
            errors.push('Income must be a number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    isValidDog: (dog) => {
        const errors = [];

        if (!dog.name) {
            errors.push('Name is required');
        }

        if (!dog.breed) {
            errors.push('Breed is required');
        }

        if (!dog.age || dog.age < 0 || dog.age > 30) {
            errors.push('Age must be between 0 and 30');
        }

        if (dog.size && !['small', 'medium', 'large'].includes(dog.size)) {
            errors.push('Invalid size');
        }

        if (dog.gender && !['male', 'female', 'unknown'].includes(dog.gender)) {
            errors.push('Invalid gender');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // File validation
    isValidImageFile: (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        const errors = [];

        if (!file) {
            errors.push('No file provided');
        } else {
            if (!allowedTypes.includes(file.mimetype)) {
                errors.push('Invalid file type. Only JPEG, PNG and WebP allowed');
            }

            if (file.size > maxSize) {
                errors.push('File too large. Maximum size is 5MB');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

module.exports = validators;