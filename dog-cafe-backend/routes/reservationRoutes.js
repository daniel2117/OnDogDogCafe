const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationcontroller');
const { validateReservation } = require('../middleware/validate');

// Remove test route in production
if (process.env.NODE_ENV === 'development') {
    router.post('/test-email', reservationController.testEmail);
}

router.get('/availability', reservationController.getAvailability);
router.post('/verify-email', reservationController.verifyContact);
router.post('/verify-code', reservationController.verifyCode);
router.post('/create', validateReservation, reservationController.createReservation);
router.get('/history', reservationController.getUserReservations);
router.post('/:id/cancel', reservationController.cancelReservation);

module.exports = router;