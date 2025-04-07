const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationcontroller');

router.get('/availability', reservationController.getAvailability);
router.post('/verify-email', reservationController.verifyContact);
router.post('/verify-code', reservationController.verifyCode);
router.post('/create', reservationController.createReservation);
router.get('/history', reservationController.getUserReservations);
router.post('/:id/cancel', reservationController.cancelReservation);

router.post('/test-email', async (req, res) => {
    try {
        const emailService = require('../utils/emailService');
        const testCode = '123456';
        
        const result = await emailService.sendVerificationEmail(
            req.body.email,
            testCode
        );

        if (result) {
            res.json({ 
                success: true, 
                message: `Test email sent with code: ${testCode}` 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to send email' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});


module.exports = router;