import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';
import './PanelControl.css';

const AllPanel = () => {
  const { socket, panelStatus } = useWebSocket();
  const [pendingState, setPendingState] = useState(null);

  const sendInstruction = (instruction) => {
    if (socket) {
      const message = {
        type: "instruction",
        to: "panel",
        name: "all",
        instruction: instruction
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
