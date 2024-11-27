// src/components/PanelControl.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './PanelControl.css';
import ConfirmationModal from './Reusable/ConfirmationModal';
import PanelInfo from './Reusable/PanelInfo';
import PanelStatusIndicator from './Reusable/PanelStatusIndicator';
import Button from './Reusable/Button'; // Import the Button component
import { useSelector, useDispatch } from 'react-redux';
import { sendInstructionMessage } from '../../utils/messageUtils';
import { fetchLogsForPanel } from '../../actions/websocketActions';
import { toast } from 'react-toastify';

const PanelControl = ({ name }) => {
    const dispatch = useDispatch();
    const panelInfo = useSelector((state) => state.websocket.panelStatus[name]);
    const logs = useSelector((state) => state.websocket.logs[name] || []);
    const isAnyPanelInDysfunction = useSelector(
        (state) => state.websocket.isAnyPanelInDysfunction
    );
    const role = useSelector((state) => state.auth.role);
    const permissions = useSelector((state) => state.auth.permissions);

    // State variables
    const [pendingState, setPendingState] = useState(null);
    const [showRebootModal, setShowRebootModal] = useState(false);
    const [isRebooting, setIsRebooting] = useState(false);
    const [displayMode, setDisplayMode] = useState(1);

    const isLoading = !panelInfo;

    // Function to get display name
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

    useEffect(() => {
        dispatch(fetchLogsForPanel(name));

        // Set up interval to fetch logs every 3 seconds
        const interval = setInterval(() => {
            dispatch(fetchLogsForPanel(name));
        }, 3000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(interval);
        };
    }, [dispatch, name]);

    useEffect(() => {
        if (pendingState && panelInfo) {
            if (
                (pendingState === 'on' && (panelInfo.state || '').toLowerCase() === 'on') ||
                (pendingState === 'off' && (panelInfo.state || '').toLowerCase() === 'off') ||
                (pendingState === 'refresh') ||
                (pendingState === 'reboot' && (panelInfo.state || '').toLowerCase() === 'rebooting')
            ) {
                setPendingState(null);
                toast.success(`Action "${pendingState}" terminée avec succès sur ${getDisplayName(name)}.`);
            }
        }

        if (panelInfo && (panelInfo.state || '').toLowerCase() === 'rebooting') {
            setIsRebooting(true);
        } else {
            setIsRebooting(false);
        }
    }, [panelInfo, pendingState, name, getDisplayName]);

    const imageSrc = useMemo(() => {
        const imageMap = {
            aval: 'fleche-i-c.png',
            amont: 'fleche-c.png',
            indret: 'fleche-c.png',
        };
        return imageMap[name] || '';
    }, [name]);

    const handlePanelInfoClick = useCallback(() => {
        setDisplayMode((prevMode) => (prevMode + 1) % 3);
    }, []);

    const handlePanelInfoRightClick = useCallback((e) => {
        e.preventDefault();
        setDisplayMode((prevMode) => (prevMode - 1 + 3) % 3);
    }, []);

    const getClassByState = (panelInfo, isLoading) => {
        if (isLoading) return 'loading';
        if (!panelInfo) return 'not-connected';
        if (panelInfo.state === 'rebooting') return 'rebooting';
        if (panelInfo.maintenanceMode) return 'maintenance';
        if (!panelInfo.connected || panelInfo.sectorStatus === false) return 'dysfunction';
        if (panelInfo.isDoorOpen) return 'door-open';
        if (panelInfo.state === 'off') return 'dark';
        if (panelInfo.state === 'on') return 'bright';
        return 'not-connected';
    };

    const cardClass = useMemo(
        () =>
            `panel-control ${getClassByState(panelInfo, isLoading)} ${
                panelInfo && panelInfo.problem ? 'problem' : ''
            }`,
        [panelInfo, isLoading]
    );

    const shouldDisplayButtons =
        panelInfo &&
        panelInfo.sectorStatus !== false &&
        panelInfo.connected &&
        permissions &&
        !isLoading &&
        !isRebooting &&
        !isAnyPanelInDysfunction;

    const sendInstruction = (instruction) => {
        sendInstructionMessage({
            instruction,
            role,
            name,
        });
        setPendingState(instruction);
        toast.info(`Action "${instruction}" initiée sur ${getDisplayName(name)}.`);

        if (instruction === 'reboot') {
            setIsRebooting(true);
        }
    };

    return (
        <div className={cardClass}>
            {isLoading ? (
                <div className="loading-content">
                    <h3>{getDisplayName(name)}</h3>
                    <img src={imageSrc} alt={`${name} indicator`} className="panel-image" />
                    <div className="door-open-banner">CHARGEMENT...</div>
                </div>
            ) : (
                <>
                    <PanelStatusIndicator
                        isConnected={panelInfo.connected ?? true}
                        isRebooting={isRebooting}
                        maintenanceMode={panelInfo.maintenanceMode ?? false}
                        sectorStatus={panelInfo.sectorStatus ?? false}
                        state={panelInfo.state ?? 'unknown'}
                        isDoorOpen={panelInfo.isDoorOpen ?? false}
                        problem={panelInfo.problem ?? false}
                        status={panelInfo.state ?? 'unknown'}
                        pendingState={pendingState} // Pass pendingState here
                    />

                    <PanelInfo
                        name={name}
                        displayMode={displayMode}
                        imageSrc={imageSrc}
                        handlePanelInfoClick={handlePanelInfoClick}
                        handlePanelInfoRightClick={handlePanelInfoRightClick}
                    />

                    {/* Use the Button component, display only icons */}
                    {shouldDisplayButtons && (
                        <div className="button-group">
                            {permissions.canStartIndividualPanel && (
                                <Button
                                    className={`start-button ${
                                        pendingState === 'on' ? 'blinking' : ''
                                    } ${panelInfo.state === 'on' ? 'active-green' : ''}`}
                                    onClick={() => sendInstruction('on')}
                                    disabled={panelInfo.state === 'on' || pendingState === 'on'}
                                >
                                    <span className="material-icons">tv</span>
                                </Button>
                            )}
                            {permissions.canShutdownIndividualPanel && (
                                <Button
                                    className={`stop-button ${
                                        pendingState === 'off' ? 'blinking' : ''
                                    } ${panelInfo.state === 'off' ? 'active-dark-red' : ''}`}
                                    onClick={() => sendInstruction('off')}
                                    disabled={panelInfo.state === 'off' || pendingState === 'off'}
                                >
                                    <span className="material-icons">tv_off</span>
                                </Button>
                            )}
                            {permissions.canRefreshIndividualPanel && (
                                <Button
                                    className={`refresh-button ${
                                        pendingState === 'refresh' ? 'blinking' : ''
                                    } ${pendingState === 'refresh' ? 'active-blue' : ''}`}
                                    onClick={() => sendInstruction('refresh')}
                                    disabled={pendingState === 'refresh'}
                                >
                                    <span className="material-icons">refresh</span>
                                </Button>
                            )}
                            {permissions.canRebootIndividualPanel && (
                                <Button
                                    className={`restart-button ${
                                        pendingState === 'reboot' ? 'blinking' : ''
                                    } ${isRebooting ? 'active-orange' : ''}`}
                                    onClick={() => setShowRebootModal(true)}
                                    disabled={pendingState === 'reboot' || isRebooting}
                                >
                                    <span className="material-icons">restart_alt</span>
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Confirmation Modal for reboot action */}
                    <ConfirmationModal
                        show={showRebootModal}
                        onConfirm={() => {
                            sendInstruction('reboot');
                            setIsRebooting(true);
                            setShowRebootModal(false);
                        }}
                        onCancel={() => setShowRebootModal(false)}
                        message={`Êtes-vous sûr de vouloir redémarrer ${getDisplayName(name)} ?`}
                    />
                </>
            )}
        </div>
    );
};

export default PanelControl;
