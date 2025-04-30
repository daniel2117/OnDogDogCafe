const axios = require('axios');
const readline = require('readline');

const API_URL = 'http://localhost:10000/api';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getVerificationCode = () => {
    return new Promise((resolve) => {
        rl.question('Please enter the verification code received in your email: ', (code) => {
            resolve(code);
        });
    });
};

const testReservationAPIs = async () => {
    try {
        console.log('Starting Reservation API Tests...\n');

        // Test 1: Check Availability
        console.log('1. Testing availability check...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateString = tomorrow.toISOString().split('T')[0];

        const availabilityResponse = await axios.get(`${API_URL}/reservations/availability`, {
            params: { date: dateString }
        });

        console.log('Availability Response:', {
            date: availabilityResponse.data.date,
            availableSlots: availabilityResponse.data.availableSlots,
            services: availabilityResponse.data.services
        });

        // Test 2: Email Verification Request
        console.log('\n2. Testing email verification...');
        const verificationResponse = await axios.post(
            `${API_URL}/reservations/verify-email`,
            {},
            {
                headers: { 
                    'email': 'jeffery0797@gmail.com',
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Verification Response:', verificationResponse.data);

        // Wait for user input
        const verificationCode = await getVerificationCode();

        // Test 3: Verify Code
        console.log('\n3. Testing verification code...');
        try {
            const verifyCodeResponse = await axios.post(
                `${API_URL}/reservations/verify-code`,
                {
                    email: 'jeffery0797@gmail.com',
                    code: verificationCode
                }
            );
            console.log('Code Verification Response:', verifyCodeResponse.data);

            if (!verifyCodeResponse.data.verified) {
                console.log('Verification failed. Stopping tests.');
                rl.close();
                return;
            }

            // Continue with remaining tests only if verification succeeds
            // Test 4: Create Reservation
            console.log('\n4. Testing reservation creation...');
            const reservationPayload = {
                customerInfo: {
                    name: "Jeffery",
                    email: "jeffery0797@gmail.com",
                    phone: "0912345678",  // Changed to a simpler phone format
                    petName: "Max",
                    petType: "Dog",
                    message: "Test reservation"
                },
                date: dateString,
                timeSlot: "14:00",
                selectedServices: ["Cafe Visit"]
            };

            try {
                const reservationResponse = await axios.post(
                    `${API_URL}/reservations/create`,
                    reservationPayload
                );
                console.log('Reservation Created Successfully:', reservationResponse.data);
            } catch (error) {
                console.log('Reservation creation response:', error.response?.data);
            }

            // Test 5: Get User Reservations
            console.log('\n5. Testing get user reservations...');
            const userReservationsResponse = await axios.get(
                `${API_URL}/reservations/history`,
                {
                    params: { 
                        email: 'jeffery0797@gmail.com'
                    }
                }
            );
            console.log('User Reservations:', userReservationsResponse.data);

        } catch (error) {
            console.log('Verification failed:', error.response?.data);
            rl.close();
            return;
        }

    } catch (error) {
        console.error('\nTest failed with error:');
        if (error.code === 'ECONNREFUSED') {
            console.error('Could not connect to server. Make sure your backend is running on port 10000');
            console.error('Expected URL:', API_URL);
        } else if (error.response) {
            console.error('Server responded with:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                path: error.response.config.url
            });
        } else {
            console.error('Error:', error.message);
        }
    } finally {
        rl.close();
    }
};

testReservationAPIs();
