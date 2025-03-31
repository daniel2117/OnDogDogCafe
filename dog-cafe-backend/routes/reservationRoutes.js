const express = require("express");
const {
    createReservation,
    getAvailableSlots,
    updateReservationStatus,
    getReservations,
    cancelReservation
} = require("../controllers/reservationController");

const { protect } = require("../middleware/authMiddleware"); // 🔒 Optional: Authentication middleware

const router = express.Router();

// Create a new reservation (protected)
router.post("/", protect, createReservation);

// Get all reservations for the logged-in user (protected)
router.get("/", protect, getReservations);

// Get available time slots for a service (renamed for clarity)
router.get("/availability", getAvailableSlots);

// Update reservation status (Confirm / Cancel) (protected)
router.patch("/:reservationId/status", protect, updateReservationStatus);

// Cancel a reservation (protected & consistent naming)
router.delete("/:reservationId", protect, cancelReservation);

module.exports = router;
