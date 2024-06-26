import React, { useState } from 'react';
import './App.css';
import { WebSocketProvider } from './WebSocketContext';
import PanelControl from './PanelControl';
import HealthControl from './HealthControl';
import AllPanel from './AllPanel';

function App() {
    const [heartbeatTimer, setHeartbeatTimer] = useState(15); // Initial state for the heartbeat timer

    return (
        <WebSocketProvider>
            <div className="App">
                <h1>Panel Control</h1>
                <div className="health-controls">
                    <HealthControl />
                </div>
                <div className="panel-controls">
                    <PanelControl name="indret" heartbeatTimer={heartbeatTimer} />
                    <PanelControl name="aval" heartbeatTimer={heartbeatTimer} />
                    <PanelControl name="amont" heartbeatTimer={heartbeatTimer} />
                </div>
                <div className="all-control">
                    <AllPanel heartbeatTimer={heartbeatTimer} setHeartbeatTimer={setHeartbeatTimer} />
                </div>
            </div>
        </WebSocketProvider>
    );
}

export default App;
