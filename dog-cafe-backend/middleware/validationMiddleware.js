// middleware/validationMiddleware.js

// Constants for validation
const VALID_SERVICES = ["Tourist Area", "Dog Play Area", "Pet Grooming", "Indoor Dog Pool", "Dog Hotel"];
const VALID_TIME_SLOTS = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

const validateReservation = (req, res, next) => {
    try {
        const { service, date, time, visitors, dogs } = req.body;

        // Service validation
        if (!service || !VALID_SERVICES.includes(service)) {
            return res.status(400).json({ 
                message: "Please select a valid service type." 
            });
        }

        // Date validation
        const reservationDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(reservationDate)) {
            return res.status(400).json({ 
                message: "Invalid date format." 
            });
        }

        if (reservationDate < today) {
            return res.status(400).json({ 
                message: "Cannot make reservations for past dates." 
            });
        }

        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days ahead
        if (reservationDate > maxDate) {
            return res.status(400).json({ 
                message: "Reservations can only be made up to 30 days in advance." 
            });
        }

        // Time validation
        if (!time || !VALID_TIME_SLOTS.includes(time)) {
            return res.status(400).json({ 
                message: "Please select a valid time slot." 
            });
        }

        // Visitors validation
        if (!Number.isInteger(visitors) || visitors < 1 || visitors > 10) {
            return res.status(400).json({ 
                message: "Number of visitors must be between 1 and 10." 
            });
        }

        // Dogs validation
        if (!Number.isInteger(dogs) || dogs < 0 || dogs > 5) {
            return res.status(400).json({ 
                message: "Number of dogs must be between 0 and 5." 
            });
        }

        // Service-specific validations
        if (service === "Dog Play Area" && dogs === 0) {
            return res.status(400).json({ 
                message: "At least one dog is required for Dog Play Area service." 
            });
        }

        if (service === "Pet Grooming" && dogs === 0) {
            return res.status(400).json({ 
                message: "At least one dog is required for Pet Grooming service." 
            });
        }

        if (service === "Indoor Dog Pool" && dogs === 0) {
            return res.status(400).json({ 
                message: "At least one dog is required for Indoor Dog Pool service." 
            });
        }

        // If all validations pass, proceed
        next();
    } catch (error) {
        console.error("Validation Error:", error);
        return res.status(500).json({ 
            message: "Error validating reservation data." 
        });
    }
};

// Export constants for use in other files
module.exports = { 
    validateReservation,
    VALID_SERVICES,
    VALID_TIME_SLOTS
};