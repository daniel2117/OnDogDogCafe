const axios = require('axios');

const API_URL = 'http://localhost:10000/api';

const testAdoptionApplication = async () => {
    try {
        console.log('Testing Adoption Application Submission...\n');

        // Using existing image URLs from rehoming test
        const homeImages = [
            '/api/files/68063db2a0694c2f9966ff90',
            '/api/files/68064c51a0694c2f996700fa'
        ];

        const applicationData = {
            email: 'jeffery0797@gmail.com',
            firstName: 'Jeffrey',
            lastName: 'Cheng',
            address: {
                line1: '123 Test St',
                line2: 'Apt 4B',
                town: 'Test Town'
            },
            phone: '+1234567890',
            garden: 'yes',
            homeSituation: 'house',
            householdSetting: 'family',
            activityLevel: 'moderate',
            incomeLevel: 'medium',
            adults: '2',
            children: '1',
            youngestAge: '10',
            hasVisitingChildren: 'no',
            visitingAge: 'n/a',
            hasFlatmates: 'no',
            hasOtherAnimals: 'no',
            neutered: 'yes',
            vaccinated: 'yes',
            homeImages: homeImages
        };

        console.log('Submitting application with data:', JSON.stringify(applicationData, null, 2));

        const response = await axios.post(
            `${API_URL}/adoption/apply`,
            applicationData,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                validateStatus: false // This will prevent axios from throwing on non-2xx responses
            }
        );

        if (response.status === 201 || response.status === 200) {
            console.log('\nSuccess!');
            console.log('Status:', response.status);
            console.log('Response:', JSON.stringify(response.data, null, 2));
        } else {
            console.error('\nRequest failed!');
            console.error('Status:', response.status);
            console.error('Error:', JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        console.error('\nTest failed with the following error:');
        if (error.code === 'ECONNREFUSED') {
            console.error('Could not connect to the server. Make sure your backend server is running.');
            console.error('Expected server to be running at: http://localhost:10000');
        } else if (error.response) {
            console.error('Server responded with error:');
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

testAdoptionApplication();
