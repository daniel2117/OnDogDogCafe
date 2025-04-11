import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:10000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;