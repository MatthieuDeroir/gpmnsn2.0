// src/actions/websocketActions.js

import {
    CONNECT_WEBSOCKET,
    DISCONNECT_WEBSOCKET,
    SET_PANEL_STATUS,
    SET_LOGS,
    SET_DYSFUNCTION_STATUS,
} from './actionTypes';

export const connectWebSocket = () => {
    return (dispatch) => {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            dispatch({
                type: CONNECT_WEBSOCKET,
                payload: ws,
            });
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case 'status':
                        dispatch({
                            type: SET_PANEL_STATUS,
                            payload: { [data.name]: data.panelStatus },
                        });
                        break;

                    case 'log':
                        dispatch({
                            type: SET_LOGS,
                            payload: { [data.name]: [data.log] },
                        });
                        break;

                    case 'panel_registered':
                        dispatch({
                            type: SET_PANEL_STATUS,
                            payload: {
                                [data.name]: {
                                    connected: true,
                                },
                            },
                        });
                        break;

                    // Handle other message types as needed
                    default:
                        break;
                }
            } catch (error) {
                console.error('Error parsing message data:', error);
            }
        };

        ws.onclose = () => {
            dispatch({
                type: DISCONNECT_WEBSOCKET,
            });
            console.log('WebSocket connection closed');
        };
    };
};

export const disconnectWebSocket = () => {
    return (dispatch, getState) => {
        const { websocket } = getState();
        if (websocket.socket) {
            websocket.socket.close();
        }
        dispatch({
            type: DISCONNECT_WEBSOCKET,
        });
    };
};

export const fetchLogsForPanel = (panelName) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://localhost:4000/logs/panel/${panelName}?limit=10`);
            const data = await response.json();
            if (data && Array.isArray(data.logs)) {
                dispatch({
                    type: SET_LOGS,
                    payload: { [panelName]: data.logs },
                });
            } else {
                console.warn('Invalid log data received:', data);
                dispatch({
                    type: SET_LOGS,
                    payload: { [panelName]: [] },
                });
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
            dispatch({
                type: SET_LOGS,
                payload: { [panelName]: [] },
            });
        }
    };
};
