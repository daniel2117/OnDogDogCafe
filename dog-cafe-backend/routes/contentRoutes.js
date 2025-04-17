const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentcontroller');

router.get('/services', contentController.getServices);
router.get('/business-info', contentController.getBusinessInfo);
router.get('/terms', contentController.getTerms);
router.get('/privacy', contentController.getPrivacyPolicy);

module.exports = router;