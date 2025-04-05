const axios = require('axios');
const config = require('./config/config');

const API_URL = 'http://localhost:10000/api';

const testConnection = async () => {
    const results = {
        success: [],
        failed: []
    };

    try {
        console.log('\n=== Starting API Tests ===\n');

        // Test health check endpoint
        await testHealthCheck(results);
        
        // Test reservation system
        await testReservationSystem(results);

        // Test adoption system
        await testAdoptionSystem(results);

        console.log('\n=== Test Results Summary ===');
        console.log('\nSuccessful Tests:');
        results.success.forEach(test => console.log(`✅ ${test}`));
        
        console.log('\nFailed Tests:');
        if (results.failed.length === 0) {
            console.log('None - All tests passed!');
        } else {
            results.failed.forEach(test => console.log(`❌ ${test}`));
        }

    } catch (error) {
        console.error('\n=== Test Failed ===');
        console.error('Error:', error.response?.data || error.message);
    }
};

const testHealthCheck = async (results) => {
    try {
        console.log('Testing Health Check...');
        const response = await axios.get(`${API_URL}/health`);
        console.log('Health Check Status:', response.data.status);
        results.success.push('Health Check');
    } catch (error) {
        results.failed.push('Health Check');
        throw error;
    }
};

const testReservationSystem = async (results) => {
    console.log('\nTesting Reservation System...');

    try {
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

        // 1. Test GET available time slots
        console.log('\n1. Testing Get Available Time Slots...');
        const availabilityResponse = await axios.get(
            `${API_URL}/reservations/availability`,
            {
                headers: { date: tomorrow }
            }
        );
        console.log('Available slots:', JSON.stringify(availabilityResponse.data, null, 2));
        results.success.push('Get Available Time Slots');

        // 2. Test contact verification with email
        console.log('\n2. Testing Contact Verification (Email)...');
        const verifyEmailResponse = await axios.post(
            `${API_URL}/reservations/verify-contact`,
            {},
            {
                headers: { email: 'test@example.com' }
            }
        );
        console.log('Email verification response:', verifyEmailResponse.data);
        results.success.push('Contact Verification (Email)');

        // 3. Test contact verification with phone
        console.log('\n3. Testing Contact Verification (Phone)...');
        const verifyPhoneResponse = await axios.post(
            `${API_URL}/reservations/verify-contact`,
            {},
            {
                headers: { phone: '1234567890' }
            }
        );
        console.log('Phone verification response:', verifyPhoneResponse.data);
        results.success.push('Contact Verification (Phone)');

        // 4. Test CREATE reservation with multiple services
        console.log('\n4. Testing Create Reservation (Multiple Services)...');
        const createReservationResponse = await axios.post(
            `${API_URL}/reservations/create`,
            {
                customerInfo: {
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: '1234567890',
                    petName: 'Max',
                    petType: 'Dog',
                    location: 'City',
                    message: 'Test booking'
                },
                date: tomorrow,
                timeSlot: '14:00',
                selectedServices: ['Cafe Visit', 'Dog Cake']
            }
        );
        console.log('Reservation created:', JSON.stringify(createReservationResponse.data, null, 2));
        results.success.push('Create Reservation');

        // 5. Test GET reservation history
        console.log('\n5. Testing Get Reservation History...');
        const historyResponse = await axios.get(
            `${API_URL}/reservations/history`,
            {
                params: {
                    email: 'test@example.com'
                }
            }
        );
        console.log('Reservation history:', JSON.stringify(historyResponse.data, null, 2));
        results.success.push('Get Reservation History');

        // 6. Test reservation cancellation
        const reservationId = createReservationResponse.data.reservation._id;
        console.log('\n6. Testing Reservation Cancellation...');
        const cancelResponse = await axios.post(
            `${API_URL}/reservations/${reservationId}/cancel`,
            {
                email: 'test@example.com',
                phone: '1234567890'
            }
        );
        console.log('Cancellation response:', cancelResponse.data);
        results.success.push('Cancel Reservation');

    } catch (error) {
        results.failed.push('Reservation System Tests');
        throw error;
    }
};

const testAdoptionSystem = async (results) => {
    console.log('\nTesting Adoption System...');

    try {
        // 1. Test GET available dogs for adoption
        console.log('\n1. Testing Get Available Dogs...');
        const dogsResponse = await axios.get(`${API_URL}/adoption/dogs`, {
            params: {
                page: 1,
                limit: 10
            }
        });
        console.log('Available dogs:', JSON.stringify(dogsResponse.data, null, 2));
        results.success.push('Get Available Dogs');

        // Save first dog for further tests
        const testDogId = dogsResponse.data.dogs[0]?.id;
        if (!testDogId) {
            console.log('No dogs available for testing adoption features');
            return;
        }

        // 2. Test GET single dog details
        console.log('\n2. Testing Get Dog Details...');
        const dogDetailsResponse = await axios.get(
            `${API_URL}/adoption/dogs/${testDogId}`
        );
        console.log('Dog details:', JSON.stringify(dogDetailsResponse.data, null, 2));
        results.success.push('Get Dog Details');

        // 3. Test CREATE adoption application
        console.log('\n3. Testing Create Adoption Application...');
        const createApplicationResponse = await axios.post(
            `${API_URL}/adoption/apply`,
            {
                dogId: testDogId,
                customerInfo: {
                    name: 'Test Adopter',
                    email: 'adopter@example.com',
                    phone: '1234567890',
                    address: 'Test Address'
                },
                applicationDetails: {
                    livingArrangement: 'House with yard',
                    hasOtherPets: false,
                    experience: 'First-time dog owner',
                    reason: 'Looking for a companion',
                    income: 50000
                }
            }
        );
        console.log('Application created:', JSON.stringify(createApplicationResponse.data, null, 2));
        results.success.push('Create Adoption Application');

        // 4. Test GET similar dogs
        console.log('\n4. Testing Get Similar Dogs...');
        const similarDogsResponse = await axios.get(
            `${API_URL}/dogs/${testDogId}/similar`
        );
        console.log('Similar dogs:', JSON.stringify(similarDogsResponse.data, null, 2));
        results.success.push('Get Similar Dogs');

    } catch (error) {
        results.failed.push('Adoption System Tests');
        throw error;
    }
};

testConnection().catch(console.error);