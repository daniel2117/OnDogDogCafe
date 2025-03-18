const express = require("express");
const {
    createReservation,
    getAvailableSlots,
    updateReservationStatus,
    getReservations,  // ✅ Added function to fetch user reservations
    cancelReservation // ✅ Added function for cancellation
} = require("../controllers/reservationController");

const router = express.Router();

// Create a new reservation
router.post("/", createReservation);

// Get all reservations for the logged-in user
router.get("/", getReservations);  // ✅ Added route for fetching user reservations

// Get available time slots for a service
router.get("/available", getAvailableSlots);

// Update reservation status (Confirm / Cancel)
router.patch("/:reservationId/status", updateReservationStatus);

// Cancel a reservation
router.delete("/:id", cancelReservation);  // ✅ Added route for deletion

module.exports = router;
