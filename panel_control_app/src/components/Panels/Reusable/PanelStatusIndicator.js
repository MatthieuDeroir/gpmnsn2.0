// src/components/PanelStatusIndicator.jsx

import React from 'react';
import './PanelStatusIndicator.css'; // Import the CSS file

const PanelStatusIndicator = ({
    isConnected,
    isRebooting,
    maintenanceMode,
    sectorStatus,
    state,
    isDoorOpen,
    problem,
    status,
  }) => {
    return (
      <>
        <h3 className="panel-status-title">
          <span className={status === 'on' ? 'panel-status-green-circle' : 'panel-status-red-circle'}>
            ●●●
          </span>
        </h3>
        {maintenanceMode && (
          <div className="panel-status-banner panel-status-maintenance-banner">MODE MAINTENANCE</div>
        )}
        {isRebooting && (
          <div className="panel-status-banner panel-status-rebooting-banner">EN COURS DE REDÉMARRAGE</div>
        )}
        {!isConnected && !isRebooting && (
          <div className="panel-status-banner panel-status-dysfunction-banner">CONNEXION PERDUE</div>
        )}
        {!sectorStatus && isConnected && (
          <div className="panel-status-banner panel-status-dysfunction-banner">ALIMENTATION DÉFAILLANTE</div>
        )}
        {state === 'on' && (
          <div className="panel-status-banner panel-status-on-banner">EN MARCHE</div>
        )}
        {state === 'off' && (
          <div className="panel-status-banner panel-status-off-banner">À L'ARRÊT</div>
        )}
        {isDoorOpen && (
          <div className="panel-status-banner panel-status-door-open-banner">PORTE OUVERTE</div>
        )}
      </>
    );
  };
  

export default PanelStatusIndicator;
