// src/actions/panelActions.js

import { UPDATE_PANEL, SET_PENDING_STATE, CLEAR_PENDING_STATE } from './actionTypes';

export const updatePanel = (name, details) => ({
    type: UPDATE_PANEL,
    payload: { name, details },
});

export const setPendingState = (panelName, pendingState) => ({
    type: SET_PENDING_STATE,
    payload: { panelName, pendingState },
});

export const clearPendingState = (panelName) => ({
    type: CLEAR_PENDING_STATE,
    payload: { panelName },
});