// src/components/Panel/PanelInfo.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PanelInfo.css';

const PanelInfo = ({
    name,
    displayMode,
    panelInfo,
    logs,
    imageSrc,
    handlePanelInfoClick,
    handlePanelInfoRightClick
}) => {
    const parseLogEntry = (log) => {
        console.log(log);
        if (!log || typeof log !== 'string') {
            return {
                timestamp: 'Invalid',
                identifier: 'Unknown',
                event: 'Unknown',
                details: {},
            };
        }

        const [timestamp, identifier, event, ...rest] = log.split(',');

        const details = rest.join(',').split(',').reduce((acc, keyValuePair) => {
            const [key, value] = keyValuePair.split('=');
            acc[key.trim()] = value ? value.trim() : 'Unknown';
            return acc;
        }, {});

        return {
            timestamp,
            event,
            details,
        };
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
    };

    // Variantes pour les animations
    const variants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <div
            className={`panel-info ${panelInfo.state === 'on' ? 'blinking-green' : ''}`}
            onClick={handlePanelInfoClick}
            onContextMenu={handlePanelInfoRightClick}
        >
            <h3>{name.toUpperCase()}</h3>

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
                            className={panelInfo.state === 'on' ? '' : 'greyed-out'}
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
                            className={panelInfo.state === 'on' ? '' : 'greyed-out'}
                        />
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
                                    <td>{panelInfo.lastHeartbeatTimestamp}</td>
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
                                    <td>{panelInfo.sectorStatus ? 'Actif' : 'Inactif'}</td>
                                </tr>
                                <tr>
                                    <th>Mode Maintenance :</th>
                                    <td>{panelInfo.maintenanceMode ? 'Oui' : 'Non'}</td>
                                </tr>
                            </tbody>
                        </table>
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
                                            <th>Date</th>
                                            <th>Event</th>
                                            <th>Status</th>
                                            <th>État</th>
                                            <th>Secteur</th>
                                            <th>Porte</th>
                                            <th>Maintenance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log, index) => {
                                            const { timestamp, details } = parseLogEntry(log);

                                            // Définir la classe de ligne en fonction des conditions
                                            let rowClass = '';
                                            if (details.state === 'on') {
                                                rowClass = 'panel-info-log-green'; // Vert pour "on"
                                            } else if (details.sectorStatus === 'false') {
                                                rowClass = 'panel-info-log-red'; // Rouge pour secteur inactif
                                            } else if (details.maintenanceMode === 'true') {
                                                rowClass = 'panel-info-log-orange'; // Orange pour mode maintenance
                                            } else if (details.instruction === 'refresh') {
                                                rowClass = 'panel-info-log-blue'; // Bleu pour rafraîchir
                                            } else if (details.instruction === 'reboot') {
                                                rowClass = 'panel-info-log-orange'; // Orange pour redémarrer
                                            }

                                            return (
                                                <tr key={index} className={rowClass}>
                                                    <td>{formatDate(timestamp)}</td>
                                                    <td>{details.event}</td>
                                                    <td>{details.status}</td>
                                                    <td>{details.state === 'on' ? 'Allumé' : details.state === 'off' ? 'Éteint' : details.state}</td>
                                                    <td>{details.sectorStatus === 'true' ? 'Actif' : details.sectorStatus === 'false' ? 'Inactif' : ''}</td>
                                                    <td>{details.isDoorOpen === 'true' ? 'Ouverte' : 'Fermée'}</td>
                                                    <td>{details.maintenanceMode === 'true' ? 'Oui' : 'Non'}</td>
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
