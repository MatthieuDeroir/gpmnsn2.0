// src/reducers/authReducer.js

import { LOGIN, LOGOUT, SET_ROLE } from '../actions/actionTypes';

const initialState = {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    permissions: {},
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
            return {
                ...state,
                token,
                role,
                isAuthenticated: true,
                permissions: permissionsByRole[role] || {},
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
            return {
                ...state,
                role: action.payload,
                permissions: permissionsByRole[action.payload] || {},
            };

        default:
            return state;
    }
};

export default authReducer;
