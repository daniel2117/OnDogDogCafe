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
                line1: '123 Test Street',      // Keep as clean string without comments
                line2: 'Apt 4B',
                town: 'Test Town',
                country: 'Taiwan'
            },
            phone: '+886912345678',
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
            homeImages: homeImages,
            experience: 'Had dogs before'  // Added missing field
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
            return response.data; // Return response data for further use
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

const testUpdateApplication = async (applicationId) => {
    try {
        console.log('\nTesting Adoption Application Updates...\n');

        // Test 1: Valid update
        const validUpdate = {
            phone: '+886987654321',
            garden: 'no',
            homeSituation: 'apartment'
        };

        console.log('Test 1: Testing valid update with data:', JSON.stringify(validUpdate, null, 2));
        let response = await axios.put(
            `${API_URL}/adoption/application/${applicationId}`,
            validUpdate,
            {
                headers: { 'Content-Type': 'application/json' },
                validateStatus: false
            }
        );
        console.log('Valid Update Response:', {
            status: response.status,
            data: response.data
        });

        // Test 2: Invalid phone number
        const invalidPhoneUpdate = {
            phone: '123', // Invalid phone number
            garden: 'yes'
        };

        console.log('\nTest 2: Testing invalid phone update with data:', JSON.stringify(invalidPhoneUpdate, null, 2));
        response = await axios.put(
            `${API_URL}/adoption/application/${applicationId}`,
            invalidPhoneUpdate,
            {
                headers: { 'Content-Type': 'application/json' },
                validateStatus: false
            }
        );
        console.log('Invalid Phone Update Response:', {
            status: response.status,
            data: response.data
        });

        // Test 3: Invalid enum value
        const invalidEnumUpdate = {
            garden: 'maybe', // Invalid enum value (should be 'yes' or 'no')
            homeSituation: 'mansion' // Invalid enum value
        };

        console.log('\nTest 3: Testing invalid enum update with data:', JSON.stringify(invalidEnumUpdate, null, 2));
        response = await axios.put(
            `${API_URL}/adoption/application/${applicationId}`,
            invalidEnumUpdate,
            {
                headers: { 'Content-Type': 'application/json' },
                validateStatus: false
            }
        );
        console.log('Invalid Enum Update Response:', {
            status: response.status,
            data: response.data
        });

        // Test 4: Invalid application ID
        console.log('\nTest 4: Testing update with invalid application ID');
        response = await axios.put(
            `${API_URL}/adoption/application/invalid-id`,
            validUpdate,
            {
                headers: { 'Content-Type': 'application/json' },
                validateStatus: false
            }
        );
        console.log('Invalid ID Update Response:', {
            status: response.status,
            data: response.data
        });

    } catch (error) {
        console.error('\nUpdate tests failed with the following error:');
        if (error.response) {
            console.error('Server responded with error:');
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

const testGetApplicationById = async (applicationId) => {
    try {
        console.log('\nTesting Get Application Details...\n');

        // Test 1: Valid application ID
        console.log('Test 1: Testing with valid application ID:', applicationId);
        let response = await axios.get(
            `${API_URL}/adoption/application/${applicationId}`,
            {
                headers: { 'Content-Type': 'application/json' },
                validateStatus: false
            }
        );
        console.log('Valid ID Response:', {
            status: response.status,
            success: response.data.success,
            hasApplication: !!response.data.application
        });

        // Test 2: Invalid application ID format
        console.log('\nTest 2: Testing with invalid application ID format');
        response = await axios.get(
            `${API_URL}/adoption/application/invalid-id`,
            {
                headers: { 'Content-Type': 'application/json' },
                validateStatus: false
            }
        );
        console.log('Invalid ID Response:', {
            status: response.status,
            data: response.data
        });

        // Test 3: Non-existent but valid format ID
        console.log('\nTest 3: Testing with non-existent application ID');
        response = await axios.get(
            `${API_URL}/adoption/application/507f1f77bcf86cd799439011`,
            {
                headers: { 'Content-Type': 'application/json' },
                validateStatus: false
            }
        );
        console.log('Non-existent ID Response:', {
            status: response.status,
            data: response.data
        });

    } catch (error) {
        console.error('\nGet application test failed with error:');
        if (error.response) {
            console.error('Server responded with error:');
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

const runAllTests = async () => {
    try {
        console.log('Starting Adoption Application Tests...\n');
        
        // Run the original application submission test
        const submissionResponse = await testAdoptionApplication();
        
        if (submissionResponse?.applicationId) {
            console.log('\nSubmission successful, proceeding with other tests...');
            
            // Run get application test
            await testGetApplicationById(submissionResponse.applicationId);
            
            // Run update application test
            await testUpdateApplication(submissionResponse.applicationId);
        } else {
            console.error('Submission failed, skipping subsequent tests');
        }
        
        console.log('\nAll tests completed.');
    } catch (error) {
        console.error('Test suite failed:', error.message);
    }
};

// Run the test suite
runAllTests();
