// src/store.js

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

// Import your reducers
import authReducer from '../reducers/authReducer';
import websocketReducer from '../reducers/websocketReducer';
import panelReducer from '../reducers/panelReducer';
import logReducer from '../reducers/logReducer';

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
    websocket: websocketReducer,
    panel: panelReducer,
    logs: logReducer,
    // Add other reducers as needed
});

// Create the store with middleware
export const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
