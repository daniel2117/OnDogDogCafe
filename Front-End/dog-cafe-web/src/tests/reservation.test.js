import axios from 'axios';
import { reservationApi } from '../services/api';

const testReservationFlow = async () => {
    try {
        console.log('Starting Reservation API Tests...\n');

        // 1. Test Get Availability
        console.log('1. Testing Get Availability...');
        const date = new Date();
        date.setDate(date.getDate() + 1); // Tomorrow
        const availabilityResponse = await reservationApi.getAvailability(date);
        console.log('Available slots:', availabilityResponse);

        // 2. Test Email Verification
        console.log('\n2. Testing Email Verification...');
        const testEmail = 'test@example.com';
        const verifyEmailResponse = await reservationApi.verifyEmail(testEmail);
        console.log('Verification response:', verifyEmailResponse);

        // 3. Test Verification Code
        console.log('\n3. Testing Verification Code...');
        const verifyCodeResponse = await reservationApi.verifyCode(testEmail, '123456');
        console.log('Code verification response:', verifyCodeResponse);

        // 4. Test Create Reservation
        console.log('\n4. Testing Create Reservation...');
        const reservationData = {
            name: 'Test User',
            email: testEmail,
            phone: '1234567890',
            petName: 'Max',
            petType: 'Dog',
            location: 'Test Location',
            message: 'Test reservation',
            date: date.toISOString().split('T')[0],
            timeSlot: '14:00',
            selectedServices: ['Cafe Visit']
        };
        const createResponse = await reservationApi.createReservation(reservationData);
        console.log('Reservation created:', createResponse);

        // 5. Test Get Reservations History
        console.log('\n5. Testing Get Reservations History...');
        const historyResponse = await reservationApi.getUserReservations(testEmail, '1234567890');
        console.log('Reservation history:', historyResponse);

        console.log('\nAll tests completed successfully!');
    } catch (error) {
        console.error('Test failed:', error.message);
    }
};

export default testReservationFlow;