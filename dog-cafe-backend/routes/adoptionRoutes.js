const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    submitInitialInterest,
    scheduleMeetGreet,
    updateMeetGreet,
    scheduleHomeVisit,
    updateHomeVisit,
    startTrialPeriod,
    addTrialLog,
    requestSupport,
    completeFinalAdoption
} = require('../controllers/adoptionProcessController');

// Initial Interest
router.post('/applications', protect, submitInitialInterest);

// Meet & Greet
router.post('/meet-greet', protect, scheduleMeetGreet);
router.put('/meet-greet/:id', protect, authorize('staff', 'admin'), updateMeetGreet);

// Home Visit
router.post('/home-visit', protect, authorize('staff', 'admin'), scheduleHomeVisit);
router.put('/home-visit/:id', protect, authorize('staff', 'admin'), updateHomeVisit);

// Trial Period
router.post('/trial', protect, authorize('staff', 'admin'), startTrialPeriod);
router.put('/trial/:id/log', protect, addTrialLog);
router.post('/trial/:id/support', protect, requestSupport);

// Final Adoption
router.post('/finalize', protect, authorize('staff', 'admin'), completeFinalAdoption);

module.exports = router;