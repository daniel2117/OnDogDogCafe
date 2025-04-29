const asyncHandler = require('express-async-handler');
const { Reservation, TIME_SLOTS, SERVICES, SERVICE_CONSTRAINTS } = require('../models/Reservation');
const emailService = require('../utils/emailService');
const cache = require('../utils/cache');
const { sendEmail } = require('../utils/notifications');
const validators = require('../utils/validator');

const reservationController = {
    // Get available time slots and services
    getAvailability: asyncHandler(async (req, res) => {
        try {
            const { date } = req.query;
            
            if (!date) {
                return res.status(400).json({ message: 'Date is required' });
            }

            const queryDate = new Date(date);
            queryDate.setHours(0, 0, 0, 0);

            // Get all reservations for the specified date
            const reservations = await Reservation.find({
                date: queryDate,
                status: { $ne: 'cancelled' }
            });

            // Calculate availability for each time slot
            const availability = {};
            for (const timeSlot of TIME_SLOTS) {
                const slotReservations = reservations.filter(r => r.timeSlot === timeSlot);
                
                const cafeVisitCount = slotReservations.filter(r => 
                    r.selectedServices.includes(SERVICES.CAFE_VISIT)
                ).length;

                const hasDogParty = slotReservations.some(r => 
                    r.selectedServices.includes(SERVICES.DOG_PARTY)
                );

                availability[timeSlot] = {
                    available: true,
                    availableServices: Object.values(SERVICES),
                    restrictions: []
                };

                // Apply restrictions based on existing bookings
                if (hasDogParty) {
                    availability[timeSlot].availableServices = Object.values(SERVICES)
                        .filter(service => service !== SERVICES.CAFE_VISIT);
                    availability[timeSlot].restrictions.push('Dog Party booked - Cafe Visit unavailable');
                } else if (cafeVisitCount >= 2) {
                    availability[timeSlot].availableServices = Object.values(SERVICES)
                        .filter(service => service !== SERVICES.CAFE_VISIT 
                                      && service !== SERVICES.DOG_PARTY);
                    availability[timeSlot].restrictions.push('Maximum Cafe Visits reached');
                } else if (cafeVisitCount === 1) {
                    availability[timeSlot].availableServices = Object.values(SERVICES)
                        .filter(service => service !== SERVICES.DOG_PARTY);
                    availability[timeSlot].restrictions.push('One Cafe Visit slot remaining');
                }

                availability[timeSlot].available = availability[timeSlot].availableServices.length > 0;
            }

            res.json({
                date: queryDate,
                timeSlots: availability,
                serviceConstraints: SERVICE_CONSTRAINTS
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),

    verifyContact: asyncHandler(async (req, res) => {
        const { email } = req.headers;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required',
                error: true
            });
        }

        // Generate and send verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await cache.set(`verification:${email}`, verificationCode, 600); // 10 minutes expiry

        const emailSent = await emailService.sendVerificationEmail(email, verificationCode);

        if (!emailSent) {
            return res.status(500).json({
                message: 'Failed to send verification email',
                error: true
            });
        }

        res.json({
            message: 'Verification code sent to email',
            error: false
        });
    }),

    // Add new verification code check endpoint
    verifyCode: asyncHandler(async (req, res) => {
        const { email, code } = req.body;

        const storedCode = await cache.get(`verification:${email}`);
        if (!storedCode || storedCode !== code) {
            return res.status(400).json({
                message: 'Invalid or expired verification code'
            });
        }

        await cache.del(`verification:${email}`);
        res.json({
            message: 'Email verified successfully',
            verified: true
        });
    }),

    // Create reservation with multiple services
    createReservation: asyncHandler(async (req, res) => {
        const { customerInfo, date, timeSlot, selectedServices, numberOfPeople } = req.body;

        try {
            // Validate required fields
            if (!customerInfo?.name || !customerInfo?.email || !customerInfo?.phone || 
                !date || !timeSlot || !selectedServices?.length || !numberOfPeople) {
                return res.status(400).json({
                    message: 'All required fields must be provided'
                });
            }

            // Validate number of people
            if (!Number.isInteger(numberOfPeople) || numberOfPeople < 1 || numberOfPeople > 10) {
                return res.status(400).json({
                    message: 'Number of people must be between 1 and 10'
                });
            }

            // Additional validation
            if (!validators.isValidEmail(customerInfo?.email)) {
                return res.status(400).json({
                    message: 'Invalid email format'
                });
            }

            // Simple time slot validation if validator function is not available
            const timeSlotHour = parseInt(timeSlot.split(':')[0]);
            if (timeSlotHour < 13 || timeSlotHour > 19) {
                return res.status(400).json({
                    message: 'Reservation time must be within business hours (13:00-19:00)'
                });
            }

            // Validate date is not in past
            const reservationDate = new Date(date);
            if (reservationDate < new Date().setHours(0, 0, 0, 0)) {
                return res.status(400).json({
                    message: 'Cannot book for past dates'
                });
            }

            // Additional validation for business hours
            const businessHours = {
                open: 13 * 60, // 13:00
                close: 19 * 60  // 19:00
            };

            if (!validators.isValidReservationTime(timeSlot, businessHours)) {
                return res.status(400).json({
                    message: 'Reservation time must be within business hours (13:00-19:00)'
                });
            }

            // Check availability for all selected services
            const existingReservations = await Reservation.find({
                date: reservationDate,
                timeSlot,
                status: { $ne: 'cancelled' }
            });

            // Check if maximum bookings limit is reached
            if (existingReservations.length >= 2) {
                return res.status(400).json({
                    message: 'This time slot is fully booked'
                });
            }

            // Check if services are available
            for (const service of selectedServices) {
                const serviceBookings = existingReservations.filter(reservation => 
                    reservation.selectedServices.includes(service)
                );
                
                if (serviceBookings.length >= 2) {
                    return res.status(400).json({
                        message: `Service ${service} is fully booked for this time slot`
                    });
                }
            }

            // Check if services are valid
            const invalidServices = selectedServices.filter(
                service => !Object.values(SERVICES).includes(service)
            );
            
            if (invalidServices.length > 0) {
                return res.status(400).json({
                    message: `Invalid services: ${invalidServices.join(', ')}`
                });
            }

            // Create reservation
            const reservation = await Reservation.create({
                customerInfo,
                date: reservationDate,
                timeSlot,
                selectedServices,
                numberOfPeople,
                status: 'pending'
            });

            // Clear availability cache after successful reservation
            const cacheKey = `availability:${new Date(date).toISOString().split('T')[0]}`;
            await cache.del(cacheKey);

            // Send detailed confirmation email
            try {
                await emailService.sendReservationConfirmation(customerInfo.email, {
                    ...reservation.toObject(),
                    formattedDate: reservationDate.toLocaleDateString(),
                    totalServices: selectedServices.length
                });
            } catch (error) {
                console.error('Email notification error:', error);
                // Continue even if email fails
            }

            res.status(201).json({
                message: 'Reservation created successfully',
                reservation
            });
        } catch (error) {
            if (error.code === 11000) { // Duplicate key error
                return res.status(409).json({
                    message: 'A reservation already exists for this time slot'
                });
            }
            console.error('Reservation creation error:', error);
            res.status(500).json({
                message: 'Failed to create reservation',
                error: error.message
            });
        }
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