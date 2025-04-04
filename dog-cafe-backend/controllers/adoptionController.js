const DogAdoptionListing = require("../models/DogAdoptionListing");
const asyncHandler = require("express-async-handler");

// Get list of available dogs
const getAvailableDogs = asyncHandler(async (req, res) => {
    try {
        const dogs = await DogAdoptionListing.find({ status: 'Available' })
            .select({
                _id: 1,
                dogName: 1,
                gender: 1,
                breed: 1,
                age: 1,
                size: 1,
                shortDescription: 1,
                profilePhoto: 1,
                interestCount: 1
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: dogs.length,
            data: dogs
        });
    } catch (error) {
        console.error("Get Available Dogs Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching available dogs",
            error: error.message
        });
    }
});

// Get detailed dog information
const getDogDetails = asyncHandler(async (req, res) => {
    try {
        const dogId = req.params.id;

        const dog = await DogAdoptionListing.findById(dogId);
        
        if (!dog) {
            return res.status(404).json({
                success: false,
                message: "Dog not found"
            });
        }

        // Get similar pets
        const similarPets = await DogAdoptionListing.find({
            _id: { $ne: dogId },
            status: 'Available',
            $or: [
                { breed: dog.breed },
                { age: { $gte: dog.age - 1, $lte: dog.age + 1 } }
            ]
        })
        .select('dogName breed')
        .limit(4);

        // Format vaccination info
        const formattedVaccination = dog.vaccination.map(v => ({
            age: v.age,
            vaccinated: v.vaccinated,
            match: v.match
        })).slice(0, 3);

        const response = {
            _id: dog._id,
            dogName: dog.dogName,
            photos: dog.photos.slice(0, 5),
            story: dog.story,
            characteristics: dog.characteristics,
            gender: dog.gender,
            breed: dog.breed,
            age: dog.age,
            color: dog.color,
            weight: dog.weight,
            height: dog.height,
            vaccination: formattedVaccination,
            similarPets,
            interestCount: dog.interestCount
        };

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error("Get Dog Details Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching dog details",
            error: error.message
        });
    }
});

// Get filtered dogs
const getFilteredDogs = asyncHandler(async (req, res) => {
    try {
        const { breed, color, gender, age, size } = req.headers;
        
        const filter = { status: 'Available' };

        // Apply filters if provided
        if (breed) filter.breed = breed;
        if (color) filter.color = color;
        if (gender) filter.gender = gender;
        if (size) filter.size = size;
        if (age) {
            const [minAge, maxAge] = age.split('-').map(Number);
            if (!isNaN(minAge) && !isNaN(maxAge)) {
                filter.age = { $gte: minAge, $lte: maxAge };
            }
        }

        const dogs = await DogAdoptionListing.find(filter)
            .select({
                _id: 1,
                dogName: 1,
                gender: 1,
                breed: 1,
                age: 1,
                size: 1,
                shortDescription: 1,
                profilePhoto: 1,
                interestCount: 1
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: dogs.length,
            data: dogs
        });
    } catch (error) {
        console.error("Get Filtered Dogs Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching filtered dogs",
            error: error.message
        });
    }
});

module.exports = {
    getAvailableDogs,
    getDogDetails,
    getFilteredDogs
};