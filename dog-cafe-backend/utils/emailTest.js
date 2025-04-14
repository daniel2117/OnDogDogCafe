const emailService = require('../utils/emailService');

const testEmails = async () => {
    try {
        console.log('Testing Email Service...\n');

        // Test verification email
        console.log('1. Testing verification email...');
        const verificationResult = await emailService.sendVerificationEmail(
            'jeffreyjp02@gmail.com',
            '123456'
        );
        console.log('Verification email sent:', verificationResult);

        // Test reservation confirmation
        console.log('\n2. Testing reservation confirmation...');
        const reservationResult = await emailService.sendReservationConfirmation(
            'jeffreyjp02@gmail.com',
            {
                customerInfo: {
                    name: 'Jeffrey test'
                },
                date: new Date(),
                timeSlot: '14:00',
                selectedServices: ['Cafe Visit', 'Dog Cake']
            }
        );
        console.log('Reservation confirmation sent:', reservationResult);

        // Test adoption application confirmation
        console.log('\n3. Testing adoption application confirmation...');
        const adoptionResult = await emailService.sendAdoptionApplicationConfirmation(
            'jeffreyjp02@gmail.com',
            {
                customerInfo: {
                    name: 'Jeffreytest'
                },
                dog: {
                    name: 'Max'
                },
                _id: '12345',
                status: 'pending'
            }
        );
        console.log('Adoption confirmation sent:', adoptionResult);

    } catch (error) {
        console.error('Test failed:', error);
    }
};

testEmails();