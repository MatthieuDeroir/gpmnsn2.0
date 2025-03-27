// src/reducers/authReducer.js

import { LOGIN, LOGOUT, SET_ROLE } from '../actions/actionTypes';

const initialState = {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    permissions: JSON.parse(localStorage.getItem('permissions')) || {},
};


const permissionsByRole = {
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

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            const { token, role } = action.payload;
            const permissions = permissionsByRole[role] || {};
            localStorage.setItem('permissions', JSON.stringify(permissions));
            return {
                ...state,
                token,
                role,
                isAuthenticated: true,
                permissions,
            };

        case LOGOUT:
            return {
                ...state,
                token: null,
                role: null,
                isAuthenticated: false,
                permissions: {},
            };

        case SET_ROLE:
            const updatedPermissions = permissionsByRole[action.payload] || {};
            localStorage.setItem('permissions', JSON.stringify(updatedPermissions));
            return {
                ...state,
                role: action.payload,
                permissions: updatedPermissions,
            };

        default:
            return state;
    }
};

export default authReducer;
