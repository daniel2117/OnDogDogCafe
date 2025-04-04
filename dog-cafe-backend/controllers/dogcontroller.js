const asyncHandler = require('express-async-handler');
const Dog = require('../models/Dog');
const fs = require('fs').promises;
const path = require('path');

const dogController = {
    getAllDogs: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const filter = {};

        // Add filters if provided in query
        if (req.query.breed) filter.breed = req.query.breed;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.age) filter.age = req.query.age;
        if (req.query.size) filter.size = req.query.size;

        // Add search functionality
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { breed: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const dogs = await Dog.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-__v');

        const total = await Dog.countDocuments(filter);

        res.json({
            dogs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalDogs: total
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

    createDog: asyncHandler(async (req, res) => {
        const {
            name,
            breed,
            age,
            size,
            gender,
            description,
            personality,
            requirements,
            vaccinated,
            neutered
        } = req.body;

        // Validate required fields
        if (!name || !breed || !age || !description) {
            res.status(400);
            throw new Error('Please provide all required fields');
        }

        const dog = await Dog.create({
            name,
            breed,
            age,
            size: size || 'medium',
            gender: gender || 'unknown',
            description,
            personality: personality || [],
            requirements: requirements || [],
            vaccinated: vaccinated || false,
            neutered: neutered || false,
            status: 'available',
            createdAt: new Date(),
            imageUrl: req.body.imageUrl || null
        });

        res.status(201).json(dog);
    }),

    updateDog: asyncHandler(async (req, res) => {
        const dog = await Dog.findById(req.params.id);

        if (!dog) {
            res.status(404);
            throw new Error('Dog not found');
        }

        // Update fields
        const updatedDog = await Dog.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).select('-__v');

        res.json(updatedDog);
    }),

    deleteDog: asyncHandler(async (req, res) => {
        const dog = await Dog.findById(req.params.id);

        if (!dog) {
            res.status(404);
            throw new Error('Dog not found');
        }

        // If dog has image, delete it
        if (dog.imageUrl) {
            const imagePath = path.join(__dirname, '..', 'uploads', path.basename(dog.imageUrl));
            try {
                await fs.unlink(imagePath);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        await dog.remove();

        res.json({
            message: 'Dog removed successfully',
            id: req.params.id
        });
    }),

    uploadDogImage: asyncHandler(async (req, res) => {
        if (!req.files || !req.files.image) {
            res.status(400);
            throw new Error('No image file uploaded');
        }

        const dog = await Dog.findById(req.params.id);
        if (!dog) {
            res.status(404);
            throw new Error('Dog not found');
        }

        const file = req.files.image;
        const fileSize = file.size / 1024 / 1024; // in MB

        // Validate file size (max 5MB)
        if (fileSize > 5) {
            res.status(400);
            throw new Error('Image file too large (max 5MB)');
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            res.status(400);
            throw new Error('Invalid file type. Only JPEG, PNG and WebP allowed');
        }

        // Generate unique filename
        const fileName = `dog-${req.params.id}-${Date.now()}${path.extname(file.name)}`;
        const uploadPath = path.join(__dirname, '..', 'uploads', fileName);

        // Delete old image if exists
        if (dog.imageUrl) {
            const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(dog.imageUrl));
            try {
                await fs.unlink(oldImagePath);
            } catch (error) {
                console.error('Error deleting old image:', error);
            }
        }

        // Save new image
        await file.mv(uploadPath);

        // Update dog with new image URL
        dog.imageUrl = `/uploads/${fileName}`;
        await dog.save();

        res.json({
            message: 'Image uploaded successfully',
            imageUrl: dog.imageUrl
        });
    }),

    getDogBreeds: asyncHandler(async (req, res) => {
        const breeds = await Dog.distinct('breed');
        res.json(breeds);
    }),

    getDogStats: asyncHandler(async (req, res) => {
        const stats = await Dog.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const breedStats = await Dog.aggregate([
            {
                $group: {
                    _id: '$breed',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            statusStats: stats,
            topBreeds: breedStats
        });
    })
};

module.exports = dogController;