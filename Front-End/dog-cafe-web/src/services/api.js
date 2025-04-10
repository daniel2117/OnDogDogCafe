// src/apiService.js
import axios from 'axios';

// Set the base URL for your backend API
// It will try to use the .env variable, or default to localhost:5000
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// --- Helper function to get the language preference ---
// (Assumes you store 'en' or 'zh' in localStorage when user switches lang)
const getLanguageHeader = () => {
    const lang = localStorage.getItem('appLanguage') || 'en'; // Default to English
    return { 'Accept-Language': lang };
};

// --- Helper function to get the auth token if user is logged in ---
// (Assumes you store the token in localStorage after login)
const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    }
    return {}; // Return empty object if no token
};
// src/apiService.js (Continuing from above...)

    // === Content ===

    /** Fetches the list of services offered */
    export const getServices = async () => {
        try {
            const response = await axios.get(`${API_URL}/content/services`, {
                headers: getLanguageHeader() // Add language header
            });
            return response.data; // Return the data part of the response
        } catch (error) {
            console.error('Error fetching services:', error.response?.data || error.message);
            throw error; // Re-throw error to be caught by the component
        }
    };

    /** Fetches general business information */
    export const getBusinessInfo = async () => {
        try {
            const response = await axios.get(`${API_URL}/content/business-info`, {
                headers: getLanguageHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching business info:', error.response?.data || error.message);
            throw error;
        }
    };

    // === Adoption ===

    /** Fetches dogs available for adoption (supports pagination) */
    export const getAdoptableDogs = async (page = 1, limit = 10, filters = {}) => {
        try {
            // 'params' will be sent as query string parameters (e.g., ?page=1&limit=10)
            const response = await axios.get(`${API_URL}/adoption/dogs`, {
                params: { page, limit, ...filters }, // Send pagination and any filters
                headers: getLanguageHeader()
            });
            return response.data; // Expected: { dogs: [...], totalPages: X, currentPage: Y }
        } catch (error) {
            console.error('Error fetching adoptable dogs:', error.response?.data || error.message);
            throw error;
        }
    };

    /** Fetches details for a specific adoptable dog */
    export const getDogDetails = async (dogId) => {
        if (!dogId) throw new Error('Dog ID is required');
        try {
            const response = await axios.get(`${API_URL}/adoption/dogs/${dogId}`, {
                headers: getLanguageHeader()
            });
            return response.data; // Expected: { dog: {...} }
        } catch (error) {
            console.error(`Error fetching dog details for ID ${dogId}:`, error.response?.data || error.message);
            throw error;
        }
    };

     /** Fetches dogs similar to a specific adoptable dog */
    export const getSimilarDogs = async (dogId) => {
        if (!dogId) throw new Error('Dog ID is required');
        try {
            const response = await axios.get(`${API_URL}/adoption/dogs/${dogId}/similar`, {
                headers: getLanguageHeader()
            });
            return response.data; // Expected: { similarDogs: [...] }
        } catch (error) {
            console.error(`Error fetching similar dogs for ID ${dogId}:`, error.response?.data || error.message);
            throw error;
        }
    };

    /** Submits an adoption application */
    export const applyForAdoption = async (applicationData) => {
        try {
            // Second argument to post is the data body
            const response = await axios.post(`${API_URL}/adoption/apply`, applicationData, {
                headers: {
                    ...getLanguageHeader(), // Include language
                    ...getAuthHeader() // Include auth token if needed/available
                }
            });
            return response.data; // Expected: { message: 'Success...', ... }
        } catch (error) {
            console.error('Error applying for adoption:', error.response?.data || error.message);
            throw error;
        }
    };


    // === Reservations ===

    /** Sends verification code to user's email */
    export const sendVerificationCode = async (email) => {
        if (!email) throw new Error('Email is required');
        try {
            // Backend expects email in headers for this specific route (as per controller)
            // No request body needed (null as second argument)
            const response = await axios.post(`${API_URL}/reservations/send-verification-code`, null, {
                headers: {
                    'email': email, // Specific header for this request
                    ...getLanguageHeader()
                }
            });
            return response.data; // Expected: { message: 'Verification code sent' }
        } catch (error) {
            console.error('Error sending verification code:', error.response?.data || error.message);
            throw error;
        }
    };

     /** Verifies the code sent to the user's email */
    export const verifyVerificationCode = async (email, code) => {
        if (!email || !code) throw new Error('Email and code are required');
        try {
            // Backend expects email and code in the request body
            const response = await axios.post(`${API_URL}/reservations/verify-code`, { email, code }, {
                headers: getLanguageHeader()
            });
            return response.data; // Expected: { success: true, message: '...' } or similar
        } catch (error) {
            console.error('Error verifying code:', error.response?.data || error.message);
            throw error;
        }
    };


    /** Creates a new reservation */
    export const createReservation = async (reservationData) => {
        try {
            const response = await axios.post(`${API_URL}/reservations/create`, reservationData, {
                headers: getLanguageHeader()
            });
            return response.data; // Expected: { message: 'Success...', reservation: {...} }
        } catch (error) {
            console.error('Error creating reservation:', error.response?.data || error.message);
            throw error;
        }
    };

    /** Fetches reservation history for a user */
    export const getReservationHistory = async (email, phone) => {
         if (!email && !phone) throw new Error('Email or phone is required');
        try {
            // Pass email/phone as query parameters
            const response = await axios.get(`${API_URL}/reservations/history`, {
                 params: { email, phone },
                 headers: getLanguageHeader()
             });
            return response.data; // Expected: { reservations: [...] }
        } catch (error) {
            console.error('Error fetching reservation history:', error.response?.data || error.message);
            throw error;
        }
    };

     /** Cancels a reservation */
    export const cancelReservation = async (reservationId, email, phone) => {
         if (!reservationId || !email || !phone) throw new Error('Reservation ID, email, and phone are required');
        try {
            // Backend expects email/phone in body for cancellation verification
            const response = await axios.post(`${API_URL}/reservations/${reservationId}/cancel`, { email, phone }, {
                 headers: getLanguageHeader()
             });
            return response.data; // Expected: { message: 'Success...' }
        } catch (error) {
            console.error(`Error cancelling reservation ${reservationId}:`, error.response?.data || error.message);
            throw error;
        }
    };

    // === Authentication ===

    /** Logs in a user */
    export const loginUser = async (credentials) => {
        // credentials should be { email, password }
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            if (response.data.token) {
                // IMPORTANT: Store the token for later use!
                localStorage.setItem('authToken', response.data.token);
                // Store user profile info if needed
                localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            }
            return response.data; // Expected: { token: '...', user: {...} }
        } catch (error) {
            console.error('Error logging in:', error.response?.data || error.message);
            localStorage.removeItem('authToken'); // Clear any old token on login failure
            localStorage.removeItem('userInfo');
            throw error;
        }
    };

    /** Logs out a user */
    export const logoutUser = () => {
        // Simple logout just removes the token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        // Optionally: Add a call to a backend /logout endpoint if it exists
        // and needs to do something (like invalidate the token server-side)
    };

    /** Fetches the current user's profile (needs login token) */
    export const getUserProfile = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/profile`, {
                headers: {
                    ...getLanguageHeader(),
                    ...getAuthHeader() // Crucial: Add the auth token header
                }
            });
            return response.data; // Expected: { user: {...} }
        } catch (error) {
            console.error('Error fetching profile:', error.response?.data || error.message);
            // If error is 401 Unauthorized, maybe logout the user?
             if (error.response?.status === 401) {
                 logoutUser(); // Example: auto-logout if token is invalid/expired
             }
            throw error;
        }
    };

    // Add more functions here as needed for:
    // - Registering a user (`/auth/register`)
    // - Checking reservation availability (`/reservations/availability`) - needs date header!
    // - Admin functions for managing dogs (`/dogs/...` routes, need auth header)