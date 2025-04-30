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
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7); // Set date 7 days ahead instead of tomorrow
        const dateString = futureDate.toISOString().split('T')[0];

        const availabilityResponse = await axios.get(`${API_URL}/reservations/availability`, {
            params: { date: dateString }
        });

        console.log('Availability Response:', {
            date: availabilityResponse.data.date,
            timeSlots: availabilityResponse.data.timeSlots,  // Changed from availableSlots to timeSlots
            services: Object.values(availabilityResponse.data.timeSlots || {})  // Extract services from timeSlots
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
            // Store the reservation ID for cancellation test
            let createdReservationId;
            
            // Test 4: Create Reservation
            console.log('\n4. Testing reservation creation...');
            const reservationPayload = {
                customerInfo: {
                    name: "Jeffery",
                    email: "jeffery0797@gmail.com",
                    phone: "0912345678",
                    petName: "Max",
                    petType: "Dog",
                    message: "Test reservation"
                },
                date: dateString,  // This will now use the date 7 days in advance
                timeSlot: "14:00",
                numberOfPeople: 2,
                selectedServices: ["Cafe Visit"]
            };

            try {
                const reservationResponse = await axios.post(
                    `${API_URL}/reservations/create`,
                    reservationPayload
                );
                console.log('Reservation Created Successfully:', reservationResponse.data);
                createdReservationId = reservationResponse.data.reservation._id;
            } catch (error) {
                console.log('Reservation creation response:', error.response?.data);
                throw error; // Stop execution if creation fails
            }

            // Test 5: Cancel Reservation
            if (createdReservationId) {
                console.log('\n5. Testing reservation cancellation...');
                try {
                    const cancelResponse = await axios.post(
                        `${API_URL}/reservations/${createdReservationId}/cancel`,
                        {},
                        {
                            validateStatus: function (status) {
                                return status < 500; // Accept any status < 500
                            }
                        }
                    );
                    
                    if (cancelResponse.status === 200) {
                        console.log('Cancellation successful:', cancelResponse.data);
                    } else {
                        console.log('Cancellation failed with status:', cancelResponse.status);
                        console.log('Error message:', cancelResponse.data.message);
                        if (cancelResponse.data.error) {
                            console.log('Error details:', cancelResponse.data.error);
                        }
                    }
                } catch (error) {
                    console.error('Cancellation request failed:', error.message);
                    if (error.response) {
                        console.error('Response data:', error.response.data);
                        console.error('Response status:', error.response.status);
                    }
                }
            }

            // Test 6: Get User Reservations (now includes cancelled ones)
            console.log('\n6. Testing get user reservations...');
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
