const axios = require('axios');

const testRehomingSubmission = async () => {
    try {
        console.log('Testing Rehoming Application Submission...\n');

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
                    "/api/files/68064c51a0694c2f996700f9",
                    "/api/files/68064c51a0694c2f996700fa"
                ],
                documents: [
                    {
                        type: "other",
                        url: "/api/files/68064c66a0694c2f99670103",
                        name: "favicon.ico"
                    }
                ]
            }
        };

        const response = await axios.post('http://localhost:3000/api/rehoming/submit', payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('Test failed:', error.response ? {
            status: error.response.status,
            data: error.response.data
        } : error.message);
    }
};

testRehomingSubmission();
