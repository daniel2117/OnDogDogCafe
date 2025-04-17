const asyncHandler = require('express-async-handler');
const Dog = require('../models/Dog');
const Adoption = require('../models/Adoption');
const Content = require('../models/Content');

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
        const {
            email,
            firstName,
            lastName,
            address,
            environment,
            homeImages,
            roommates,
            otherAnimals
        } = req.body;

        // Validate request body
        if (!email || !firstName || !lastName || !address || !environment) {
            res.status(400);
            throw new Error('Please provide all required information');
        }

        // Create application
        const application = await Adoption.create({
            personalInfo: {
                email,
                firstName,
                lastName,
                address
            },
            environment,
            homeImages,
            roommates,
            otherAnimals,
            status: 'pending',
            submittedAt: new Date()
        });

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
    }),

    getFilters: asyncHandler(async (req, res) => {
        const [breeds, colors, ages] = await Promise.all([
            Dog.distinct('breed'),
            Dog.distinct('color'),
            Dog.distinct('age')
        ]);

        res.json({
            breed: breeds,
            color: colors,
            gender: ['male', 'female'],
            age: ages.sort((a, b) => a - b),
            size: ['small', 'medium', 'large']
        });
    }),

    getTerms: asyncHandler(async (req, res) => {
        const lang = req.headers['accept-language']?.includes('zh') ? 'zh' : 'en';
        const terms = await Content.findOne({ type: 'terms' });
        if (!terms) {
            res.status(404);
            throw new Error('Terms not found');
        }
        res.json({ content: terms.content[lang] });
    }),

    getPrivacyPolicy: asyncHandler(async (req, res) => {
        const lang = req.headers['accept-language']?.includes('zh') ? 'zh' : 'en';
        const privacy = await Content.findOne({ type: 'privacy' });
        if (!privacy) {
            res.status(404);
            throw new Error('Privacy policy not found');
        }
        res.json({ content: privacy.content[lang] });
    })
};

module.exports = adoptionController;
