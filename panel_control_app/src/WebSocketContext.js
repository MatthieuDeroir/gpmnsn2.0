import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);
const RECONNECT_INTERVAL = 1000; // 5 seconds

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [panelStatus, setPanelStatus] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let ws;

        const connectWebSocket = () => {
            ws = new WebSocket('ws://localhost:8080'); // Replace with your WebSocket server address

            ws.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);
                ws.send(JSON.stringify({ type: 'register', clientType: 'user', name: 'frontend' }));
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected. Attempting to reconnect in 5 seconds...');
                setIsConnected(false);
                setTimeout(connectWebSocket, RECONNECT_INTERVAL);
            };

            ws.onerror = (error) => {
                console.log('WebSocket error', error);
            };

            ws.onmessage = (message) => {
                const data = JSON.parse(message.data);
                if (data.type === 'status') {
                    setPanelStatus(data.panelStatus);
                }
            };

            setSocket(ws);
        };

        connectWebSocket();

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket, panelStatus }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
