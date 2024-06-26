import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext';
import './PanelControl.css';

const PanelControl = ({ name, heartbeatTimer }) => {
  const { socket, panelStatus } = useWebSocket();
  const [pendingState, setPendingState] = useState(null);

  useEffect (() => {
    if (pendingState) {
      setPendingState(null);
    }
  }, [panelStatus, pendingState]);


  let imageSrc;
  if (name === "aval") {
    imageSrc = "fleche-i-c.png";
  } else if (name === "amont" || name === "indret") {
    imageSrc = "fleche-c.png";
  }



   // Early check if panel data exists
   if (!panelStatus || !panelStatus[name]) {
    return (
      <div className="panel-control connection-problem">
        <h3>{name}</h3>
        <img src={imageSrc} alt={`${name} indicator`} />
      {<div className="door-open-banner">CONNEXION AVEC {name.toUpperCase()} EN COURS...</div>}
      </div>
    );
  }

  const panelInfo = panelStatus ? panelStatus[name] : null;
  const isConnected = panelInfo ? panelInfo.connected === true : false;
  const status = isConnected ? (panelInfo.state === "on" ? "on" : "off") : "not-connected";
  const state = panelInfo.state ;
  const cpuTemp = panelInfo.cpuTemp;
  const isDoorOpen = panelInfo.isDoorOpen;
  const sectorStatus = panelInfo.sectorStatus ;
  const maintenanceMode =  panelInfo.maintenanceMode;
  const problem = panelInfo.problem ;
  const lastHeartbeat =  panelInfo.lastHeartbeat;
  const lastHeartbeatTimestamp = panelInfo.lastHeartbeatTimestamp;


  const sendInstruction = (instruction) => {
    if (socket) {
      const message = {
        type: "instruction",
        to: "panel",
        name: name,
        instruction: instruction,
        heartbeatTimer: heartbeatTimer  // Envoyer la valeur du timer
      };
      socket.send(JSON.stringify(message));
      setPendingState(instruction);
    }
  };



  const getClassByState = () => {
    if (maintenanceMode) return "maintenance";
    if (!isConnected || !sectorStatus) return "dysfunction";
    if (isDoorOpen) return "door-open";
    if (status === "not-connected") return "red";
    if (state === "off") return "dark";
    if (state === "on") return "bright";
  };

  const cardClass = `panel-control ${getClassByState()} ${problem ? 'problem' : ''}`;

  
  const isBlinking = (action) => pendingState === action;



  return (
    <div className={cardClass}>
      <h3>
        {name} <span className={status === "on" ? "green-circle" : "red-circle"}>●</span>
      </h3>
      {maintenanceMode && <div className="maintenance-banner">MODE MAINTENANCE</div>}
      {(!isConnected || !sectorStatus) && <div className="dysfunction-banner">DYSFONCTIONNEMENT</div>}
      {(!isConnected) && <div className="dysfunction-banner">CONNEXION {name.toUpperCase()} PERDUE</div>}
      {!sectorStatus && isConnected && <div className="dysfunction-banner">ALIMENTATION DEFAILLANTE</div>}
      {lastHeartbeat > heartbeatTimer * 2 && <div className="dysfunction-banner">ATTENTION LATENCE</div>}

      {isDoorOpen && <div className="door-open-banner">PORTE OUVERTE</div>}
      {panelInfo  && (
        
        <div className="panel-info">
          <img
            src={imageSrc}
            alt={`${name} indicator`}
            className={state === "on" ? '' : 'greyed-out'}
          />
          <p><strong>Last Heartbeat:</strong> {lastHeartbeat}</p>
          <p><strong>Timestamp:</strong> {lastHeartbeatTimestamp}</p>
          <p><strong>State:</strong> {state}</p>
          <p><strong>CPU Temp:</strong> {cpuTemp} °C</p>
          <p><strong>Door Open:</strong> {isDoorOpen ? "Yes" : "No"}</p>
          <p><strong>Sector Status:</strong> {sectorStatus ? "Active" : "Inactive"}</p>
          <p><strong>Maintenance Mode:</strong> {maintenanceMode ? "Yes" : "No"}</p>
        </div>
      )}
      {isConnected && !maintenanceMode && (
        <div className="button-group">
          <button
            className={`btn ${state === 'on' ? 'btn-green-active' : 'btn-green'} ${isBlinking('on') ? 'blinking-text-green' : ''}`}
            onClick={() => sendInstruction('on')}
          >
            Allumage
          </button>
          <button
            className={`btn ${state === 'off' ? 'btn-red-active' : 'btn-red'} ${isBlinking('off') ? 'blinking-text-red' : ''}`}
            onClick={() => sendInstruction('off')}
          >
            Extinction
          </button>
        </div>
      )}
    </div>
  );
};

export default PanelControl;
