const express = require('express');
const router = express.Router();
const {
    createReservation,
    getMyReservations,
    updateReservation,
    cancelReservation
} = require('../controllers/reservationcontroller');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createReservation)
    .get(protect, getMyReservations);

router.route('/:id')
    .put(protect, updateReservation)
    .delete(protect, cancelReservation);

module.exports = router;