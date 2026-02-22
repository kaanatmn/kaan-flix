import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            'An unexpected error occurred';

        error.userMessage = typeof message === 'string' ? message : JSON.stringify(message);
        return Promise.reject(error);
    }
);

export default api;
