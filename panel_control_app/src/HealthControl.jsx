import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';
import Switch from 'react-switch';

const HealthControl = ({  }) => {
    const { socket, panelStatus, isConnected } = useWebSocket();
    const [pendingState, setPendingState] = useState(null);

  
    return (
  
      <div>
        Connected to WebSocket : {isConnected ? "yes" : "no"}
      </div>
    );
};

export default HealthControl;
