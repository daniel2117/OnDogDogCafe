const axios = require('axios');
const config = require('./config/config');

const API_URL = 'http://localhost:10000/api';

const testConnection = async () => {
    try {
        console.log('\n=== Starting API Tests ===\n');

        // Test health check endpoint
        await testHealthCheck();
        
        // Test reservation endpoints
        await testReservationEndpoints();

        console.log('\n=== All Tests Completed Successfully ===\n');
    } catch (error) {
        console.error('\n=== Test Failed ===');
        console.error('Error:', error.response?.data || error.message);
    }
};

const testHealthCheck = async () => {
    console.log('Testing Health Check...');
    const response = await axios.get(`${API_URL}/health`);
    console.log('Health Check Status:', response.data.status);
};

const testReservationEndpoints = async () => {
    console.log('\nTesting Reservation Endpoints...');

    try {
        // Test GET available time slots
        console.log('\nTesting Get Available Time Slots...');
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const availabilityResponse = await axios.get(
            `${API_URL}/reservations/availability`,
            {
                headers: { date: tomorrow }
            }
        );
        console.log('Available slots:', JSON.stringify(availabilityResponse.data, null, 2));

        // Test contact verification with email
        console.log('\nTesting Contact Verification (Email)...');
        const verifyEmailResponse = await axios.post(
            `${API_URL}/reservations/verify-contact`,
            {},
            {
                headers: { email: 'test@example.com' }
            }
        );
        console.log('Email verification response:', verifyEmailResponse.data);

        // Test contact verification with phone
        console.log('\nTesting Contact Verification (Phone)...');
        const verifyPhoneResponse = await axios.post(
            `${API_URL}/reservations/verify-contact`,
            {},
            {
                headers: { phone: '1234567890' }
            }
        );
        console.log('Phone verification response:', verifyPhoneResponse.data);

        // Test CREATE reservation
        console.log('\nTesting Create Reservation...');
        const createReservationResponse = await axios.post(
            `${API_URL}/reservations/create`,
            {
                email: 'test@example.com',
                phone: '1234567890',
                date: tomorrow,
                timeSlot: '14:00',
                service: 'Cafe Visit'
            }
        );
        console.log('Reservation created:', JSON.stringify(createReservationResponse.data, null, 2));

    } catch (error) {
        console.error('Reservation endpoints test failed:', error.response?.data || error.message);
        throw error;
    }
};

testConnection().catch(console.error);