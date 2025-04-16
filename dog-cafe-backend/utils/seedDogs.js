const mongoose = require('mongoose');
const Dog = require('../models/Dog');
const config = require('../config/config');

// Sample data generator
const dogBreeds = ['Shiba Inu', 'Golden Retriever', 'Poodle', 'Corgi', 'Husky', 'Pomeranian', 'Bulldog', 'Labrador'];
const sizes = ['small', 'medium', 'large'];
const genders = ['male', 'female'];
const personalities = ['Friendly', 'Playful', 'Calm', 'Active', 'Gentle', 'Smart', 'Loyal', 'Energetic'];
const requirements = ['Good with kids', 'Needs yard', 'Indoor only', 'Regular exercise', 'Training required'];

const generateDog = (index) => ({
    name: `Dog${index + 1}`,
    breed: dogBreeds[Math.floor(Math.random() * dogBreeds.length)],
    age: Math.floor(Math.random() * 10) + 1,
    size: sizes[Math.floor(Math.random() * sizes.length)],
    gender: genders[Math.floor(Math.random() * genders.length)],
    description: `A lovely ${index + 1} year old dog looking for a forever home.`,
    personality: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
        personalities[Math.floor(Math.random() * personalities.length)]
    ),
    requirements: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
        requirements[Math.floor(Math.random() * requirements.length)]
    ),
    vaccinated: Math.random() > 0.2,
    neutered: Math.random() > 0.3,
    status: 'available',
    imageUrl: `/images/dog${(index % 5) + 1}.jpg`,
    createdAt: new Date(),
    healthRecords: [{
        type: 'Vaccination',
        description: 'Regular checkup and vaccines',
        date: new Date()
    }],
    translations: {
        zh: {
            name: `狗狗${index + 1}`,
            description: `一隻${index + 1}歲的可愛狗狗正在尋找一個永遠的家。`
        }
    }
});

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.database.url, config.database.options);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Dog.deleteMany({});
        console.log('Cleared existing dogs data');

        // Generate 50 dogs
        const dogsData = Array.from({ length: 30 }, (_, i) => generateDog(i));

        // Insert new data
        await Dog.insertMany(dogsData);
        console.log('Successfully seeded 30 dogs');

        // Disconnect
        await mongoose.disconnect();
        console.log('Database connection closed');

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeding
seedDatabase();