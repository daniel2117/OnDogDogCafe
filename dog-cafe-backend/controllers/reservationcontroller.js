const asyncHandler = require('express-async-handler');
const { Reservation, TIME_SLOTS, SERVICES, SERVICE_CONSTRAINTS } = require('../models/Reservation');
const emailService = require('../utils/emailService');
const cache = require('../utils/cache');
const validators = require('../utils/validator');
const mongoose = require('mongoose');

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

                // Start with all services and filter based on constraints
                let availableServices = Object.values(SERVICES);

                // Apply backend constraints
                if (hasDogParty) {
                    availableServices = availableServices.filter(service => 
                        service !== SERVICES.CAFE_VISIT && service !== SERVICES.DOG_PARTY
                    );
                } else if (cafeVisitCount > 0) {
                    availableServices = availableServices.filter(service => 
                        service !== SERVICES.DOG_PARTY
                    );
                    if (cafeVisitCount >= 2) {
                        availableServices = availableServices.filter(service => 
                            service !== SERVICES.CAFE_VISIT
                        );
                    }
                }

                availability[timeSlot] = availableServices;
            }

            res.json({
                date: queryDate,
                timeSlots: availability
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
                numberOfPeople
            });

            // Send confirmation email using emailService
            try {
                await emailService.sendReservationConfirmation(customerInfo.email, {
                    customerInfo,
                    date: reservationDate,
                    timeSlot,
                    selectedServices,
                    numberOfPeople,
                    _id: reservation._id,
                    status: 'confirmed'
                });
            } catch (emailError) {
                console.error('Failed to send confirmation email:', emailError);
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
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        if (!validators.isValidEmail(email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            });
        }

        const reservations = await Reservation.find({
            'customerInfo.email': email
        })
            .sort({ date: -1 })
            .select('-__v')
            .lean();

        // Transform the reservations to include all necessary fields
        const formattedReservations = reservations.map(reservation => ({
            id: reservation._id,
            status: reservation.status,
            date: reservation.date,
            timeSlot: reservation.timeSlot,
            numberOfPeople: reservation.numberOfPeople,
            selectedServices: reservation.selectedServices,
            customerInfo: {
                name: reservation.customerInfo.name,
                email: reservation.customerInfo.email,
                phone: reservation.customerInfo.phone,
                petName: reservation.customerInfo.petName || '',
                petType: reservation.customerInfo.petType || '',
                message: reservation.customerInfo.message || '',
                location: reservation.customerInfo.location || ''
            },
            createdAt: reservation.createdAt,
            updatedAt: reservation.updatedAt,
            version: reservation.__v
        }));

        res.json(formattedReservations);
    }),

    // Cancel reservation
    cancelReservation: asyncHandler(async (req, res) => {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid reservation ID'
            });
        }

        try {
            const reservation = await Reservation.findOne({
                _id: id,
                status: { $ne: 'cancelled' }
            });

            if (!reservation) {
                return res.status(404).json({
                    message: 'Active reservation not found'
                });
            }

            // Check if cancellation is within allowed time (24 hours before)
            const reservationTime = new Date(`${reservation.date.toISOString().split('T')[0]}T${reservation.timeSlot}`);
            const now = new Date();
            const hoursUntilReservation = (reservationTime - now) / (1000 * 60 * 60);

            if (hoursUntilReservation < 24) {
                return res.status(400).json({
                    message: 'Reservations can only be cancelled at least 24 hours in advance'
                });
            }

            reservation.status = 'cancelled';
            await reservation.save();

            // Send cancellation email using emailService
            try {
                await emailService.sendReservationConfirmation(
                    reservation.customerInfo.email,
                    {
                        customerInfo: reservation.customerInfo,
                        date: reservation.date,
                        timeSlot: reservation.timeSlot,
                        selectedServices: reservation.selectedServices,
                        numberOfPeople: reservation.numberOfPeople,
                        _id: reservation._id,
                        status: 'cancelled'  // Explicitly set status as cancelled
                    }
                );
            } catch (emailError) {
                console.error('Failed to send cancellation email:', emailError);
            }

            res.json({
                message: 'Reservation cancelled successfully',
                reservation: {
                    id: reservation._id,
                    status: reservation.status,
                    date: reservation.date,
                    timeSlot: reservation.timeSlot
                }
            });
        } catch (error) {
            console.error('Reservation cancellation error:', error);
            res.status(500).json({
                message: 'Failed to cancel reservation',
                error: error.message
            });
        }
    }),

    // Modify reservation
    modifyReservation: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { customerInfo, ...updates } = req.body;  // Separate customerInfo from other updates

        // Validate updates
        const validation = validators.isValidReservationUpdate(updates);
        if (!validation.isValid) {
            return res.status(400).json({
                message: 'Invalid update data',
                errors: validation.errors
            });
        }

        const reservation = await Reservation.findOne({
            _id: id,
            status: { $ne: 'cancelled' }
        });

        if (!reservation) {
            return res.status(404).json({
                message: 'Active reservation not found'
            });
        }

        // Check if modification is within allowed time (24 hours before)
        const reservationTime = new Date(`${reservation.date}T${reservation.timeSlot}`);
        const now = new Date();
        const hoursUntilReservation = (reservationTime - now) / (1000 * 60 * 60);

        if (hoursUntilReservation < 24) {
            return res.status(400).json({
                message: 'Reservations can only be modified at least 24 hours in advance'
            });
        }

        // If date or time is being changed, check availability
        if (updates.date || updates.timeSlot) {
            const checkDate = updates.date ? new Date(updates.date) : reservation.date;
            const checkTime = updates.timeSlot || reservation.timeSlot;
            const isAvailable = await Reservation.checkAvailability(
                checkDate,
                checkTime,
                updates.selectedServices || reservation.selectedServices
            );

            if (!isAvailable) {
                return res.status(400).json({
                    message: 'The requested time slot is not available'
                });
            }
        }

        // Apply updates to both reservation details and customerInfo
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                reservation[key] = updates[key];
            }
        });

        if (customerInfo) {
            Object.keys(customerInfo).forEach(key => {
                if (customerInfo[key] !== undefined) {
                    reservation.customerInfo[key] = customerInfo[key];
                }
            });
        }

        await reservation.save();

        // Send modification confirmation
        try {
            await emailService.sendReservationConfirmation(
                reservation.customerInfo.email,
                {
                    ...reservation.toObject(),
                    isModification: true,
                    formattedDate: reservation.date.toLocaleDateString()
                }
            );
        } catch (error) {
            console.error('Email notification error:', error);
        }

        res.json({
            message: 'Reservation modified successfully',
            reservation: {
                id: reservation._id,
                status: reservation.status,
                date: reservation.date,
                timeSlot: reservation.timeSlot,
                numberOfPeople: reservation.numberOfPeople,
                selectedServices: reservation.selectedServices
            }
        });
    }),

    getReservationById: asyncHandler(async (req, res) => {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid reservation ID'
            });
        }

        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return res.status(404).json({
                message: 'Reservation not found'
            });
        }

        res.json({
            id: reservation._id,
            status: reservation.status,
            date: reservation.date,
            timeSlot: reservation.timeSlot,
            numberOfPeople: reservation.numberOfPeople,
            selectedServices: reservation.selectedServices,
            customerInfo: {
                name: reservation.customerInfo.name,
                email: reservation.customerInfo.email,
                phone: reservation.customerInfo.phone,
                petName: reservation.customerInfo.petName || '',
                petType: reservation.customerInfo.petType || '',
                message: reservation.customerInfo.message || '',
                location: reservation.customerInfo.location || ''
            },
            createdAt: reservation.createdAt,
            updatedAt: reservation.updatedAt
        });
    })
};

module.exports = reservationController;