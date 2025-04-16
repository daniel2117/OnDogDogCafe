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

const dogCafeApi = {
    // =====================
    // Reservation Endpoints
    // =====================

    getAvailability: async (date) => {
        try {

            const response = await axiosInstance.get('/reservations/availability', { params: { date } });

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch availability' };
        }
    },

    verifyEmail: async (email) => {
        try {
            const response = await axiosInstance.post('/reservations/verify-email',
                {},
                { headers: { email } }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to verify email' };
        }
    },

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
    },

    // =====================
    // Adoption Endpoints
    // =====================

    getAdoptableDogs: async (filters = {}) => {
        try {
            const response = await axiosInstance.get('/adoption/dogs', {
                params: filters
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch adoptable dogs' };
        }
    },

    getDogDetails: async (id) => {
        try {
            const response = await axiosInstance.get(`/adoption/dogs/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch dog details' };
        }
    },

    getSimilarDogs: async (id) => {
        try {
            const response = await axiosInstance.get(`/adoption/dogs/${id}/similar`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch similar dogs' };
        }
    },

    applyForAdoption: async (applicationData) => {
        try {
            const response = await axiosInstance.post('/adoption/apply', {
                dogId: applicationData.dogId,
                customerInfo: {
                    name: applicationData.name,
                    email: applicationData.email,
                    phone: applicationData.phone,
                    address: applicationData.address
                },
                applicationDetails: {
                    livingArrangement: applicationData.livingArrangement,
                    hasOtherPets: applicationData.hasOtherPets,
                    experience: applicationData.experience,
                    reason: applicationData.reason
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to submit adoption application' };
        }
    }
};

export default dogCafeApi;