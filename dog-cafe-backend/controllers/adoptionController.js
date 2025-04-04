const asyncHandler = require('express-async-handler');
const Dog = require('../models/Dog');
const Adoption = require('../models/Adoption');

const adoptionController = {
    getAllDogs: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = { status: 'available' };
        
        if (req.query.breed) filter.breed = req.query.breed;
        if (req.query.age) filter.age = req.query.age;

        const dogs = await Dog.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-__v');

        const total = await Dog.countDocuments(filter);

        res.json({
            dogs,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    }),

    getDogById: asyncHandler(async (req, res) => {
        const dog = await Dog.findById(req.params.id)
            .select('-__v');
        
        if (!dog) {
            res.status(404);
            throw new Error('Dog not found');
        }
        res.json(dog);
    }),

    createAdoptionApplication: asyncHandler(async (req, res) => {
        const { 
            dogId, 
            livingArrangement, 
            hasOtherPets, 
            experience, 
            reason,
            income,
            homeType,
            hasYard,
            familySize
        } = req.body;

        // Validate required fields
        if (!dogId || !livingArrangement || !experience || !reason) {
            res.status(400);
            throw new Error('Please fill all required fields');
        }

        // Check for existing applications
        const existingApplication = await Adoption.findOne({
            user: req.user._id,
            dog: dogId,
            status: { $in: ['pending', 'approved'] }
        });

        if (existingApplication) {
            res.status(400);
            throw new Error('You already have an active application for this dog');
        }

        const dog = await Dog.findById(dogId);
        if (!dog || dog.status !== 'available') {
            res.status(400);
            throw new Error('Dog not available for adoption');
        }

        const application = await Adoption.create({
            user: req.user._id,
            dog: dogId,
            applicationDetails: {
                livingArrangement,
                hasOtherPets,
                experience,
                reason,
                income,
                homeType,
                hasYard,
                familySize
            },
            status: 'pending',
            submittedAt: new Date()
        });

        // Update dog status
        dog.status = 'pending';
        await dog.save();

        // Populate the response with dog details
        await application.populate('dog');
        await application.populate('user', 'name email');

        res.status(201).json(application);
    }),

    getMyApplications: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;

        const filter = { user: req.user._id };
        if (status) filter.status = status;

        const applications = await Adoption.find(filter)
            .populate('dog')
            .populate('user', 'name email')
            .sort('-submittedAt')
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-__v');

        const total = await Adoption.countDocuments(filter);

        res.json({
            applications,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    }),

    updateApplication: asyncHandler(async (req, res) => {
        const application = await Adoption.findById(req.params.id);

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        if (application.user.toString() !== req.user._id.toString() && 
            req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized');
        }

        const updatedApplication = await Adoption.findByIdAndUpdate(
            req.params.id,
            { $set: { 
                'applicationDetails': req.body,
                'updatedAt': new Date()
            }},
            { new: true }
        ).populate('dog').populate('user', 'name email');

        res.json(updatedApplication);
    }),

    withdrawApplication: asyncHandler(async (req, res) => {
        const application = await Adoption.findById(req.params.id);

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        if (application.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized');
        }

        if (application.status === 'approved') {
            res.status(400);
            throw new Error('Cannot withdraw an approved application');
        }

        application.status = 'withdrawn';
        application.withdrawnAt = new Date();
        await application.save();

        // Update dog status back to available
        await Dog.findByIdAndUpdate(application.dog, { status: 'available' });

        res.json({ message: 'Application withdrawn successfully' });
    })
};

module.exports = adoptionController;