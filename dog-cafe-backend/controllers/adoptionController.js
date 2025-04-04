const asyncHandler = require('express-async-handler');
const Dog = require('../models/Dog');
const Adoption = require('../models/Adoption');

const adoptionController = {
    getAllDogs: asyncHandler(async (req, res) => {
        const dogs = await Dog.find({ status: 'available' });
        res.json(dogs);
    }),

    getDogById: asyncHandler(async (req, res) => {
        const dog = await Dog.findById(req.params.id);
        if (dog) {
            res.json(dog);
        } else {
            res.status(404);
            throw new Error('Dog not found');
        }
    }),

    createAdoptionApplication: asyncHandler(async (req, res) => {
        const { dogId, livingArrangement, hasOtherPets, experience, reason } = req.body;

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
                reason
            }
        });

        dog.status = 'pending';
        await dog.save();

        res.status(201).json(application);
    }),

    getMyApplications: asyncHandler(async (req, res) => {
        const applications = await Adoption.find({ user: req.user._id })
            .populate('dog')
            .sort('-createdAt');
        res.json(applications);
    })
};

module.exports = adoptionController;