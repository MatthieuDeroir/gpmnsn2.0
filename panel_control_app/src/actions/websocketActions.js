// src/actions/websocketActions.js

import {
    CONNECT_WEBSOCKET,
    DISCONNECT_WEBSOCKET,
    SET_PANEL_STATUS,
    SET_LOGS,
    SET_DYSFUNCTION_STATUS,
} from './actionTypes';

// Action to connect to the WebSocket
export const connectWebSocket = () => {
    return (dispatch) => {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            // Send registration message
            const registrationMessage = {
                type: 'register',
                clientType: 'user', // or 'frontend' based on your backend's expectation
                name: 'frontend',   // Ensure this matches the expected client name
            };
            ws.send(JSON.stringify(registrationMessage));
            console.log('Registration message sent:', registrationMessage);

            dispatch({
                type: CONNECT_WEBSOCKET,
                payload: ws,
            });
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WebSocket message received:', data);

                switch (data.type) {
                    case 'instruction':
                        if (data.panels) {
                            // Update panel status for all panels
                            dispatch({
                                type: SET_PANEL_STATUS,
                                payload: data.panels,
                            });
                        } else {
                            console.warn('Received instruction message without panels data:', data);
                        }
                        break;

                    case 'status':
                        if (data.panelStatus) {
                            // console.log('Received panel status data:', data.panelStatus);
                            //
                            // // Log individual panel statuses for each panel to inspect `dysfunction` values
                            // Object.keys(data.panelStatus).forEach(panel => {
                            //     console.log(`Panel: ${panel}, Status:`, data.panelStatus[panel]);
                            //     console.log(`Panel: ${panel}, Dysfunction type:`, data.panelStatus[panel]);
                            // });

                            dispatch({
                                type: SET_PANEL_STATUS,
                                payload: data.panelStatus,
                            });
                        } else {
                            console.warn('Received status message without panelStatus data:', data);
                        }
                        break;

                    case 'log':
                        if (data.name && data.log) {
                            dispatch({
                                type: SET_LOGS,
                                payload: { [data.name]: [data.log] },
                            });
                        } else {
                            console.warn('Received log message without name or log data:', data);
                        }
                        break;

                    case 'panel_registered':
                        if (data.name) {
                            dispatch({
                                type: SET_PANEL_STATUS,
                                payload: {
                                    [data.name]: {
                                        connected: true,
                                    },
                                },
                            });
                        } else {
                            console.warn('Received panel_registered message without name:', data);
                        }
                        break;

                    // Handle other message types as needed
                    default:
                        console.warn('Unhandled message type:', data.type);
                        break;
                }
            } catch (error) {
                console.error('Error parsing WebSocket message data:', error);
            }
        };

        ws.onclose = () => {
            dispatch({
                type: DISCONNECT_WEBSOCKET,
            });
            console.log('WebSocket connection closed');


            // Attempt to reconnect
            setTimeout(() => {
                dispatch(connectWebSocket());
            }, 5000);

        };

        // Optional: Handle WebSocket errors
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    };
};

// Action to disconnect from the WebSocket
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

// Action to fetch logs for a specific panel
export const fetchLogsForPanel = (panelName) => {
    return async (dispatch, getState) => {
        try {
            const state = getState();
            const token = state.auth.token;

            const response = await fetch(
                `http://localhost:4000/api/logs/panel/${panelName}?limit=10`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                console.error('Error fetching logs:', response.statusText);
                dispatch({
                    type: SET_LOGS,
                    payload: { [panelName]: [] },
                });
                return;
            }

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
