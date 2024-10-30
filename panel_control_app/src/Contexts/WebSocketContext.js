// src/Contexts/WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [panelStatus, setPanelStatus] = useState({});
    const [logs, setLogs] = useState({});
    const [isAnyPanelInDysfunction, setIsAnyPanelInDysfunction] = useState(false);

    useEffect(() => {
        // Establish WebSocket connection
        const ws = new WebSocket('ws://localhost:8080');
        setSocket(ws);

        ws.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case 'status':
                        setPanelStatus((prevStatus) => ({
                            ...prevStatus,
                            [data.name]: data.panelStatus,
                        }));
                        break;

                    case 'log':
                        setLogs((prevLogs) => ({
                            ...prevLogs,
                            [data.name]: [...(prevLogs[data.name] || []), data.log],
                        }));
                        break;

                    case 'panel_registered':
                        setPanelStatus((prevStatus) => ({
                            ...prevStatus,
                            [data.name]: {
                                ...prevStatus[data.name],
                                connected: true,
                            },
                        }));
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
            setIsConnected(false);
            console.log('WebSocket connection closed');
        };

        // Clean up WebSocket connection
        return () => {
            ws.close();
        };
    }, []);

    // Update isAnyPanelInDysfunction based on panelStatus
    useEffect(() => {
        const anyDysfunction = Object.values(panelStatus).some(
            (panel) => !panel.connected || !panel.sectorStatus
        );
        setIsAnyPanelInDysfunction(anyDysfunction);
    }, [panelStatus]);

    // Fetch logs for a specific panel
    const fetchLogsForPanel = async (panelName) => {
        try {
            const response = await fetch(`http://localhost:4000/logs/panel/${panelName}?limit=10`);
            const data = await response.json();
            if (data && Array.isArray(data.logs)) {
                setLogs((prevLogs) => ({
                    ...prevLogs,
                    [panelName]: data.logs,
                }));
            } else {
                console.warn('Invalid log data received:', data);
                setLogs((prevLogs) => ({
                    ...prevLogs,
                    [panelName]: [],
                }));
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
            setLogs((prevLogs) => ({
                ...prevLogs,
                [panelName]: [],
            }));
        }
    };

    return (
        <WebSocketContext.Provider
            value={{ socket, isConnected, panelStatus, logs, isAnyPanelInDysfunction, fetchLogsForPanel }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};
