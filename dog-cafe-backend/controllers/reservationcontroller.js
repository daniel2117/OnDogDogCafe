const asyncHandler = require('express-async-handler');
const { Reservation, TIME_SLOTS, SERVICES } = require('../models/Reservation');
const { sendEmail, sendSMS } = require('../utils/notifications');

const reservationController = {
    // Get available time slots and services
    getAvailability: asyncHandler(async (req, res) => {
        const { date } = req.headers;
        
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        const queryDate = new Date(date);
        if (isNaN(queryDate)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Get existing reservations for the date
        const reservations = await Reservation.find({
            date: queryDate,
            status: { $ne: 'cancelled' }
        }).select('timeSlot service');

        // Calculate available slots
        const availableSlots = {};
        Object.values(SERVICES).forEach(service => {
            availableSlots[service] = TIME_SLOTS.filter(slot => {
                const conflictingReservation = reservations.find(r => 
                    r.timeSlot === slot && r.service === service
                );
                return !conflictingReservation;
            });
        });

        res.json({
            date: queryDate,
            availableSlots,
            services: Object.values(SERVICES)
        });
    }),

    // Verify contact information
    verifyContact: asyncHandler(async (req, res) => {
        const { email, phone } = req.headers;

        if (!email && !phone) {
            return res.status(400).json({
                message: 'Either email or phone is required'
            });
        }

        // Add your verification logic here
        // For example, send verification code via email/SMS
        
        res.json({
            message: 'Contact information is valid',
            verified: true
        });
    }),

    // Create reservation
    createReservation: asyncHandler(async (req, res) => {
        const { email, phone, date, timeSlot, service } = req.body;

        // Validate input
        if (!email || !phone || !date || !timeSlot || !service) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        // Check if slot is available
        const existingReservation = await Reservation.findOne({
            date,
            timeSlot,
            service,
            status: { $ne: 'cancelled' }
        });

        if (existingReservation) {
            return res.status(400).json({
                message: 'Time slot not available'
            });
        }

        // Create reservation
        const reservation = await Reservation.create({
            email,
            phone,
            date,
            timeSlot,
            service,
            status: 'confirmed'
        });

        // Send confirmation
        try {
            await sendEmail(
                email,
                'Reservation Confirmation',
                `Your reservation for ${service} on ${date} at ${timeSlot} has been confirmed.`
            );
            
            await sendSMS(
                phone,
                `Your reservation for ${service} on ${date} at ${timeSlot} has been confirmed.`
            );
        } catch (error) {
            console.error('Notification error:', error);
        }

        res.status(201).json({
            message: 'Reservation created successfully',
            reservation
        });
    })
};

module.exports = reservationController;