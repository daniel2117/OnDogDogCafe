import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const adoptionApi = {
    // Get all available dogs
    getAllDogs: async (page = 1, filters = {}) => {
        try {
            const response = await axiosInstance.get('/adoption/dogs', {
                params: {
                    page,
                    limit: 10,
                    ...filters
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch dogs' };
        }
    },

    // Get specific dog details
    getDogById: async (id) => {
        try {
            const response = await axiosInstance.get(`/adoption/dogs/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch dog details' };
        }
    },

    // Get similar dogs
    getSimilarDogs: async (id) => {
        try {
            const response = await axiosInstance.get(`/adoption/dogs/${id}/similar`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch similar dogs' };
        }
    },

    // Submit adoption application
    submitApplication: async (applicationData) => {
        try {
            const response = await axiosInstance.post('/adoption/apply', applicationData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to submit application' };
        }
    }
};

export default adoptionApi;
