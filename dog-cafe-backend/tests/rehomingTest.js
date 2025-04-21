const axios = require('axios');

const getAllFiles = async (API_URL) => {
    try {
        // Add type parameter to specify what kind of files to fetch
        const response = await axios.get(`${API_URL}/rehoming/uploads?type=photos`);
        console.log('\nAll uploaded files:');
        console.log(JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error('Failed to fetch files:', error.message);
        return null;
    }
};

const checkFilesExist = async (API_URL, fileIds) => {
    console.log('Checking if files exist...');
    try {
        await Promise.all(fileIds.map(async (fileId) => {
            const response = await axios.head(`${API_URL}/files/${fileId}`);
            if (response.status !== 200) {
                throw new Error(`File ${fileId} does not exist`);
            }
            console.log(`File ${fileId} exists`);
        }));
        return true;
    } catch (error) {
        console.error('File validation failed:', error.message);
        console.error('Please upload the files first before submitting the application');
        return false;
    }
};

const testRehomingSubmission = async () => {
    try {
        console.log('Testing Rehoming Application Submission...\n');
        
        const API_URL = 'http://localhost:10000/api';
        
        // Show all uploaded files first
        await getAllFiles(API_URL);
        
        const fileIds = [
            "68063db2a0694c2f9966ff90",
            "68064c51a0694c2f996700fa",
            "68064c66a0694c2f99670103"
        ];

        // Verify files exist before proceeding
        const filesExist = await checkFilesExist(API_URL, fileIds);
        if (!filesExist) {
            return;
        }

        const endpoint = `${API_URL}/rehoming/submit`;
        console.log(`\nSending request to: ${endpoint}\n`);

        const payload = {
            ownerInfo: {
                email: "doya02171@gmail.com",
                firstName: "asdf",
                lastName: "afd"
            },
            petInfo: {
                name: "as",
                type: "cat",
                age: 8,
                size: "medium",
                gender: "female",
                breed: "Domestic Shorthair",
                color: "Brindle",
                isSpayedNeutered: true,
                description: "A friendly cat with calm temperament...",
                checklist: {
                    shotsUpToDate: false,
                    microchipped: false,
                    houseTrained: false,
                    goodWithDogs: false,
                    goodWithCats: false,
                    goodWithKids: false,
                    purebred: false,
                    hasSpecialNeeds: false,
                    hasBehaviouralIssues: false
                }
            },
            rehomingDetails: {
                reason: "allergy",
                timeWindow: "1 week"
            },
            media: {
                photos: [
                    `/api/files/68063db2a0694c2f9966ff90`,
                    `/api/files/68064c51a0694c2f996700fa`
                ],
                documents: [
                    {
                        type: "other",
                        url: `/api/files/68064c66a0694c2f99670103`,
                        name: "favicon.ico"
                    }
                ]
            }
        };

        const response = await axios.post(endpoint, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
            validateStatus: false // This will prevent axios from throwing on non-2xx responses
        });

        if (response.status === 201 || response.status === 200) {
            console.log('Success!');
            console.log('Status:', response.status);
            console.log('Response:', JSON.stringify(response.data, null, 2));
        } else {
            console.error('Request failed!');
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

testRehomingSubmission();
