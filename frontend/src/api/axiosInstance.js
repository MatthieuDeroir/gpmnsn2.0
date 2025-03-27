// src/api/axiosInstance.js

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://panneauxloire.nantes.port.fr',
});

// Intercepteur pour ajouter le jeton JWT à chaque requête
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Récupérer le jeton depuis le localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
