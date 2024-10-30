// src/api/axiosConfig.js
import axios from 'axios';
import { useAuth } from '../Contexts/AuthorizationContext';

const axiosInstance = axios.create({
    baseURL: '/api', // Set your API base URL
});

axiosInstance.interceptors.request.use(
    (config) => {
        const { token } = useAuth();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
