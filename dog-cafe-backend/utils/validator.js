const validator = require('validator');

const validators = {
    // Add request throttling check
    isThrottled: async (key, limit, window) => {
        const count = await cache.get(key) || 0;
        if (count >= limit) return true;
        await cache.set(key, count + 1, window);
        return false;
    },

    // Add sanitization for MongoDB queries
    sanitizeMongoQuery: (query) => {
        const sanitized = {};
        Object.keys(query).forEach(key => {
            if (typeof query[key] === 'string') {
                sanitized[key] = validator.escape(query[key]);
            } else {
                sanitized[key] = query[key];
            }
        });
        return sanitized;
    },

    // User validation
    isValidEmail: (email) => {
        return email && 
               validator.isEmail(email) && 
               email.length <= 254 && // RFC 5321
               !email.includes('..'); // No consecutive dots
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
        } else if (reservation.numberOfPeople < 1 || reservation.numberOfPeople > 10) {
            errors.push('Number of people must be between 1 and 10');
        }

        if (!reservation.selectedServices || !Array.isArray(reservation.selectedServices) || reservation.selectedServices.length === 0) {
            errors.push('At least one service must be selected');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    isValidReservationUpdate: (update) => {
        const errors = [];

        if (update.date && !validators.isValidDate(update.date)) {
            errors.push('Invalid date format');
        }

        if (update.timeSlot && !validators.isValidTime(update.timeSlot)) {
            errors.push('Invalid time format');
        }

        if (update.numberOfPeople && (update.numberOfPeople < 1 || update.numberOfPeople > 10)) {
            errors.push('Number of people must be between 1 and 10');
        }

        if (update.selectedServices) {
            if (!Array.isArray(update.selectedServices) || update.selectedServices.length === 0) {
                errors.push('At least one service must be selected');
            }
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
    },

    // Add new validations
    isValidUrl: (url) => {
        return validator.isURL(url, {
            protocols: ['http', 'https'],
            require_protocol: true
        });
    },

    sanitizeHtml: (html) => {
        return validator.escape(html);
    },

    validateImageDimensions: (dimensions) => {
        return dimensions.width <= 2048 && dimensions.height <= 2048;
    },

    // Add contact form validation
    isValidContactForm: (data) => {
        const errors = [];

        if (!data.firstName?.trim()) {
            errors.push('First name is required');
        }

        if (!data.lastName?.trim()) {
            errors.push('Last name is required');
        }

        if (!data.email || !validators.isValidEmail(data.email)) {
            errors.push('Valid email is required');
        }

        if (!data.phone || !validators.isValidPhone(data.phone)) {
            errors.push('Valid phone number is required');
        }

        if (!data.message?.trim()) {
            errors.push('Message is required');
        } else if (data.message.length > 1000) {
            errors.push('Message cannot exceed 1000 characters');
        }

        // Check for either agreedToPrivacyPolicy or agreed field
        if (!data.agreedToPrivacyPolicy && !data.agreed) {
            errors.push('You must agree to the privacy policy');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Add validation for MyPage queries
    isValidMyPageQuery: (query) => {
        const errors = [];

        if (!query.email) {
            errors.push('Email is required');
        } else if (!validators.isValidEmail(query.email)) {
            errors.push('Invalid email format');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Add validation for rehoming applications
    isValidRehomingApplication: (application) => {
        const errors = [];

        // Validate owner info
        if (!application.ownerInfo?.email || !validators.isValidEmail(application.ownerInfo.email)) {
            errors.push('Valid email is required');
        }
        if (!application.ownerInfo?.firstName?.trim()) {
            errors.push('First name is required');
        }
        if (!application.ownerInfo?.lastName?.trim()) {
            errors.push('Last name is required');
        }

        // Validate pet info
        if (!application.petInfo?.name?.trim()) {
            errors.push('Pet name is required');
        }
        if (!['dog', 'cat'].includes(application.petInfo?.type)) {
            errors.push('Valid pet type is required');
        }
        if (!application.petInfo?.breed?.trim()) {
            errors.push('Breed is required');
        }

        // Validate media
        if (!application.media?.photos || !Array.isArray(application.media.photos) || application.media.photos.length === 0) {
            errors.push('At least one photo is required');
        }

        // Validate file URLs
        if (application.media?.photos) {
            const validFileUrl = (url) => /^\/?(?:api\/)?files\/[a-f0-9]{24}$/.test(url);
            if (!application.media.photos.every(validFileUrl)) {
                errors.push('Invalid photo URL format');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

const isValidReservationTime = (timeSlot, businessHours) => {
    // Convert time slot to minutes for comparison
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;

    // Check if time is within business hours
    return timeInMinutes >= businessHours.open && timeInMinutes <= businessHours.close;
};

module.exports = {
    ...validators,
    isValidReservationTime,
};