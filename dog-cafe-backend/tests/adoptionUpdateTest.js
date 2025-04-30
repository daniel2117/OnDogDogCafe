const axios = require('axios');

const API_URL = 'http://localhost:10000/api';
const APPLICATION_ID = '68111d0663ce6257f17c57c1';

const compareObjects = (obj1, obj2) => {
    const differences = {};
    for (const key in obj1) {
        if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
            differences[key] = {
                from: obj2[key],
                to: obj1[key]
            };
        }
    }
    return differences;
};

const testUpdateAdoptionApplication = async () => {
    try {
        console.log('Testing Adoption Application Update...\n');

        // First, get the existing application
        const existingApplication = await axios.get(
            `${API_URL}/adoption/application/${APPLICATION_ID}`,
            {
                validateStatus: false
            }
        );

        if (existingApplication.status !== 200) {
            console.error('\nFailed to fetch existing application!');
            console.error('Status:', existingApplication.status);
            console.error('Error:', JSON.stringify(existingApplication.data, null, 2));
            return;
        }

        const updateData = {
            email: "doya02171@gmail.com",
            firstName: "Sangchul",
            lastName: "ParkNew02",
            phone: "23456789",
            address: {
                line1: "19",
                line2: "sassoon rd",
                town: "hk"
            },
            garden: "no",
            homeSituation: "apartment",
            householdSetting: "family",
            activityLevel: "high",
            incomeLevel: "medium",
            homeImages: [
                "/api/files/6811dc4b569809297ea073b9",
                "/api/files/6811dc4b569809297ea073ba"
            ],
            adults: "3",
            children: "1",
            youngestAge: "2",
            hasVisitingChildren: "yes",
            visitingAge: "toddler",
            hasFlatmates: "no",
            allergies: "child",
            hasOtherAnimals: "yes",
            otherAnimalDetails: "cat / 2 / male",
            neutered: "yes",
            vaccinated: "n/a",
            experience: "Happy"
        };

        // Compare existing data with update data
        const differences = compareObjects(updateData, existingApplication.data.application);
        
        if (Object.keys(differences).length === 0) {
            console.log('\nNo changes detected - skipping update');
            return;
        }

        console.log('\nDetected changes:', JSON.stringify(differences, null, 2));
        console.log('\nProceeding with update...');

        const response = await axios.put(
            `${API_URL}/adoption/application/${APPLICATION_ID}`,
            updateData,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                validateStatus: false
            }
        );

        if (response.status === 200) {
            console.log('\nSuccess!');
            console.log('Status:', response.status);
            console.log('Response:', JSON.stringify(response.data, null, 2));

            // Verify email notification
            if (response.data.emailSent) {
                console.log('\nEmail notification sent successfully ✓');
                console.log('Recipient:', updateData.email);
                console.log('Type: Adoption Application Update');
            } else {
                console.warn('\nWarning: Email notification may not have been sent');
                console.log('Please check server logs for email service details');
            }
        } else {
            console.error('\nRequest failed!');
            console.error('Status:', response.status);
            console.error('Error:', JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        console.error('\nTest failed with the following error:');
        if (error.code === 'ECONNREFUSED') {
            console.error('Could not connect to the server. Make sure your backend server is running.');
            console.error('Expected server to be running at:', API_URL);
        } else if (error.response) {
            console.error('Server responded with error:');
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

// Run the test
testUpdateAdoptionApplication();
