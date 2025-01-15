// src/components/HealthControl.js
import React, { useEffect, useState } from 'react';
import websocketClient from '../../utils/websocketClient';
import './HealthControl.css';

const HealthControl = ({ onBackendStatusChange }) => {
    const [isConnected, setIsConnected] = useState(websocketClient.isConnected);
    const [backendStatus, setBackendStatus] = useState(null);

    useEffect(() => {
        // Function to check backend status
        const checkBackendStatus = async () => {
            try {
                const backendResponse = await fetch(`http://localhost:4000`);
                const status = backendResponse.ok;
                setBackendStatus(status);
                onBackendStatusChange(status); // Notify parent component (App.js)
            } catch (error) {
                setBackendStatus(false);
                onBackendStatusChange(false); // Notify parent component (App.js)
            }
        };

        // Function to check WebSocket connection status
        const checkWebSocketStatus = () => {
            setIsConnected(websocketClient.isConnected);
        };

        // Initial check when the component mounts
        checkBackendStatus();
        checkWebSocketStatus();

        // Periodically check every 5 seconds
        const intervalId = setInterval(() => {
            checkBackendStatus();
            checkWebSocketStatus();
        }, 5000);

        // Cleanup interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [onBackendStatusChange]);

    return (
        <div className="health-status">
            <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                WebSocket: {isConnected ? 'UP' : 'DOWN'}
            </span>
            <span className={`connection-status ${backendStatus ? 'up' : 'down'}`}>
                API: {backendStatus ? 'UP' : 'DOWN'}
            </span>
        </div>
    );
};

export default HealthControl;
