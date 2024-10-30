import React, { createContext, useContext, useState } from 'react';

const AuthorizationContext = createContext(null);

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
    }
};

export const AuthorizationProvider = ({ children }) => {
    const [role, setRole] = useState("Maintenance");
    const [token, setToken] = useState(null);

    const getPermissions = (role) => {
        return permissions[role] || {};
    };

    const isAuthenticated = !!token;

    const logout = () => {
        setToken(null);
        setRole(null);
    };

    return (
        <AuthorizationContext.Provider value={{ role, setRole, permissions: getPermissions(role), logout, token, isAuthenticated}}>
            {children}
        </AuthorizationContext.Provider>
    );
};

export const useAuth = () => useContext(AuthorizationContext);
