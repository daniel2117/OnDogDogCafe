const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationcontroller');

router.get('/availability', reservationController.getAvailability);
router.post('/verify-contact', reservationController.verifyContact);
router.post('/create', reservationController.createReservation);
router.get('/history', reservationController.getUserReservations);
router.post('/:id/cancel', reservationController.cancelReservation);

module.exports = router;