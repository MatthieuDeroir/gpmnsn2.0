// src/reducers/panelReducer.js

import { UPDATE_PANEL, SET_PENDING_STATE, CLEAR_PENDING_STATE } from '../actions/actionTypes';

const initialState = {};

const panelReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PANEL:
            const { name, details } = action.payload;
            return {
                ...state,
                [name]: {
                    ...state[name],
                    ...details,
                },
            };

        case SET_PENDING_STATE:
            const { panelName, pendingState } = action.payload;
            return {
                ...state,
                [panelName]: {
                    ...state[panelName],
                    pendingState,
                },
            };

        case CLEAR_PENDING_STATE:
            const { panelName: nameToClear } = action.payload;
            if (state[nameToClear]) {
                const { [nameToClear]: panelData } = state;
                const { pendingState, ...rest } = panelData;
                return {
                    ...state,
                    [nameToClear]: rest,
                };
            }
            return state;

        default:
            return state;
    }
};

export default panelReducer;
