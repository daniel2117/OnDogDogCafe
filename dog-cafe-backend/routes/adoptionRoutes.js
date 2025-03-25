const express = require('express');
const { submitAdoptionRequest, reviewAdoptionRequest, getAvailableDogs, submitAdopterRequest } = require('../controllers/adoptionController');

const router = express.Router();

router.post('/submit', submitAdoptionRequest);
router.put('/review/:id', reviewAdoptionRequest);
router.get('/available', getAvailableDogs);
router.post('/adopt', submitAdopterRequest);

module.exports = router;
