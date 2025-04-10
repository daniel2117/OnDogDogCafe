// src/apiService.js
import axios from 'axios';


// Set the base URL for your backend API
// It will try to use the .env variable, or default to localhost:5000
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';

export const reservationApi = {
    // Get available time slots
    getAvailability: async (date) => {
        try {
            const response = await axios.get(`${API_URL}/reservations/availability`, {
                headers: { date: date.toISOString() }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create reservation
    create: async (reservationData) => {
        try {
            const response = await axios.post(`${API_URL}/reservations/create`, reservationData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Verify contact (email/phone)
    verifyContact: async (email) => {
        try {
            const response = await axios.post(`${API_URL}/reservations/verify-contact`, null, {
                headers: { email }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

// Dogs/Adoption
export const getAvailableDogs = async (page = 1, filters = {}) => {
    try {
        const response = await axios.get(`${API_URL}/adoption/dogs`, {
            params: {
                page,
                limit: 9,
                ...filters
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getDogDetails = async (dogId) => {
    try {
        const response = await axios.get(`${API_URL}/adoption/dogs/${dogId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getSimilarDogs = async (dogId) => {
    try {
        const response = await axios.get(`${API_URL}/adoption/dogs/${dogId}/similar`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Content
export const getServices = async () => {
    try {
        const response = await axios.get(`${API_URL}/content/services`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getBusinessInfo = async () => {
    try {
        const response = await axios.get(`${API_URL}/content/business-info`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};