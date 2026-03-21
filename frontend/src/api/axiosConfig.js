import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Grab the token from local storage
        const token = localStorage.getItem('token');
        
        // If it exists, add it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;