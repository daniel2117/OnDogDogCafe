const express = require('express');
const router = express.Router();
const myPageController = require('../controllers/myPageController');

router.get('/applications', myPageController.getUserApplications);

module.exports = router;
