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
        }).select('timeSlot selectedServices');

        // Calculate available slots for each service
        const availableSlots = {};
        Object.values(SERVICES).forEach(service => {
            availableSlots[service] = TIME_SLOTS.filter(slot => {
                const conflictingReservation = reservations.find(r => 
                    r.timeSlot === slot && r.selectedServices.includes(service)
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

        // Add verification logic here
        // For demo, just validate format
        const isEmailValid = email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : true;
        const isPhoneValid = phone ? /^\d{8,}$/.test(phone.replace(/[- ]/g, '')) : true;

        if (!isEmailValid || !isPhoneValid) {
            return res.status(400).json({
                message: 'Invalid contact information format'
            });
        }

        res.json({
            message: 'Contact information is valid',
            verified: true
        });
    }),

    // Create reservation with multiple services
    createReservation: asyncHandler(async (req, res) => {
        const { customerInfo, date, timeSlot, selectedServices } = req.body;

        // Validate required fields
        if (!customerInfo?.name || !customerInfo?.email || !customerInfo?.phone || 
            !date || !timeSlot || !selectedServices?.length) {
            return res.status(400).json({
                message: 'All required fields must be provided'
            });
        }

        // Validate date is not in past
        const reservationDate = new Date(date);
        if (reservationDate < new Date().setHours(0, 0, 0, 0)) {
            return res.status(400).json({
                message: 'Cannot book for past dates'
            });
        }

        // Check availability for all selected services
        const existingReservations = await Reservation.find({
            date: reservationDate,
            timeSlot,
            selectedServices: { $in: selectedServices },
            status: { $ne: 'cancelled' }
        });

        if (existingReservations.length > 0) {
            return res.status(400).json({
                message: 'One or more selected services are not available for this time slot'
            });
        }

        // Create reservation
        const reservation = await Reservation.create({
            customerInfo,
            date: reservationDate,
            timeSlot,
            selectedServices,
            status: 'pending'
        });

        // Send notifications
        try {
            const servicesList = selectedServices.join(', ');
            await sendEmail(
                customerInfo.email,
                'Reservation Confirmation',
                `Your reservation for ${servicesList} on ${date} at ${timeSlot} is pending confirmation.`
            );
            
            await sendSMS(
                customerInfo.phone,
                `Your reservation for ${servicesList} on ${date} at ${timeSlot} is pending confirmation.`
            );
        } catch (error) {
            console.error('Notification error:', error);
        }

        res.status(201).json({
            message: 'Reservation created successfully',
            reservation
        });
    }),

    // Get user's reservations history
    getUserReservations: asyncHandler(async (req, res) => {
        const { email, phone } = req.query;
        
        if (!email && !phone) {
            return res.status(400).json({
                message: 'Email or phone is required'
            });
        }

        const filter = {
            $or: [
                { 'customerInfo.email': email },
                { 'customerInfo.phone': phone }
            ]
        };

        const reservations = await Reservation.find(filter)
            .sort({ date: -1 })
            .select('-__v');

        res.json(reservations);
    }),

    // Cancel reservation
    cancelReservation: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { email, phone } = req.body;

        const reservation = await Reservation.findOne({
            _id: id,
            'customerInfo.email': email,
            'customerInfo.phone': phone
        });

        if (!reservation) {
            return res.status(404).json({
                message: 'Reservation not found'
            });
        }

        if (reservation.status === 'cancelled') {
            return res.status(400).json({
                message: 'Reservation is already cancelled'
            });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        // Send cancellation notification
        try {
            await sendEmail(
                reservation.customerInfo.email,
                'Reservation Cancelled',
                `Your reservation for ${reservation.selectedServices.join(', ')} on ${reservation.date} has been cancelled.`
            );
        } catch (error) {
            console.error('Notification error:', error);
        }

        res.json({
            message: 'Reservation cancelled successfully'
        });
    })
};

module.exports = reservationController;