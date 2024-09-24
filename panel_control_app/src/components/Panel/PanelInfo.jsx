import React from 'react';

const PanelInfo = ({ name, displayMode, state, cpuTemp, isDoorOpen, sectorStatus, maintenanceMode, lastHeartbeat, lastHeartbeatTimestamp, imageSrc, handlePanelInfoClick, handlePanelInfoRightClick }) => {
    return (
        <div 
            className={`panel-info ${state === 'on' ? 'blinking-green' : ''}`} 
            onClick={handlePanelInfoClick}
            onContextMenu={handlePanelInfoRightClick}
        >
            {displayMode === 0 ? (
                <>
                    <h3 style={{ backgroundColor: 'e4e4e4' }}>{name.toUpperCase()}</h3>
                    <img src={imageSrc} alt={`${name} indicator`} className={state === "on" ? '' : 'greyed-out'} />
                </>
            ) : displayMode === 1 ? (
                <>
                    <h3 style={{ backgroundColor: 'e4e4e4' }}>{name.toUpperCase()}</h3>
                    <img src={imageSrc} alt={`${name} indicator`} className={state === "on" ? '' : 'greyed-out'} />
                    <p data-label="Last Heartbeat:">{lastHeartbeat !== null ? lastHeartbeat : '0'}</p>
                    <p data-label="Timestamp:">{lastHeartbeatTimestamp}</p>
                    <p data-label="State:">{state}</p>
                    <p data-label="CPU Temp:">{`${cpuTemp} °C`}</p>
                    <p data-label="Door Open:">{isDoorOpen ? "Yes" : "No"}</p>
                    <p data-label="Sector Status:">{sectorStatus ? "Active" : "Inactive"}</p>
                    <p data-label="Maintenance Mode:">{maintenanceMode ? "Yes" : "No"}</p>
                </>
            ) : (
                <h3 style={{ backgroundColor: 'e4e4e4' }}>{name.toUpperCase()}</h3>
            )}
        </div>
    );
};

export default PanelInfo;
