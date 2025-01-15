import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import './PanelInfo.css';

const PanelInfo = ({
                       name,
                       displayMode,
                       imageSrc,
                       handlePanelInfoClick,
                       handlePanelInfoRightClick,
                   }) => {
    // Access Redux state
    const panelInfo = useSelector((state) => state.websocket.panelStatus[name]);
    const logs = useSelector((state) => state.websocket.logs[name] || []);

    const getDisplayName = useCallback((name) => {
        const upperName = name.toUpperCase();
        if (upperName === 'AVAL') {
            return 'UB AVAL';
        } else if (upperName === 'AMONT') {
            return 'UB AMONT';
        } else {
            return upperName;
        }
    }, []);

    // Extract eventType and timestamp from the log
    const parseLogEntry = (log) => {
        if (!log || typeof log !== 'object') {
            return {
                timestamp: 'Invalid',
                eventType: 'Unknown',
            };
        }
        const { timestamp, eventType } = log;
        return {
            timestamp,
            eventType,
        };
    };

    // Format time only
    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
    };

    // Variants for animations
    const variants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    // Display logs with the most recent first
    const recentLogs = logs.slice(-20);

    return (
        <div
            className={`panel-info ${panelInfo && panelInfo.state === 'on' ? 'blinking-green' : ''}`}
            onClick={handlePanelInfoClick}
            onContextMenu={handlePanelInfoRightClick}
        >
            <h3>{getDisplayName(name)}</h3>

            <AnimatePresence mode="wait">
                {displayMode === 0 && (
                    <motion.div
                        key="mode0"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={variants}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="display-mode display-mode-0"
                    >
                        <img
                            src={imageSrc}
                            alt={`${name} indicator`}
                            className={panelInfo && panelInfo.state === 'on' ? '' : 'greyed-out'}
                        />
                    </motion.div>
                )}

                {displayMode === 1 && (
                    <motion.div
                        key="mode1"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={variants}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="display-mode display-mode-1"
                    >
                        <img
                            src={imageSrc}
                            alt={`${name} indicator`}
                            className={panelInfo && panelInfo.state === 'on' ? '' : 'greyed-out'}
                        />
                        {panelInfo ? (
                            <table className="info-table">
                                <tbody>
                                <tr>
                                    <th>Dernier Heartbeat :</th>
                                    <td>{panelInfo.lastHeartbeat || '0'}</td>
                                </tr>
                                <tr>
                                    <th>Connexion :</th>
                                    <td>{panelInfo.connected ? 'Connecté' : 'Déconnecté'}</td>
                                </tr>
                                <tr>
                                    <th>Timestamp :</th>
                                    <td>{formatTime(panelInfo.lastHeartbeatTimestamp)}</td>
                                </tr>
                                <tr>
                                    <th>État :</th>
                                    <td>{panelInfo.state === 'on' ? 'Allumé' : 'Éteint'}</td>
                                </tr>
                                <tr>
                                    <th>Température CPU :</th>
                                    <td>{`${panelInfo.cpuTemp ? panelInfo.cpuTemp : 'N/A'} °C`}</td>
                                </tr>
                                <tr>
                                    <th>Porte Coffret :</th>
                                    <td>{panelInfo.isDoorOpen ? 'Ouverte' : 'Fermée'}</td>
                                </tr>
                                <tr>
                                    <th>Alimentation Secteur :</th>
                                    <td>{panelInfo.sectorStatus === 'false' ? 'Inactif' : 'Actif'}</td>
                                </tr>
                                <tr>
                                    <th>Mode Maintenance :</th>
                                    <td>{panelInfo.maintenanceMode ? 'Oui' : 'Non'}</td>
                                </tr>
                                </tbody>
                            </table>
                        ) : (
                            <p>Informations du panneau non disponibles.</p>
                        )}
                    </motion.div>
                )}

                {displayMode === 2 && (
                    <motion.div
                        key="mode2"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={variants}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="display-mode display-mode-2"
                    >
                        {logs.length > 0 ? (
                            <div className="panel-info-log-table-container">
                                <table className="panel-info-log-table">
                                    <thead>
                                    <tr>
                                        <th style={{ width: '25%' }}>Heure</th>
                                        <th style={{ width: '75%' }}>Événement</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {recentLogs.map((log, index) => {
                                        const { timestamp, eventType } = parseLogEntry(log);

                                        // Display logs in reverse order (most recent at the top)
                                        return (
                                            <tr key={recentLogs.length - index}>
                                                <td>{formatTime(timestamp)}</td>
                                                <td>{eventType}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>Aucun journal disponible.</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PanelInfo;
