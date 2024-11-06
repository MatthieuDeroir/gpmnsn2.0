// src/actions/actionTypes.js

/**
 * Auth Action Types
 * @constant {string} LOGIN - Action type for user login.
 * @constant {string} LOGOUT - Action type for user logout.
 * @constant {string} SET_ROLE - Action type for setting user role.
 */
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SET_ROLE = 'SET_ROLE';

/**
 * WebSocket Action Types
 * @constant {string} CONNECT_WEBSOCKET - Action type for connecting to WebSocket.
 * @constant {string} DISCONNECT_WEBSOCKET - Action type for disconnecting from WebSocket.
 * @constant {string} SET_PANEL_STATUS - Action type for setting panel status.
 * @constant {string} SET_LOGS - Action type for setting logs.
 * @constant {string} SET_DYSFUNCTION_STATUS - Action type for setting dysfunction status.
 */
export const CONNECT_WEBSOCKET = 'CONNECT_WEBSOCKET';
export const DISCONNECT_WEBSOCKET = 'DISCONNECT_WEBSOCKET';
export const SET_PANEL_STATUS = 'SET_PANEL_STATUS';
export const SET_LOGS = 'SET_LOGS';
export const SET_DYSFUNCTION_STATUS = 'SET_DYSFUNCTION_STATUS';

/**
 * Panel Action Types
 * @constant {string} UPDATE_PANEL - Action type for updating panel.
 */
export const UPDATE_PANEL = 'UPDATE_PANEL';

/**
 * Log Action Types
 * @constant {string} FETCH_LOGS_SUCCESS - Action type for successful log fetch.
 * @constant {string} FETCH_LOGS_FAILURE - Action type for failed log fetch.
 */
export const FETCH_LOGS_SUCCESS = 'FETCH_LOGS_SUCCESS';
export const FETCH_LOGS_FAILURE = 'FETCH_LOGS_FAILURE';
