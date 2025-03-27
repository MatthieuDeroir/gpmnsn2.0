// src/reducers/logReducer.js

import { FETCH_LOGS_SUCCESS, FETCH_LOGS_FAILURE } from '../actions/actionTypes';

const initialState = {
    logs: [],
    error: null,
};

const logReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_LOGS_SUCCESS:
            return {
                ...state,
                logs: action.payload.logs,
                error: null,
            };

        case FETCH_LOGS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default logReducer;
