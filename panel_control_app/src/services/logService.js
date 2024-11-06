// src/services/logService.js

import axiosInstance from '../api/axiosInstance';

/**
 * Récupère les journaux filtrés en fonction des paramètres fournis.
 *
 * @param {string} panelOrRole - 'panel' ou 'role' selon le type de filtre.
 * @param {string} selectedType - Le type sélectionné ('all', 'Aval', 'Amont', etc.).
 * @param {number} page - Le numéro de la page.
 * @param {number} limit - Le nombre de journaux par page.
 * @param {string} startDate - La date de début au format ISO.
 * @param {string} endDate - La date de fin au format ISO.
 * @param {string} searchQuery - La requête de recherche.
 * @returns {Promise<Object>} - Les données des journaux.
 */
export const fetchLogs = async (panelOrRole, selectedType, page, limit, startDate, endDate, searchQuery) => {
    try {
        const response = await axiosInstance.get(
            `/api/logs/${panelOrRole}/${selectedType}`,
            {
                params: {
                    page,
                    limit,
                    startDate,
                    endDate,
                    search: searchQuery,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Effectue une recherche de journaux en fonction de la requête fournie.
 *
 * @param {string} query - La requête de recherche.
 * @returns {Promise<Object>} - Les données des journaux.
 */
export const searchLogs = async (query) => {
    try {
        const response = await axiosInstance.get('/api/logs/search', {
            params: {
                query,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
