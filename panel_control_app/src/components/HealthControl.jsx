import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../Contexts/WebSocketContext';
import './HealthControl.css';

const HealthControl = () => {
  const { isConnected } = useWebSocket();
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    const checkServices = async () => {
      // Check Backend Service
      try {
        const backendResponse = await fetch(`http://localhost:4000`);
        setBackendStatus(backendResponse.ok);
      } catch (error) {
        setBackendStatus(false);
      }
    };

    checkServices();
  }, []);

  return (
    <div className="health-status">
      <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        WebSocket Connection: {isConnected ? 'Connected' : 'Disconnected'}
      </span>
        <span className={`connection-status ${backendStatus ? 'up' : 'down'}`}>
          Backend Service: {backendStatus ? 'Up' : 'Down'}
        </span>
    </div>
  );
};

export default HealthControl;
