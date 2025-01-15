import React, { useEffect, useState } from 'react';
import websocketClient from './websocketClient';

const WebSocketComponent = () => {
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // Register a listener for WebSocket messages
        const handleMessage = (data) => {
            setMessage(data);
        };

        websocketClient.addMessageListener(handleMessage);

        // Cleanup the listener on component unmount
        return () => {
            websocketClient.removeMessageListener(handleMessage);
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div>
            <h1>WebSocket Component</h1>
            {message && <p>Received: {JSON.stringify(message)}</p>}
        </div>
    );
};

export default WebSocketComponent;
