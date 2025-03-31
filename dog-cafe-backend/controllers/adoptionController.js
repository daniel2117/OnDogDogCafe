const DogAdoptionListing = require('../models/DogAdoptionListing');
const DogAdoptionRequest = require('../models/DogAdoptionRequest');
const DogAdopterRequest = require('../models/DogAdopterRequest');
const DogInterest = require('../models/DogInterest');
const { sendEmail } = require('../middleware/emailService');

// Get list of available dogs with interest count
const getAvailableDogs = async (req, res) => {
    try {
        const dogs = await DogAdoptionListing.find({ status: 'Available' })
            .select('_id dogName gender breed age size shortDescription profilePhoto interestCount');
        res.json(dogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get detailed dog info by ID
const getDogDetails = async (req, res) => {
    try {
        const dogId = req.params.id;
        const userId = req.user?.id;

        const dog = await DogAdoptionListing.findById(dogId);
        if (!dog) {
            return res.status(404).json({ message: 'Dog not found' });
        }

        let userHasInterest = false;
        if (userId) {
            const existingInterest = await DogInterest.findOne({ dogId, userId });
            userHasInterest = !!existingInterest;
        }

        const similarPets = await DogAdoptionListing.find({
            _id: { $ne: dogId },
            status: 'Available',
            $or: [
                { breed: dog.breed },
                { age: { $gte: dog.age - 1, $lte: dog.age + 1 } }
            ]
        })
        .select('dogName breed interestCount')
        .limit(4);

        const response = {
            ...dog.toObject(),
            similarPets,
            userHasInterest
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get filtered list of available dogs
const getFilteredDogs = async (req, res) => {
    try {
        const { breed, color, gender, age, size } = req.headers;
        
        const filter = { status: 'Available' };

        if (breed) filter.breed = breed;
        if (color) filter.color = color;
        if (gender) filter.gender = gender;
        if (size) filter.size = size;
        if (age) {
            const [minAge, maxAge] = age.split('-').map(Number);
            filter.age = { $gte: minAge, $lte: maxAge };
        }

        const dogs = await DogAdoptionListing.find(filter)
            .select('_id dogName gender breed age size shortDescription profilePhoto interestCount');

        res.json(dogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Toggle interest in a dog
const toggleDogInterest = async (req, res) => {
    try {
        const dogId = req.params.id;
        const userId = req.user.id;

        const dog = await DogAdoptionListing.findById(dogId);
        if (!dog) {
            return res.status(404).json({ message: 'Dog not found' });
        }

        const existingInterest = await DogInterest.findOne({ dogId, userId });

        if (existingInterest) {
            await DogInterest.deleteOne({ _id: existingInterest._id });
            dog.interestCount = Math.max(0, dog.interestCount - 1);
            await dog.save();
            
            res.json({ 
                message: 'Interest removed', 
                interestCount: dog.interestCount,
                hasInterest: false 
            });
        } else {
            const newInterest = new DogInterest({ dogId, userId });
            await newInterest.save();
            dog.interestCount += 1;
            await dog.save();

            res.json({ 
                message: 'Interest added', 
                interestCount: dog.interestCount,
                hasInterest: true 
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get trending dogs
const getTrendingDogs = async (req, res) => {
    try {
        const trendingDogs = await DogAdoptionListing.find({ status: 'Available' })
            .select('_id dogName breed interestCount profilePhoto')
            .sort({ interestCount: -1 })
            .limit(5);
        
        res.json(trendingDogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Submit dog for adoption
const submitAdoptionRequest = async (req, res) => {
    try {
        const request = new DogAdoptionRequest(req.body);
        await request.save();
        await sendEmail(req.body.ownerEmail, 'Dog Adoption Request Received', 
            `Your submission for ${req.body.dogName} has been received.`);
        res.status(201).json({ message: 'Adoption request submitted.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Staff reviews adoption request
const reviewAdoptionRequest = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const request = await DogAdoptionRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        request.rejectionReason = rejectionReason || null;
        await request.save();

        if (status === 'Approved') {
            const newListing = new DogAdoptionListing({
                ...request.toObject(),
                interestCount: 0,
                status: 'Available'
            });
            delete newListing._id;
            await newListing.save();
            await sendEmail(request.ownerEmail, 'Dog Approved for Adoption', 
                `Your dog ${request.dogName} is now listed for adoption.`);
        } else {
            await sendEmail(request.ownerEmail, 'Dog Adoption Rejected', 
                `Your request was rejected. Reason: ${rejectionReason}`);
        }

        res.json({ message: `Request ${status.toLowerCase()}.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Submit adopter request
const submitAdopterRequest = async (req, res) => {
    try {
        const request = new DogAdopterRequest(req.body);
        await request.save();
        res.status(201).json({ message: 'Adoption request submitted.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAvailableDogs,
    getDogDetails,
    getFilteredDogs,
    toggleDogInterest,
    getTrendingDogs,
    submitAdoptionRequest,
    reviewAdoptionRequest,
    submitAdopterRequest
};