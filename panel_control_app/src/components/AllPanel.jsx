import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../Contexts/WebSocketContext';
import './Panel/PanelControl.css';
import { useAuth } from '../Contexts/AuthorizationContext';
import ConfirmationModal from './ConfirmationModal';

const AllPanel = ({ heartbeatTimer, setHeartbeatTimer }) => {
  const { socket, panelStatus, isAnyPanelInDysfunction } = useWebSocket();
  const [pendingState, setPendingState] = useState(null);
  const [isRebooting, setIsRebooting] = useState(false);
  const [showRebootModal, setShowRebootModal] = useState(false);
  const { role, setRole, permissions } = useAuth();

  const sendInstruction = (instruction) => {
    if (socket) {
      const message = {
        type: "instruction",
        to: "panel",
        name: "all",
        from: role,
        instruction: instruction,
        heartbeatTimer: heartbeatTimer,
      };
      socket.send(JSON.stringify(message));
      setPendingState(instruction);
    }
  };

  const reboot = () => {
    if (socket) {
      const message = {
        type: "reboot",
        to: "panel",
        name: "all",
        from: role,
        heartbeatTimer: heartbeatTimer,
      };
      socket.send(JSON.stringify(message));
      setPendingState('reboot');
      setIsRebooting(true);
    }
  };

  const refresh = () => {
    if (socket) {
      const message = {
        type: "refresh",
        to: "panel",
        name: "all",
        from: role,
        heartbeatTimer: heartbeatTimer,
      };
      socket.send(JSON.stringify(message));
      setPendingState('refresh');
    }
  };

  const isBlinking = (action) => pendingState === action;

  useEffect(() => {
    if (pendingState) {
      setPendingState(null);
    }
  }, [panelStatus]);

  return (
    <div className="">
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
        {!isAnyPanelInDysfunction ? (
          <div >
            {permissions.canStartMultiplePanel ? (
              <button
                className={`btn start-button btn-green ${isBlinking('on') ? 'blinking-text-green' : ''}`}
                onClick={() => sendInstruction('on')}
              >
                <span className="material-icons">tv</span>
              </button>
            ) : null}
            {permissions.canShutdownMultiplePanel ? (
              <button
                className={`btn stop-button btn-red ${isBlinking('off') ? 'blinking-text-red' : ''}`}
                onClick={() => sendInstruction('off')}
              >
                <span className="material-icons">tv_off</span>
              </button>
            ) : null}
            
          </div>
        ) : null}
        <div >
          {permissions.canRefreshMultiplePanel ? (
            <button
              className={`btn refresh-button btn-blue ${isBlinking('refresh') ? 'blinking-text-blue' : ''}`}
              onClick={refresh}
            >
              <span className="material-icons">refresh</span>
            </button>
          ) : null}
       {permissions.canRebootMultiplePanel ? (
            <button
              className={`btn restart-button btn-orange ${isBlinking('reboot') ? 'blinking-text-orange' : ''}`}
              onClick={() => setShowRebootModal(true)}
            >
              <span className="material-icons">restart_alt</span>
            </button>
          ) : null}
        </div>
      </div>
      <div className="button-group">
        <div>
      
            </div>
            <button onClick={() => setRole('Visualisation')}>Switch to Visualisation</button>
            <button onClick={() => setRole('Operateur')}>Switch to Operateur</button>
            <button onClick={() => setRole('Maintenance')}>Switch to Maintenance</button>
            <span>current Role : {role}</span>
      </div>
      <ConfirmationModal 
        show={showRebootModal} 
        onConfirm={() => {
          sendInstruction('off')
          reboot();
          setIsRebooting(true);
          setShowRebootModal(false);
        }} 
        onCancel={() => setShowRebootModal(false)} 
        message="Are you sure you want to reboot?"
      />
    </div>
  );
};

export default AllPanel;
