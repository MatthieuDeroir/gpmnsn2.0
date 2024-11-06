// src/actions/panelActions.js

import { UPDATE_PANEL } from './actionTypes';

export const updatePanel = (name, details) => ({
    type: UPDATE_PANEL,
    payload: { name, details },
});
