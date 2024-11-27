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
                                  pendingState, // New prop
                              }) => {
    return (
        <>
            {/* Status circles */}
            <h3 className="panel-status-title">
                <span className={status === 'on' ? 'panel-status-green-circle' : 'panel-status-red-circle'}>
                    ●●●
                </span>
            </h3>

            {/* Maintenance Mode */}
            {maintenanceMode && (
                <div className="panel-status-banner panel-status-maintenance-banner">MODE MAINTENANCE</div>
            )}

            {/* Pending Actions */}
            {pendingState === 'on' && (
                <div className="panel-status-banner panel-status-pending-banner">EN COURS D'ALLUMAGE</div>
            )}
            {pendingState === 'off' && (
                <div className="panel-status-banner panel-status-pending-banner">EN COURS D'EXTINCTION</div>
            )}
            {pendingState === 'reboot' && (
                <div className="panel-status-banner panel-status-pending-banner">EN COURS DE REDÉMARRAGE</div>
            )}
            {pendingState === 'refresh' && (
                <div className="panel-status-banner panel-status-pending-banner">EN COURS DE RAFRAÎCHISSEMENT</div>
            )}

            {/* Rebooting */}
            {isRebooting && !pendingState && (
                <div className="panel-status-banner panel-status-rebooting-banner">EN COURS DE REDÉMARRAGE</div>
            )}

            {/* Not Connected */}
            {!isConnected && !isRebooting && !pendingState && (
                <div className="panel-status-banner panel-status-dysfunction-banner">CONNEXION PERDUE</div>
            )}

            {/* Sector Status */}
            {!sectorStatus && isConnected && !pendingState && (
                <div className="panel-status-banner panel-status-dysfunction-banner">ALIMENTATION DÉFAILLANTE</div>
            )}

            {/* Panel State */}
            {state === 'on' && !pendingState && (
                <div className="panel-status-banner panel-status-on-banner">EN MARCHE</div>
            )}
            {state === 'off' && !pendingState && (
                <div className="panel-status-banner panel-status-off-banner">À L'ARRÊT</div>
            )}

            {/* Door Open */}
            {isDoorOpen && !pendingState && (
                <div className="panel-status-banner panel-status-door-open-banner">PORTE OUVERTE</div>
            )}
        </>
    );
};

export default PanelStatusIndicator;
