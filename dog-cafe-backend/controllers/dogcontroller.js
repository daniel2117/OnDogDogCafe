const asyncHandler = require('express-async-handler');
const Dog = require('../models/Dog');
const cache = require('../utils/cache');

const dogController = {
    getAllDogs: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Create a clean query object by removing undefined/null values
        const cleanQuery = Object.entries(req.query)
            .filter(([_, value]) => value != null && value !== '')
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
            
        const cacheKey = `dogs:${page}:${limit}:${JSON.stringify(cleanQuery)}`;

        // Try to get from cache
        const cached = await cache.get(cacheKey);
        if (cached) {
            return res.json(cached);
        }

        const filter = {};

        // Enhanced filtering options with type checking
        if (cleanQuery.breed) filter.breed = new RegExp(cleanQuery.breed, 'i');
        if (cleanQuery.gender) filter.gender = new RegExp(cleanQuery.gender, 'i');
        if (cleanQuery.size) filter.size = new RegExp(cleanQuery.size, 'i');
        if (cleanQuery.color) filter.color = new RegExp(cleanQuery.color, 'i');
        
        // Age range filter with number validation
        if (cleanQuery.minAge || cleanQuery.maxAge) {
            filter.age = {};
            if (cleanQuery.minAge && !isNaN(cleanQuery.minAge)) {
                filter.age.$gte = parseInt(cleanQuery.minAge);
            }
            if (cleanQuery.maxAge && !isNaN(cleanQuery.maxAge)) {
                filter.age.$lte = parseInt(cleanQuery.maxAge);
            }
        }

        // Single age filter
        if (cleanQuery.age && !isNaN(cleanQuery.age)) {
            filter.age = parseInt(cleanQuery.age);
        }

        const [dogs, total] = await Promise.all([
            Dog.find(filter)
                .select('name breed age size gender imageUrl status petId') // Select only needed fields
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Dog.countDocuments(filter)
        ]);

        const result = {
            dogs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        };

        // Cache for 5 minutes
        await cache.set(cacheKey, result, 300);

        res.json(result);
    }),

    getDogById: asyncHandler(async (req, res) => {
        const cacheKey = `dog:${req.params.id}`;
        
        // Try to get from cache
        const cached = await cache.get(cacheKey);
        if (cached) {
            return res.json(cached);
        }

        const dog = await Dog.findById(req.params.id);
        if (!dog) {
            res.status(404);
            throw new Error('Dog not found');
        }

        // Format response according to design requirements
        const response = {
            name: dog.name,
            petId: dog.petId || `PET${dog._id.toString().slice(-6)}`,
            profile: dog.imageUrl, // Use main image as profile
            images: dog.images || [dog.imageUrl], // Fallback to main image if no additional images
            story: dog.story || dog.description,
            health: dog.health || [
                "General Health Check",
                "Vaccinations Up-to-date",
                "Deworming Treatment"
            ],
            checklist: {
                canLiveWithChildren: dog.checklist?.canLiveWithChildren || false,
                isVaccinated: dog.vaccinated || false,
                isHouseTrained: dog.checklist?.isHouseTrained || false,
                isNeutered: dog.neutered || false,
                hasUpToDateShots: dog.checklist?.hasUpToDateShots || false,
                isMicrochipped: dog.checklist?.isMicrochipped || false
            },
            stats: {
                gender: dog.gender,
                breed: dog.breed,
                age: `${dog.age} months`,
                color: dog.color || 'Not specified',
                weight: dog.weight ? `${dog.weight} kg` : 'Not specified',
                height: dog.height ? `${dog.height} cm` : 'Not specified'
            },
            vaccinations: dog.vaccinations || [
                { age: '8th Week', vaccinated: 'Bordetella', match: 'Leptospirosis' },
                { age: '14th Week', vaccinated: 'Bordetella, Canine Anfluanza', match: 'Leptospirosis' },
                { age: '22th Week', vaccinated: 'Bordetella, Canine Anfluanza', match: 'Leptospirosis' }
            ]
        };

        await cache.set(cacheKey, response, 300);
        res.json(response);
    }),

    createDog: asyncHandler(async (req, res) => {
        const dog = await Dog.create(req.body);
        res.status(201).json(dog);
    }),

    updateDog: asyncHandler(async (req, res) => {
        const dog = await Dog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!dog) {
            res.status(404);
            throw new Error('Dog not found');
        }
        res.json(dog);
    }),

    deleteDog: asyncHandler(async (req, res) => {
        const dog = await Dog.findByIdAndDelete(req.params.id);
        if (!dog) {
            res.status(404);
            throw new Error('Dog not found');
        }
        res.json({ message: 'Dog removed' });
    }),

    uploadDogImage: asyncHandler(async (req, res) => {
        const dog = await Dog.findById(req.params.id);
        if (!dog) {
            res.status(404);
            throw new Error('Dog not found');
        }
        // Add image upload logic here
        res.json({ message: 'Image uploaded successfully' });
    }),

    getDogBreeds: asyncHandler(async (req, res) => {
        const breeds = await Dog.distinct('breed');
        res.json(breeds);
    }),

    getDogStats: asyncHandler(async (req, res) => {
        const stats = await Dog.aggregate([
            {
                $group: {
                    _id: null,
                    totalDogs: { $sum: 1 },
                    averageAge: { $avg: '$age' }
                }
            }
        ]);
        res.json(stats[0] || {});
    }),

    getSimilarDogs: asyncHandler(async (req, res) => {
        const dog = await Dog.findById(req.params.id);
        if (!dog) {
            res.status(404);
            throw new Error('Dog not found');
        }

        const similarDogs = await Dog.find({
            _id: { $ne: dog._id },
            breed: dog.breed
        }).limit(4);

        res.json(similarDogs);
    }),

    clearCache: asyncHandler(async (req, res) => {
        await cache.flush();
        res.json({ message: 'Cache cleared successfully' });
    })
};

module.exports = dogController;