const mongoose = require('mongoose');
const Dog = require('../models/Dog');
const config = require('../config/config');

// Enhanced sample data for more realistic dog generation
const dogData = {
    breeds: [
        'Shiba Inu', 'Golden Retriever', 'Labrador', 'Poodle', 'Corgi', 
        'Husky', 'Pomeranian', 'Bulldog', 'Chihuahua', 'German Shepherd'
    ],
    sizes: ['small', 'medium', 'large'],
    genders: ['male', 'female'],
    personalities: [
        'Friendly', 'Playful', 'Calm', 'Active', 'Gentle', 
        'Smart', 'Loyal', 'Energetic', 'Affectionate', 'Independent'
    ],
    requirements: [
        'Good with kids', 'Needs yard', 'Indoor only', 'Regular exercise',
        'Training required', 'No small children', 'Experienced owner preferred',
        'Regular grooming needed', 'Special diet required'
    ],
    colors: [
        'Brown', 'Black', 'White', 'Golden', 'Cream',
        'Grey', 'Spotted', 'Brindle', 'Tan', 'Multi-colored'
    ],
    healthRecordTypes: [
        'Vaccination', 'General Checkup', 'Deworming',
        'Dental Cleaning', 'Special Treatment'
    ],
    imageUrls: [
        '/images/dog1.jpg', '/images/dog2.jpg', '/images/dog3.jpg',
        '/images/dog4.jpg', '/images/dog5.jpg'
    ]
};

const generateDog = (index) => {
    const breed = dogData.breeds[Math.floor(Math.random() * dogData.breeds.length)];
    const gender = dogData.genders[Math.floor(Math.random() * dogData.genders.length)];
    const size = dogData.sizes[Math.floor(Math.random() * dogData.sizes.length)];
    // Changed age calculation to stay within 3-30 months range
    const age = Math.floor(Math.random() * 28) + 3; // 3 to 30 months
    const color = dogData.colors[Math.floor(Math.random() * dogData.colors.length)];
    const weight = (size === 'small' ? 5 + Math.random() * 10 :
                   size === 'medium' ? 15 + Math.random() * 15 :
                   25 + Math.random() * 25).toFixed(1);
    const height = (size === 'small' ? 20 + Math.random() * 15 :
                   size === 'medium' ? 35 + Math.random() * 20 :
                   55 + Math.random() * 25).toFixed(1);

    return {
        name: `${breed.split(' ')[0]}${index + 1}`,
        breed,
        age,
        size,
        gender,
        description: `A lovely ${age}-month-old ${color.toLowerCase()} ${breed} looking for a forever home. ${gender === 'male' ? 'He' : 'She'} is ${dogData.personalities[Math.floor(Math.random() * dogData.personalities.length)].toLowerCase()} and ${dogData.personalities[Math.floor(Math.random() * dogData.personalities.length)].toLowerCase()}.`,
        personality: Array.from(new Set([...Array(3)].map(() => 
            dogData.personalities[Math.floor(Math.random() * dogData.personalities.length)]))),
        requirements: Array.from(new Set([...Array(2)].map(() => 
            dogData.requirements[Math.floor(Math.random() * dogData.requirements.length)]))),
        vaccinated: Math.random() > 0.1,
        neutered: Math.random() > 0.2,
        status: 'available',
        imageUrl: dogData.imageUrls[index % dogData.imageUrls.length],
        images: [...Array(2)].map(() => dogData.imageUrls[Math.floor(Math.random() * dogData.imageUrls.length)]),
        checklist: {
            canLiveWithChildren: Math.random() > 0.3,
            isVaccinated: Math.random() > 0.1,
            isHouseTrained: Math.random() > 0.2,
            isNeutered: Math.random() > 0.2,
            hasUpToDateShots: Math.random() > 0.1,
            isMicrochipped: Math.random() > 0.4
        },
        color,
        weight: `${weight}`,
        height: `${height}`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
        healthRecords: [...Array(2)].map(() => ({
            type: dogData.healthRecordTypes[Math.floor(Math.random() * dogData.healthRecordTypes.length)],
            description: 'Regular checkup and preventive care',
            date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        })),
        vaccinations: [
            { age: '8 weeks', vaccinated: 'DHPP', match: 'Complete' },
            { age: '12 weeks', vaccinated: 'Rabies', match: 'Complete' },
            { age: '16 weeks', vaccinated: 'DHPP Booster', match: 'Due' }
        ],
        translations: {
            zh: {
                name: `狗狗${index + 1}`,
                description: `一隻${age}個月大的可愛${breed}正在尋找一個永遠的家。非常${dogData.personalities[0].toLowerCase()}和友善。`
            }
        }
    };
};

const seedDatabase = async () => {
    let connection;
    try {
        // Connect to MongoDB
        connection = await mongoose.connect(config.database.url, config.database.options);
        console.log('Connected to MongoDB successfully');

        // Clear existing dogs
        console.log('Clearing existing dogs collection...');
        const deleteResult = await Dog.deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing dog records`);

        // Generate new dog data
        console.log('Generating new dog data...');
        const dogsData = Array.from({ length: 30 }, (_, i) => generateDog(i));
        
        // Insert new dogs
        console.log('Inserting new dog records...');
        const insertResult = await Dog.insertMany(dogsData);
        console.log(`Successfully inserted ${insertResult.length} new dog records`);

        // Verify the seeding
        const count = await Dog.countDocuments();
        console.log(`Verification: Current dog count in database: ${count}`);

        // Optional: Print some sample data
        const sampleDog = await Dog.findOne();
        console.log('\nSample dog record:');
        console.log(JSON.stringify(sampleDog, null, 2));

    } catch (error) {
        console.error('Error during database seeding:', error);
        process.exit(1);
    } finally {
        // Close database connection
        if (connection) {
            await mongoose.disconnect();
            console.log('Database connection closed');
        }
    }
};

// Add command line argument support
const args = process.argv.slice(2);
const numberOfDogs = args[0] ? parseInt(args[0]) : 30;

// Run the seeding with better error handling
console.log(`Starting database seeding process (${numberOfDogs} dogs)...`);
seedDatabase()
    .then(() => {
        console.log('Seeding completed successfully');
        process.exit(0);
    })
    .catch(error => {
        console.error('Fatal error during seeding:', error);
        process.exit(1);
    });
