const express = require("express");
const {
    requestReservation,
    verifyReservation,
    getReservations,
    getAvailableSlots,
    updateReservationStatus,
    cancelReservation
} = require("../controllers/reservationController");
const { protect } = require("../middleware/authMiddleware");
const { validateReservation } = require("../middleware/validationMiddleware");

const router = express.Router();

// Public routes
router.get("/availability", getAvailableSlots);
router.get("/verify/:token", verifyReservation);

// Protected routes
router.post("/request", protect, validateReservation, requestReservation);
router.get("/", protect, getReservations);
router.patch("/:reservationId/status", protect, updateReservationStatus);
router.delete("/:reservationId", protect, cancelReservation);

module.exports = router;