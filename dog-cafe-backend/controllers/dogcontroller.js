const asyncHandler = require('express-async-handler');
const Dog = require('../models/Dog');

const dogController = {
    getAllDogs: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = {};

        // Enhanced filtering options
        if (req.query.breed) filter.breed = req.query.breed;
        if (req.query.gender) filter.gender = req.query.gender;
        if (req.query.size) filter.size = req.query.size;
        if (req.query.color) filter.color = req.query.color;
        
        // Age range filter
        if (req.query.minAge || req.query.maxAge) {
            filter.age = {};
            if (req.query.minAge) filter.age.$gte = parseInt(req.query.minAge);
            if (req.query.maxAge) filter.age.$lte = parseInt(req.query.maxAge);
        }

        const dogs = await Dog.find(filter)
            .sort({ createdAt: -1 })
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

        // Format response according to frontend requirements
        const response = {
            name: dog.name,
            petId: dog.petId,
            profile: dog.profile,
            images: dog.images || [],
            story: dog.story,
            health: dog.health || [],
            checklist: {
                canLiveWithChildren: dog.checklist?.canLiveWithChildren || false,
                isVaccinated: dog.checklist?.isVaccinated || false,
                isHouseTrained: dog.checklist?.isHouseTrained || false,
                isNeutered: dog.checklist?.isNeutered || false,
                hasUpToDateShots: dog.checklist?.hasUpToDateShots || false,
                isMicrochipped: dog.checklist?.isMicrochipped || false
            },
            stats: {
                gender: dog.stats?.gender || dog.gender,
                breed: dog.stats?.breed || dog.breed,
                age: dog.stats?.age || `${dog.age} month`,
                color: dog.stats?.color || dog.color,
                weight: dog.stats?.weight || `${dog.weight} lb`,
                height: dog.stats?.height || `${dog.height} cm`
            },
            vaccinations: dog.vaccinations || [
                { age: '8th Week', vaccinated: 'Bordetella', match: 'Leptospirosis' },
                { age: '14th Week', vaccinated: 'Bordetella, Canine Anfluanza', match: 'Leptospirosis' },
                { age: '22th Week', vaccinated: 'Bordetella, Canine Anfluanza', match: 'Leptospirosis' }
            ]
        };

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
    })
};

module.exports = dogController;