// src/Contexts/AuthorizationContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

// Création du contexte d'autorisation
const AuthorizationContext = createContext(null);

// Définition des permissions pour chaque rôle
const permissions = {
    Maintenance: {
        canRefreshIndividualPanel: true,
        canStartIndividualPanel: true,
        canShutdownIndividualPanel: true,
        canRebootIndividualPanel: true,
        canRefreshMultiplePanel: true,
        canStartMultiplePanel: true,
        canShutdownMultiplePanel: true,
        canRebootMultiplePanel: true,
    },
    Operateur: {
        canRefreshIndividualPanel: true,
        canStartIndividualPanel: false,
        canShutdownIndividualPanel: false,
        canRebootIndividualPanel: false,
        canRefreshMultiplePanel: true,
        canStartMultiplePanel: true,
        canShutdownMultiplePanel: true,
        canRebootMultiplePanel: false,
    },
    Visualisation: {
        canRefreshIndividualPanel: true,
        canStartIndividualPanel: false,
        canShutdownIndividualPanel: false,
        canRebootIndividualPanel: false,
        canRefreshMultiplePanel: true,
        canStartMultiplePanel: false,
        canShutdownMultiplePanel: false,
        canRebootMultiplePanel: false,
    },
};

/**
 * AuthorizationProvider fournit le contexte d'autorisation à ses enfants.
 *
 * @param {Object} props - Les props du composant.
 * @param {React.ReactNode} props.children - Les composants enfants.
 * @returns {JSX.Element} Le composant fournisseur.
 */
export const AuthorizationProvider = ({ children }) => {
    // État pour le rôle de l'utilisateur
    const [role, setRole] = useState(() => localStorage.getItem('role'));

    // État pour le jeton
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    // État pour savoir si l'utilisateur est authentifié
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

    // **Fonction pour gérer la connexion**
    const login = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setToken(token);
        setRole(role);
        setIsAuthenticated(true);
    };

    // Fonction pour obtenir les permissions en fonction du rôle
    const getPermissions = (role) => {
        return permissions[role] || {};
    };

    // Fonction de déconnexion
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setIsAuthenticated(false);
        setRole(null);
    };

    return (
        <AuthorizationContext.Provider
            value={{
                token,
                role,
                permissions: getPermissions(role),
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthorizationContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte d'autorisation
export const useAuth = () => useContext(AuthorizationContext);
