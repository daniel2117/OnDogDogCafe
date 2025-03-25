const DogAdoptionRequest = require('../models/DogAdoptionRequest');
const DogAdoptionListing = require('../models/DogAdoptionListing');
const DogAdopterRequest = require('../models/DogAdopterRequest');
const { sendEmail } = require('../middleware/emailService');

// Submit dog for adoption
const submitAdoptionRequest = async (req, res) => {
    try {
        const request = new DogAdoptionRequest(req.body);
        await request.save();
        await sendEmail(req.body.ownerEmail, 'Dog Adoption Request Received', `Your submission for ${req.body.dogName} has been received.`);
        res.status(201).json({ message: 'Adoption request submitted.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Staff approves/rejects submission
const reviewAdoptionRequest = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const request = await DogAdoptionRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = status;
        request.rejectionReason = rejectionReason || null;
        await request.save();

        if (status === 'Approved') {
            const newListing = new DogAdoptionListing({ ...request.toObject() });
            delete newListing._id; // Prevent duplicate _id issues
            await newListing.save();
            await sendEmail(request.ownerEmail, 'Dog Approved for Adoption', `Your dog ${request.dogName} is now listed for adoption.`);
        } else {
            await sendEmail(request.ownerEmail, 'Dog Adoption Rejected', `Your request was rejected. Reason: ${rejectionReason}`);
        }

        res.json({ message: `Request ${status.toLowerCase()}.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch all available dogs
const getAvailableDogs = async (req, res) => {
    try {
        const dogs = await DogAdoptionListing.find();
        res.json(dogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Adopter submits interest form
const submitAdopterRequest = async (req, res) => {
    try {
        const request = new DogAdopterRequest(req.body);
        await request.save();
        res.status(201).json({ message: 'Adoption request submitted.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { submitAdoptionRequest, reviewAdoptionRequest, getAvailableDogs, submitAdopterRequest };
