const Reservation = require("../models/Reservation");
const VerificationToken = require("../models/VerificationToken");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Create reservation request (send verification email)
const requestReservation = asyncHandler(async (req, res) => {
    try {
        const { user, service, date, time, visitors, dogs } = req.body;

        // Validate service type
        const validServices = ["Tourist Area", "Dog Play Area", "Pet Grooming", "Indoor Dog Pool", "Dog Hotel"];
        if (!validServices.includes(service)) {
            return res.status(400).json({ message: "Invalid service type!" });
        }

        // Check if the time slot is available
        const existingReservations = await Reservation.find({ date, time, service });
        if (existingReservations.length >= 5) {
            return res.status(400).json({ message: "Selected time slot is fully booked for this service!" });
        }

        // Generate verification token
        const token = crypto.randomBytes(32).toString("hex");

        // Save temporary reservation request
        const verification = new VerificationToken({
            email: user.email,
            token,
            reservationData: { user, service, date, time, visitors, dogs },
            expiresAt: Date.now() + 30 * 60 * 1000 // Expires in 30 minutes
        });

        await verification.save();

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verificationLink = `${process.env.FRONTEND_URL}/verify-reservation?token=${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Verify Your Reservation",
            text: `Click the link to confirm your booking: ${verificationLink}`,
            html: `<p>Click <a href="${verificationLink}">here</a> to confirm your booking.</p>`,
        });

        res.status(200).json({ message: "Verification email sent! Please check your inbox to confirm the reservation." });

    } catch (error) {
        res.status(500).json({ message: "Error processing reservation", error });
    }
});

// Verify reservation and confirm booking
const verifyReservation = asyncHandler(async (req, res) => {
    try {
        const { token } = req.params;

        // Find verification token
        const verification = await VerificationToken.findOne({ token });

        if (!verification) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Check if the time slot is still available
        const { service, date, time } = verification.reservationData;
        const existingReservations = await Reservation.find({ date, time, service });
        if (existingReservations.length >= 5) {
            await VerificationToken.deleteOne({ token }); // Remove expired request
            return res.status(400).json({ message: "Time slot is no longer available!" });
        }

        // Create the reservation
        const newReservation = new Reservation(verification.reservationData);
        await newReservation.save();

        // Delete the verification token after successful confirmation
        await VerificationToken.deleteOne({ token });

        res.status(200).json({ message: "Reservation confirmed!", reservation: newReservation });

    } catch (error) {
        res.status(500).json({ message: "Error verifying reservation", error });
    }
});

// Other existing functions remain unchanged
const getReservations = asyncHandler(async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const reservations = await Reservation.find({ user: req.user.userId });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const getAvailableSlots = asyncHandler(async (req, res) => {
    try {
        const { date, service } = req.query;

        if (!service) {
            return res.status(400).json({ message: "Service type is required!" });
        }

        const validServices = ["Tourist Area", "Dog Play Area", "Pet Grooming", "Indoor Dog Pool", "Dog Hotel"];
        if (!validServices.includes(service)) {
            return res.status(400).json({ message: "Invalid service type!" });
        }

        const reservations = await Reservation.find({ date, service });

        // Define available time slots
        const timeSlots = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
        const availableSlots = timeSlots.filter(slot => {
            const slotReservations = reservations.filter(r => r.time === slot);
            return slotReservations.length < 5;
        });

        res.status(200).json({ availableSlots });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

const updateReservationStatus = asyncHandler(async (req, res) => {
    try {
        const { reservationId } = req.params;
        const { status } = req.body;

        if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status!" });
        }

        const reservation = await Reservation.findByIdAndUpdate(
            reservationId,
            { status },
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found!" });
        }

        res.status(200).json({ message: "Reservation updated!", reservation });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

const cancelReservation = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findByIdAndUpdate(id, { status: "Cancelled" }, { new: true });

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found!" });
        }

        res.status(200).json({ message: "Reservation cancelled successfully!", reservation });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Export all functions
module.exports = { 
    requestReservation, 
    verifyReservation,
    getReservations, 
    getAvailableSlots, 
    updateReservationStatus, 
    cancelReservation 
};
