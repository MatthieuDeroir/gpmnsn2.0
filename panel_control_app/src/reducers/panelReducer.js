// src/reducers/panelReducer.js

import { UPDATE_PANEL } from '../actions/actionTypes';

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

        default:
            return state;
    }
};

export default panelReducer;
