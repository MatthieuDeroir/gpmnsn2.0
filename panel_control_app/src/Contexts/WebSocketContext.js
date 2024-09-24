import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [panelStatus, setPanelStatus] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [latency, setLatency] = useState(null);
    const [isAnyPanelInDysfunction, setIsAnyPanelInDysfunction] = useState(false);
    let startTime = 0;

    useEffect(() => {
        let ws;
        let latencyInterval;

        const connectWebSocket = () => {
            if (ws) {
                ws.close()
            }

            ws = new WebSocket('ws://100.122.230.86:8080');

            ws.onopen = () => {
                console.log('WebSocket connected');
                setIsConnected(true);

                // Send the registration only once when connected
                ws.send(JSON.stringify({ type: "register", clientType: "user", name: "user" }));
            };

            ws.onmessage = (message) => {
                console.log('WebSocket message', message.data);
                const data = JSON.parse(message.data);
                if (data.type === 'pong') {
                    setLatency(Date.now() - startTime);
                } else if (data.type === 'status') {
                    const statusUpdate = {
                        amont: data.panelStatus.amont || { connected: false },
                        aval: data.panelStatus.aval || { connected: false },
                        indret: data.panelStatus.indret || { connected: false }
                    };
                    setPanelStatus(statusUpdate);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected. Attempting to reconnect...');
                setIsConnected(false);
                clearInterval(latencyInterval);

                // Delay before reconnecting to avoid creating too many connections in a short time
                setTimeout(connectWebSocket, 3000); // Attempt to reconnect after 3 seconds
            };

            ws.onerror = (error) => {
                console.log('WebSocket error', error);
            };

            setSocket(ws);
        };

        connectWebSocket(); // Connect when the component mounts

        return () => {
            if (ws) {
                ws.close(); // Clean up the WebSocket connection when the component unmounts
            }
            clearInterval(latencyInterval); // Clear the interval when the component unmounts
        };
    }, []);

    useEffect(() => {
        const checkDysfunction = () => {
            const panelsToCheck = ['amont', 'aval', 'indret'];
            const dysfunction = panelsToCheck.some(panelKey => {
                const panel = panelStatus[panelKey];
                return panel ? (!panel.connected || !panel.sectorStatus) : false;
            });
            setIsAnyPanelInDysfunction(dysfunction);
        };
        checkDysfunction();
    }, [panelStatus]);

    return (
        <WebSocketContext.Provider value={{ socket, panelStatus, isConnected, latency, isAnyPanelInDysfunction }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);


