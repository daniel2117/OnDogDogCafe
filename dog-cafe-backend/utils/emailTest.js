const axios = require('axios');
const emailService = require('./emailService');

const API_URL = 'http://localhost:10000/api';

const testAdoptionSubmission = async () => {
    console.log('\nTesting Adoption Application Submission...');
    try {
        const payload = {
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            address: {
                line1: '123 Test St',
                line2: 'Apt 4',
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
            experience: 'Had dogs before'
        };

        const response = await axios.post(`${API_URL}/adoption/apply`, payload);
        console.log('Adoption submission response:', response.data);
    } catch (error) {
        console.error('Adoption submission failed:', error.response?.data || error.message);
    }
};

const testReservationSubmission = async () => {
    console.log('\nTesting Reservation Submission...');
    try {
        // First verify email
        const verifyResponse = await axios.post(`${API_URL}/reservation/verify-email`, {}, {
            headers: { email: 'test@example.com' }
        });
        console.log('Email verification sent:', verifyResponse.data);

        // For testing, we'll use a mock verification code
        const verifyCodeResponse = await axios.post(`${API_URL}/reservation/verify-code`, {
            email: 'test@example.com',
            code: '123456'
        });
        console.log('Code verification response:', verifyCodeResponse.data);

        // Submit reservation
        const payload = {
            customerInfo: {
                name: 'Test User',
                email: 'test@example.com',
                phone: '+1234567890',
                petName: 'Max',
                petType: 'Dog',
                message: 'Test reservation'
            },
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            timeSlot: '14:00',
            selectedServices: ['Cafe Visit', 'Dog Cake']
        };

        const response = await axios.post(`${API_URL}/reservation/create`, payload);
        console.log('Reservation submission response:', response.data);
    } catch (error) {
        console.error('Reservation submission failed:', error.response?.data || error.message);
    }
};

const runTests = async () => {
    console.log('Starting API Tests...\n');

    // Test email service first
    console.log('Testing Email Service...');
    const emailResult = await emailService.sendVerificationEmail('test@example.com', '123456');
    console.log('Email service test result:', emailResult);

    // Test API endpoints
    await testAdoptionSubmission();
    await testReservationSubmission();
};

// Run the tests
runTests();