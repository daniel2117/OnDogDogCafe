const axios = require('axios');

const API_URL = 'http://localhost:10000/api';

const testCancelReservation = async () => {
    console.log('Testing Reservation Cancellation...\n');
    
    const reservationId = '680c9f9139faff8ce97da041';
    
    try {
        // Attempt to cancel the reservation
        const response = await axios.post(
            `${API_URL}/reservations/${reservationId}/cancel`,
            {},
            {
                validateStatus: function (status) {
                    return status < 500; // Accept any status < 500 to handle all responses
                }
            }
        );

        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('\nTest failed with error:');
        if (error.code === 'ECONNREFUSED') {
            console.error('Could not connect to server. Make sure your backend is running on port 10000');
        } else if (error.response) {
            console.error('Server responded with:', {
                status: error.response.status,
                message: error.response.data.message
            });
        } else {
            console.error('Error:', error.message);
        }
    }
};

// Run the test
testCancelReservation();
