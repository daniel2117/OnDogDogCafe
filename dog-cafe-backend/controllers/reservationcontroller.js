const Reservation = require("../models/Reservation");

const createReservation = async (req, res) => {
    try {
        const { user, service, date, time, visitors, dogs } = req.body;

        // Validate service type
        const validServices = ["Tourist Area", "Dog Play Area", "Pet Grooming", "Indoor Dog Pool", "Dog Hotel"];
        if (!validServices.includes(service)) {
            return res.status(400).json({ message: "Invalid service type!" });
        }

        // Check if the time slot is available
        const existingReservations = await Reservation.find({ date, time, service });

        if (existingReservations.length >= 5) { // Limit 5 reservations per slot per service
            return res.status(400).json({ message: "Selected time slot is fully booked for this service!" });
        }

        // Create the reservation
        const reservation = new Reservation({
            user,
            service,
            date,
            time,
            visitors,
            dogs,
            status: "Pending"
        });

        await reservation.save();
        res.status(201).json({ message: "Reservation successful!", reservation });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


const getReservations = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const reservations = await Reservation.find({ user: req.user.userId });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getAvailableSlots = async (req, res) => {
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
            return slotReservations.length < 5; // Limit per service per time slot
        });

        res.status(200).json({ availableSlots });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


const updateReservationStatus = async (req, res) => {
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
};


const cancelReservation = async (req, res) => {
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
};

// Export all functions
module.exports = { 
    createReservation, 
    getReservations, 
    getAvailableSlots, 
    updateReservationStatus, 
    cancelReservation 
};
