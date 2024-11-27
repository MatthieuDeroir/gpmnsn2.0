// src/reducers/websocketReducer.js

import {
    CONNECT_WEBSOCKET,
    DISCONNECT_WEBSOCKET,
    SET_PANEL_STATUS,
    SET_LOGS,
    SET_DYSFUNCTION_STATUS,
} from '../actions/actionTypes';

const initialState = {
    socket: null,
    isConnected: false,
    panelStatus: {}, // This should be initialized as an empty object
    logs: {},
    isAnyPanelInDysfunction: false,
};

const websocketReducer = (state = initialState, action) => {
    switch (action.type) {
        case CONNECT_WEBSOCKET:
            return {
                ...state,
                socket: action.payload,
                isConnected: true,
            };

        case DISCONNECT_WEBSOCKET:
            return {
                ...state,
                socket: null,
                isConnected: false,
            };

        case SET_PANEL_STATUS:
            const updatedPanelStatus = {
                ...state.panelStatus,
                ...action.payload,
            };

            // Determine if any panel has dysfunction
            const isAnyPanelInDysfunction = Object.values(updatedPanelStatus).some(
                (panel) => panel.dysfunction || panel.sectorStatus === false || !panel.connected
            );



            return {
                ...state,
                panelStatus: updatedPanelStatus,
                isAnyPanelInDysfunction, // Automatically update this based on panel statuses
            };


        case SET_LOGS:
            return {
                ...state,
                logs: {
                    ...state.logs,
                    ...action.payload,
                },
            };

        case SET_DYSFUNCTION_STATUS:
            return {
                ...state,
                isAnyPanelInDysfunction: action.payload,
            };

        default:
            return state;
    }
};

export default websocketReducer;
