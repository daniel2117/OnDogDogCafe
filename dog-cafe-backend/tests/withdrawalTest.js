const axios = require('axios');

const API_URL = 'http://localhost:10000/api';

const testWithdrawals = async () => {
    try {
        console.log('Testing Application Withdrawals...\n');

        // Test 1: Withdraw adoption application
        console.log('Test 1: Withdrawing adoption application');
        const adoptionId = '680fae344a903eb7fc479080';
        try {
            const adoptionResponse = await axios.post(
                `${API_URL}/adoption/application/${adoptionId}/withdraw`,
                {},
                {
                    headers: { 'Content-Type': 'application/json' },
                    validateStatus: false
                }
            );
            console.log('Adoption withdrawal response:', {
                status: adoptionResponse.status,
                data: adoptionResponse.data
            });
        } catch (error) {
            console.error('Adoption withdrawal failed:', error.response?.data || error.message);
        }

        // Test 2: Withdraw rehoming application
        console.log('\nTest 2: Withdrawing rehoming application');
        const rehomingId = '680668909226716a67a2eaa6';
        try {
            const rehomingResponse = await axios.post(
                `${API_URL}/rehoming/application/${rehomingId}/withdraw`,
                {},
                {
                    headers: { 'Content-Type': 'application/json' },
                    validateStatus: false
                }
            );
            console.log('Rehoming withdrawal response:', {
                status: rehomingResponse.status,
                data: rehomingResponse.data
            });
        } catch (error) {
            console.error('Rehoming withdrawal failed:', error.response?.data || error.message);
        }

        // Test 3: Try withdrawing invalid application ID
        console.log('\nTest 3: Testing invalid application ID');
        try {
            const invalidResponse = await axios.post(
                `${API_URL}/adoption/application/invalid-id/withdraw`,
                {},
                {
                    headers: { 'Content-Type': 'application/json' },
                    validateStatus: false
                }
            );
            console.log('Invalid ID response:', {
                status: invalidResponse.status,
                data: invalidResponse.data
            });
        } catch (error) {
            console.error('Invalid ID test failed:', error.response?.data || error.message);
        }

    } catch (error) {
        console.error('\nTest suite failed:', error.message);
    }
};

// Run the tests
testWithdrawals();
