import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';
import './PanelControl.css';

const AllPanel = ({ heartbeatTimer, setHeartbeatTimer}) => {
  const { socket, panelStatus } = useWebSocket();
  const [pendingState, setPendingState] = useState(null);

  const sendInstruction = (instruction) => {
    if (socket) {
      const message = {
        type: "instruction",
        to: "panel",
        name: "all",
        instruction: instruction,
        heartbeatTimer: heartbeatTimer,
      };
      socket.send(JSON.stringify(message));
      setPendingState(instruction);
    }
  };

  const isBlinking = (action) => pendingState === action;

  useEffect(() => {
    if (pendingState) {
      setPendingState(null);
    }
  }, [panelStatus]);

  return (
    <div className="panel-control">
       <label>
                    Set Global Heartbeat Timer (seconds):
                    <input
                        type="number"
                        value={heartbeatTimer}
                        onChange={(e) => setHeartbeatTimer(Number(e.target.value))}
                        min="1"
                    />
                </label>
      <div className="button-group">
     
        <button
          className={`btn btn-green ${isBlinking('on') ? 'blinking-text-green' : ''}`}
          onClick={() => sendInstruction('on')}
        >
          Allumage
        </button>
        <button
          className={`btn btn-red ${isBlinking('off') ? 'blinking-text-red' : ''}`}
          onClick={() => sendInstruction('off')}
        >
          Extinction
        </button>
      </div>
    </div>
  );
};

export default AllPanel;
