const asyncHandler = require('express-async-handler');
const Dog = require('../models/Dog');
const Adoption = require('../models/Adoption');

const adoptionController = {
    getAllDogs: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = { status: 'available' };
        
        // Enhanced filtering
        if (req.query.breed) filter.breed = req.query.breed;
        if (req.query.age) filter.age = parseInt(req.query.age);
        if (req.query.size) filter.size = req.query.size;
        if (req.query.gender) filter.gender = req.query.gender;

        const dogs = await Dog.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Dog.countDocuments(filter);

        res.json({
            dogs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    }),

    getDogById: asyncHandler(async (req, res) => {
        const dog = await Dog.findById(req.params.id);
        if (!dog) {
            res.status(404);
            throw new Error('Dog not found');
        }
        res.json(dog);
    }),

    createAdoptionApplication: asyncHandler(async (req, res) => {
        const { dogId, customerInfo, applicationDetails } = req.body;

        // Validate required fields
        if (!dogId || !customerInfo || !applicationDetails) {
            res.status(400);
            throw new Error('Please provide all required information');
        }

        const dog = await Dog.findById(dogId);
        if (!dog || dog.status !== 'available') {
            res.status(400);
            throw new Error('Dog is not available for adoption');
        }

        const application = await Adoption.create({
            dog: dogId,
            customerInfo,
            applicationDetails,
            status: 'pending',
            submittedAt: new Date()
        });

        // Update dog status
        dog.status = 'pending';
        await dog.save();

        res.status(201).json({
            message: 'Application submitted successfully',
            applicationId: application._id
        });
    }),

    getSimilarDogs: asyncHandler(async (req, res) => {
        const dog = await Dog.findById(req.params.id);
        if (!dog) {
            res.status(404);
            throw new Error('Dog not found');
        }

        const similarDogs = await Dog.find({
            _id: { $ne: dog._id },
            breed: dog.breed,
            status: 'available'
        }).limit(4);

        res.json(similarDogs);
    })
};

module.exports = adoptionController;