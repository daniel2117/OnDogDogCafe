const asyncHandler = require('express-async-handler');
const Dog = require('../models/Dog');
const Adoption = require('../models/Adoption');
const cache = require('../utils/cache');

const adoptionController = {
    getAllDogs: asyncHandler(async (req, res) => {
        try {
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 9));
            
            // Clean query parameters
            const cleanQuery = Object.entries(req.query)
                .filter(([_, value]) => value != null && value !== '')
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
            
            // Build filter object
            const filter = { status: 'available' };
            
            // Apply case-insensitive text filters
            if (cleanQuery.breed) filter.breed = new RegExp(cleanQuery.breed, 'i');
            if (cleanQuery.size) filter.size = new RegExp(cleanQuery.size, 'i');
            if (cleanQuery.gender) filter.gender = new RegExp(cleanQuery.gender, 'i');
            
            // Handle different age filter formats
            if (cleanQuery.age) {
                if (cleanQuery.age.includes('-')) {
                    // Range format (e.g., "1-5")
                    const [minAge, maxAge] = cleanQuery.age.split('-').map(Number);
                    if (!isNaN(minAge) && !isNaN(maxAge)) {
                        filter.age = { $gte: minAge, $lte: maxAge };
                    }
                } else {
                    // Single age value
                    const age = parseInt(cleanQuery.age);
                    if (!isNaN(age)) {
                        filter.age = age;
                    }
                }
            }

            // Create cache key from cleaned query
            const cacheKey = `dogs:${page}:${limit}:${JSON.stringify(cleanQuery)}`;
            
            // Try to get from cache
            const cached = await cache.get(cacheKey);
            if (cached) {
                return res.json(cached);
            }

            // Execute queries in parallel
            const [dogs, total] = await Promise.all([
                Dog.find(filter)
                    .select('name breed age size gender imageUrl status petId profile description')
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean(),
                Dog.countDocuments(filter)
            ]);

            const response = {
                dogs,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total,
                hasMore: page * limit < total
            };

            // Cache for 5 minutes
            await cache.set(cacheKey, response, 300);

            res.json(response);
        } catch (error) {
            console.error('Error in getAllDogs:', error);
            res.status(500).json({
                message: 'Failed to fetch dogs',
                error: error.message
            });
        }
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
    })
};

module.exports = adoptionController;
