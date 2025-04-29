// apiGrouped.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

export const adoptionApi = {
    getDogs: async (params) => {
        try {
            const res = await axiosInstance.get('/adoption/dogs', { params });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch dogs' };
        }
    },
    getDogDetails: async (id) => {
        try {
            const res = await axiosInstance.get(`/adoption/dogs/${id}`);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch dog details' };
        }
    },
    getSimilarDogs: async (id) => {
        try {
            const res = await axiosInstance.get(`/adoption/dogs/${id}/similar`);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch similar dogs' };
        }
    },
    getFilters: async () => {
        try {
            const res = await axiosInstance.get('/adoption/filters');
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch filters' };
        }
    },
    upload: async (files) => {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("images", file);
            });

            const res = await axiosInstance.post(
                `/adoption/upload/images`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to upload adoption photo' };
        }

    },
    apply: async (data) => {
        try {
            const res = await axiosInstance.post('/adoption/apply', data);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to submit application' };
        }
    },
    getApplication: async (id) => {
        try {
            const res = await axiosInstance.get(`/adoption/application/${id}`);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to submit application' };
        }
    },
    update: async (id, data) => {
        try {
            const res = await axiosInstance.put(`/adoption/application/${id}`, data);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to update adoption application' };
        }
    },
};


export const myPageApi = {
    getApplications: async (email) => {
        try {
            const res = await axiosInstance.get('/mypage/applications', { params: { email } });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch user applications' };
        }
    }
};

export const contentApi = {
    getServices: async (lang = 'en') => {
        try {
            const res = await axiosInstance.get('/content/services', { headers: { 'accept-language': lang } });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch services' };
        }
    },
    getBusinessInfo: async (lang = 'en') => {
        try {
            const res = await axiosInstance.get('/content/business-info', { headers: { 'accept-language': lang } });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch business info' };
        }
    },
    getTerms: async (lang = 'en') => {
        try {
            const res = await axiosInstance.get('/content/terms', { headers: { 'accept-language': lang } });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch terms' };
        }
    },
    getPrivacy: async (lang = 'en') => {
        try {
            const res = await axiosInstance.get('/content/privacy', { headers: { 'accept-language': lang } });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch privacy policy' };
        }
    }
};

export const contactApi = {
    submit: async (data) => {
        try {
            const res = await axiosInstance.post('/contact/submit', data);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to submit contact message' };
        }
    },
    getInquiries: async () => {
        try {
            const res = await axiosInstance.get('/contact/inquiries');
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch inquiries' };
        }
    },
    updateInquiryStatus: async (id, data) => {
        try {
            const res = await axiosInstance.patch(`/contact/inquiries/${id}/status`, data);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to update inquiry status' };
        }
    }
};

export const feedbackApi = {
    submit: async (data) => {
        try {
            const res = await axiosInstance.post('/feedback/submit', data);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to submit feedback' };
        }
    },
    getList: async (params) => {
        try {
            const res = await axiosInstance.get(`/feedback/getlist`, { params });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch feedback List' };
        }
    },
    getById: async (id) => {
        try {
            const res = await axiosInstance.get(`/feedback/${id}`);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch feedback' };
        }
    },
    getAllAdmin: async () => {
        try {
            const res = await axiosInstance.get('/feedback/admin/all');
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch all feedback' };
        }
    },
    respond: async (id, data) => {
        try {
            const res = await axiosInstance.post(`/feedback/${id}/respond`, data);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to respond to feedback' };
        }
    }
};

export const rehomingApi = {
    submit: async (data) => {
        try {
            const res = await axiosInstance.post('/rehoming/submit', data);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to submit rehoming request' };
        }
    },
    getById: async (id) => {
        try {
            const res = await axiosInstance.get(`/rehoming/application/${id}`);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch rehoming request' };
        }
    },
    getByEmail: async (email) => {
        try {
            const res = await axiosInstance.get('/rehoming/applications', { params: { email } });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch applications by email' };
        }
    },
    update: async (id, data) => {
        try {
            const res = await axiosInstance.put(`/rehoming/application/${id}`, data);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to update rehoming application' };
        }
    },
    uploadPhoto: async (files) => {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("photos", file);
            });

            const res = await axiosInstance.post(
                `/rehoming/upload/photos`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to upload rehoming photo' };
        }
    },
    uploadDocuments: async (files) => {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("documents", file);
            });

            const res = await axiosInstance.post(
                `/rehoming/upload/documents`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to upload rehoming documents' };
        }
    },

    getAllAdmin: () => axiosInstance.get('/rehoming/admin/applications'),
    updateStatus: (id, data) => axiosInstance.patch(`/rehoming/admin/application/${id}/status`, data)
};

export const reservationApi = {
    getAvailability: async (date) => {
        try {
            const res = await axiosInstance.get('/reservations/availability', {
                params: { date }
            });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch availability' };
        }
    },
    verifyEmail: async (email) => {
        try {
            const res = await axiosInstance.post('/reservations/verify-email', {}, { headers: { email } });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to send verification email' };
        }
    },
    verifyCode: async (email, code) => {
        try {
            const res = await axiosInstance.post('/reservations/verify-code', { email, code });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to verify code' };
        }
    },
    create: async (data) => {
        try {
            const res = await axiosInstance.post('/reservations/create', data);
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to create reservation' };
        }
    },
    getHistory: async (email, phone) => {
        try {
            const res = await axiosInstance.get('/reservations/history', { params: { email, phone } });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to fetch reservation history' };
        }
    },
    cancel: async (id, email) => {
        try {
            const res = await axiosInstance.post(`/reservations/${id}/cancel`, { headers: { email } });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to cancel reservation' };
        }
    },
    modify: async (id, data) => {
        try {
            const res = await axiosInstance.put(`/reservations/${id}`, { data });
            return res.data;
        } catch (err) {
            throw err.response?.data || { message: 'Failed to modify reservation' };
        }
    }
};
