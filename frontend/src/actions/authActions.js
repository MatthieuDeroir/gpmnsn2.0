// src/actions/authActions.js

import { LOGIN, LOGOUT, SET_ROLE } from './actionTypes';

// Action creators
export const login = (token, role) => {
    return (dispatch) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        dispatch({
            type: LOGIN,
            payload: { token, role },
        });
    };
};

export const logout = () => {
    return (dispatch) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        dispatch({
            type: LOGOUT,
        });
    };
};

export const setRole = (role) => {
    localStorage.setItem('role', role);
    return {
        type: SET_ROLE,
        payload: role,
    };
};
