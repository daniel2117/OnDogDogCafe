import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const reservationApi = {
    // Get available time slots
    getAvailability: async (date) => {
        try {
            const response = await axiosInstance.get('/reservations/availability', {
                headers: { date: date.toISOString() }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch availability' };
        }
    },

    // Verify email
    verifyEmail: async (email) => {
        try {
            const response = await axiosInstance.post('/reservations/verify-contact', 
                {},
                { headers: { email } }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to verify email' };
        }
    },

    // Verify verification code
    verifyCode: async (email, code) => {
        try {
            const response = await axiosInstance.post('/reservations/verify-code', {
                email,
                code
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to verify code' };
        }
    },

    // Create reservation
    createReservation: async (reservationData) => {
        try {
            const payload = {
                customerInfo: {
                    name: reservationData.name,
                    email: reservationData.email,
                    phone: reservationData.phone,
                    petName: reservationData.petName,
                    petType: reservationData.petType,
                    location: reservationData.location,
                    message: reservationData.message
                },
                date: reservationData.date,
                timeSlot: reservationData.timeSlot,
                selectedServices: reservationData.selectedServices
            };
            
            const response = await axiosInstance.post('/reservations/create', payload);
            return response.data;
        } catch (error) {
            if (error.response?.status === 400) {
                throw new Error(error.response.data.message || 'Invalid reservation data');
            }
            throw new Error('Failed to create reservation. Please try again later.');
        }
    },

    // Get user's reservations history
    getUserReservations: async (email, phone) => {
        try {
            const response = await axiosInstance.get('/reservations/history', {
                params: { email, phone }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch reservations' };
        }
    },

    // Cancel reservation
    cancelReservation: async (id, email, phone) => {
        try {
            const response = await axiosInstance.post(`/reservations/${id}/cancel`, {
                email,
                phone
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to cancel reservation' };
        }
    }
};

export default reservationApi;