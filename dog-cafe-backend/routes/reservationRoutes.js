const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationcontroller');

router.get('/availability', reservationController.getAvailability);
router.post('/verify-email', reservationController.verifyContact);
router.post('/verify-code', reservationController.verifyCode);
router.post('/create', reservationController.createReservation);
router.get('/history', reservationController.getUserReservations);
router.post('/:id/cancel', reservationController.cancelReservation);
router.put('/:id', reservationController.modifyReservation);

router.post('/test-email', async (req, res) => {
    try {
        const { email, type } = req.body;
        let result;

        switch(type) {
            case 'verification':
                result = await emailService.sendVerificationEmail(
                    email,
                    '123456'
                );
                break;
            case 'reservation':
                result = await emailService.sendReservationConfirmation(
                    email,
                    {
                        customerInfo: { name: 'Test User' },
                        date: new Date(),
                        timeSlot: '14:00',
                        selectedServices: ['Cafe Visit']
                    }
                );
                break;
            case 'adoption':
                result = await emailService.sendAdoptionApplicationConfirmation(
                    email,
                    {
                        customerInfo: { name: 'Test User' },
                        dog: { name: 'Max' },
                        _id: '12345',
                        status: 'pending'
                    }
                );
                break;
            default:
                throw new Error('Invalid email type');
        }

        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


module.exports = router;