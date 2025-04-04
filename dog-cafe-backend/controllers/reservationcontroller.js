const asyncHandler = require('express-async-handler');
const Reservation = require('../models/Reservation');

const reservationController = {
    createReservation: asyncHandler(async (req, res) => {
        const { date, timeSlot, numberOfPeople, specialRequests } = req.body;

        // Check if timeslot is available
        const existingReservation = await Reservation.findOne({
            date,
            timeSlot,
            status: { $ne: 'cancelled' }
        });

        if (existingReservation) {
            res.status(400);
            throw new Error('Time slot not available');
        }

        const reservation = await Reservation.create({
            user: req.user._id,
            date,
            timeSlot,
            numberOfPeople,
            specialRequests
        });

        res.status(201).json(reservation);
    }),

    getMyReservations: asyncHandler(async (req, res) => {
        const reservations = await Reservation.find({ user: req.user._id })
            .sort('-date');
        res.json(reservations);
    }),

    updateReservation: asyncHandler(async (req, res) => {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            res.status(404);
            throw new Error('Reservation not found');
        }

        if (reservation.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized');
        }

        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedReservation);
    }),

    cancelReservation: asyncHandler(async (req, res) => {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            res.status(404);
            throw new Error('Reservation not found');
        }

        if (reservation.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized');
        }

        reservation.status = 'cancelled';
        await reservation.save();

        res.json({ message: 'Reservation cancelled' });
    })
};

module.exports = reservationController;