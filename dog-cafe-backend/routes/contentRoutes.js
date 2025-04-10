const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentcontroller');

router.get('/services', contentController.getServices);
router.get('/business-info', contentController.getBusinessInfo);

module.exports = router;