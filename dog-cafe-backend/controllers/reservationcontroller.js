const Reservation = require("../models/Reservation");
const VerificationToken = require("../models/VerificationToken");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const { sendEmail } = require("../middleware/emailService");

// Available time slots
const timeSlots = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
const validServices = ["Tourist Area", "Dog Play Area", "Pet Grooming", "Indoor Dog Pool", "Dog Hotel"];

// Request reservation and send verification email
const requestReservation = asyncHandler(async (req, res) => {
    try {
        const { service, date, time, visitors, dogs } = req.body;
        const user = req.user; // From auth middleware

        // Check if the time slot is available
        const existingReservations = await Reservation.find({ date, time, service });
        if (existingReservations.length >= 5) {
            return res.status(400).json({ 
                message: "Selected time slot is fully booked for this service!" 
            });
        }

        // Check for existing pending reservation
        const existingPending = await Reservation.findOne({
            user: user._id,
            date,
            status: "Pending"
        });

        if (existingPending) {
            return res.status(400).json({ 
                message: "You already have a pending reservation for this date!" 
            });
        }

        // Generate verification token
        const token = crypto.randomBytes(32).toString("hex");

        // Save temporary reservation request
        const verification = new VerificationToken({
            email: user.email,
            token,
            reservationData: { 
                user: user._id, 
                service, 
                date, 
                time, 
                visitors, 
                dogs 
            },
            expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
        });

        await verification.save();

        // Send verification email
        const verificationLink = `${process.env.FRONTEND_URL}/verify-reservation?token=${token}`;
        
        await sendEmail(
            user.email,
            "Verify Your Dog Café Reservation",
            `Please confirm your reservation for ${service} on ${date} at ${time}.\n\n` +
            `Click here to confirm: ${verificationLink}\n\n` +
            `This link will expire in 30 minutes.\n\n` +
            `If you didn't request this reservation, please ignore this email.`
        );

        res.status(200).json({ 
            message: "Verification email sent! Please check your inbox to confirm the reservation." 
        });

    } catch (error) {
        console.error("Reservation Request Error:", error);
        res.status(500).json({ 
            message: "Error processing reservation request", 
            error: error.message 
        });
    }
});

// Verify and confirm reservation
const verifyReservation = asyncHandler(async (req, res) => {
    try {
        const { token } = req.params;

        // Find verification token
        const verification = await VerificationToken.findOne({ 
            token,
            expiresAt: { $gt: Date.now() }
        });

        if (!verification) {
            return res.status(400).json({ 
                message: "Invalid or expired verification token" 
            });
        }

        // Check if the time slot is still available
        const { service, date, time } = verification.reservationData;
        const existingReservations = await Reservation.find({ date, time, service });
        
        if (existingReservations.length >= 5) {
            await VerificationToken.deleteOne({ token });
            return res.status(400).json({ 
                message: "Sorry, this time slot is no longer available!" 
            });
        }

        // Create the confirmed reservation
        const newReservation = new Reservation({
            ...verification.reservationData,
            status: "Confirmed"
        });
        
        await newReservation.save();

        // Delete the verification token
        await VerificationToken.deleteOne({ token });

        // Send confirmation email
        await sendEmail(
            verification.email,
            "Reservation Confirmed - Dog Café",
            `Your reservation has been confirmed!\n\n` +
            `Service: ${service}\n` +
            `Date: ${date}\n` +
            `Time: ${time}\n` +
            `Number of Visitors: ${verification.reservationData.visitors}\n` +
            `Number of Dogs: ${verification.reservationData.dogs}\n\n` +
            `We look forward to seeing you!`
        );

        res.status(200).json({ 
            message: "Reservation confirmed successfully!", 
            reservation: newReservation 
        });

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ 
            message: "Error verifying reservation", 
            error: error.message 
        });
    }
});

// Get available time slots
const getAvailableSlots = asyncHandler(async (req, res) => {
    try {
        const { date, service } = req.query;

        if (!date || !service) {
            return res.status(400).json({ 
                message: "Date and service type are required!" 
            });
        }

        if (!validServices.includes(service)) {
            return res.status(400).json({ 
                message: "Invalid service type!" 
            });
        }

        // Get all reservations for the date
        const reservations = await Reservation.find({ 
            date, 
            service,
            status: { $ne: "Cancelled" }
        });

        // Calculate available slots
        const availableSlots = timeSlots.map(time => {
            const slotReservations = reservations.filter(r => r.time === time);
            return {
                time,
                available: 5 - slotReservations.length,
                isAvailable: slotReservations.length < 5
            };
        });

        res.status(200).json({ availableSlots });
    } catch (error) {
        console.error("Get Available Slots Error:", error);
        res.status(500).json({ 
            message: "Error fetching available slots", 
            error: error.message 
        });
    }
});

// Get user's reservations
const getReservations = asyncHandler(async (req, res) => {
    try {
        const reservations = await Reservation.find({ 
            user: req.user._id 
        }).sort({ date: 1, time: 1 });

        res.status(200).json(reservations);
    } catch (error) {
        console.error("Get Reservations Error:", error);
        res.status(500).json({ 
            message: "Error fetching reservations", 
            error: error.message 
        });
    }
});

// Update reservation status
const updateReservationStatus = asyncHandler(async (req, res) => {
    try {
        const { reservationId } = req.params;
        const { status } = req.body;

        if (!["Confirmed", "Cancelled"].includes(status)) {
            return res.status(400).json({ 
                message: "Invalid status!" 
            });
        }

        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).json({ 
                message: "Reservation not found!" 
            });
        }

        // Check if user owns this reservation
        if (reservation.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                message: "Not authorized to update this reservation" 
            });
        }

        reservation.status = status;
        await reservation.save();

        // Send status update email
        await sendEmail(
            req.user.email,
            `Reservation ${status} - Dog Café`,
            `Your reservation for ${reservation.service} on ${reservation.date} ` +
            `at ${reservation.time} has been ${status.toLowerCase()}.`
        );

        res.status(200).json({ 
            message: `Reservation ${status.toLowerCase()} successfully!`, 
            reservation 
        });

    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ 
            message: "Error updating reservation status", 
            error: error.message 
        });
    }
});

// Cancel reservation
const cancelReservation = asyncHandler(async (req, res) => {
    try {
        const { reservationId } = req.params;
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).json({ 
                message: "Reservation not found!" 
            });
        }

        // Check if user owns this reservation
        if (reservation.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                message: "Not authorized to cancel this reservation" 
            });
        }

        reservation.status = "Cancelled";
        await reservation.save();

        // Send cancellation email
        await sendEmail(
            req.user.email,
            "Reservation Cancelled - Dog Café",
            `Your reservation for ${reservation.service} on ${reservation.date} ` +
            `at ${reservation.time} has been cancelled.`
        );

        res.status(200).json({ 
            message: "Reservation cancelled successfully!", 
            reservation 
        });

    } catch (error) {
        console.error("Cancel Reservation Error:", error);
        res.status(500).json({ 
            message: "Error cancelling reservation", 
            error: error.message 
        });
    }
});

module.exports = {
    requestReservation,
    verifyReservation,
    getReservations,
    getAvailableSlots,
    updateReservationStatus,
    cancelReservation
};