import React from 'react';

const PanelStatusIndicator = ({ isConnected, isRebooting, maintenanceMode, sectorStatus, state, isDoorOpen, problem, status }) => {
    return (
        <>
            <h3 className='status'>
                <span className={status === "on" ? "green-circle" : "red-circle"}>
                    ●●●
                </span>
            </h3>
            {maintenanceMode && <div className="maintenance-banner">MODE MAINTENANCE</div>}
            {!isConnected && isRebooting && <div className="rebooting-banner">EN COURS DE REDÉMARRAGE</div>}
            {!isConnected && !isRebooting && <div className="dysfunction-banner">CONNEXION PERDUE</div>}
            {!sectorStatus && isConnected && <div className="dysfunction-banner">ALIMENTATION DEFAILLANTE</div>}
            {state === "on" && <div className="on-banner">EN MARCHE</div>}
            {state === "off" && <div className="off-banner">À L'ARRÊT</div>}
            {isDoorOpen && <div className="door-open-banner">PORTE OUVERTE</div>}
        </>
    );
};

export default PanelStatusIndicator;
