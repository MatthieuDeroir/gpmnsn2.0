// src/components/AllPanel.jsx

import React, { useState, useEffect, useCallback } from 'react';
import './AllPanel.css';
import ConfirmationModal from './Reusable/ConfirmationModal';
import { useSelector, useDispatch } from 'react-redux';
import { sendInstructionMessage } from '../../utils/messageUtils';
import Button from './Reusable/Button';
import { toast } from 'react-toastify';
import { setPendingState, clearPendingState } from '../../actions/panelActions';

const AllPanel = () => {
    const dispatch = useDispatch();
    const role = useSelector((state) => state.auth.role);
    const permissions = useSelector((state) => state.auth.permissions);
    const panelStatus = useSelector((state) => state.websocket.panelStatus);
    const isAnyPanelInDysfunction = useSelector((state) => state.websocket.isAnyPanelInDysfunction);

    const [pendingState, setLocalPendingState] = useState(null);
    const [isRebooting, setIsRebooting] = useState(false);
    const [showRebootModal, setShowRebootModal] = useState(false);
    const [heartbeatTimer, setHeartbeatTimer] = useState(5);

    const panelNames = ['aval', 'amont', 'indret'];

    const sendInstruction = useCallback(
        (instruction) => {
            sendInstructionMessage({
                instruction,
                role,
                heartbeatTimer,
            });

            // Dispatch setPendingState for each panel
            panelNames.forEach((panelName) => {
                dispatch(setPendingState(panelName, instruction));
            });

            setLocalPendingState(instruction);
            toast.info(`Action "${instruction}" initiée sur tous les panneaux.`);
        },
        [role, heartbeatTimer, dispatch]
    );

    useEffect(() => {
        if (pendingState && panelStatus) {
            const filteredPanels = Object.entries(panelStatus).filter(([name]) =>
                panelNames.includes(name.toLowerCase())
            );

            const states = filteredPanels.map(([_, panel]) => (panel.state || '').toLowerCase());

            if (
                (pendingState === 'on' && states.every((state) => state === 'on')) ||
                (pendingState === 'off' && states.every((state) => state === 'off')) ||
                (pendingState === 'reboot' && states.every((state) => state === 'rebooting')) ||
                (pendingState === 'refresh' && !isAnyPanelInDysfunction)
            ) {
                // Clear pendingState for each panel
                panelNames.forEach((panelName) => {
                    dispatch(clearPendingState(panelName));
                });
                setLocalPendingState(null);
                setIsRebooting(false);
                toast.success(`Action "${pendingState}" terminée avec succès sur tous les panneaux.`);
            }
        }
    }, [panelStatus, pendingState, isAnyPanelInDysfunction, dispatch]);

    const getButtonClass = (instruction) => {
        if (pendingState === instruction) {
            return 'blinking'; // The clicked button blinks
        }
        return pendingState ? 'grayscale' : ''; // Other buttons become black and white when an action is pending
    };

    return (
        <div className="all-panel-container">
            <div className="all-panel-content">
                {/* Content for All Panel */}
            </div>

            {/* Fixed Bottom Navigation Bar */}
            <nav className="all-panel-bottom-nav">
                <div className="all-panel-button-group">
                    {!isAnyPanelInDysfunction && (
                        <div className="all-panel-actions">
                            {permissions.canStartMultiplePanel && (
                                <Button
                                    className={`start-button ${getButtonClass('on')}`}
                                    onClick={() => sendInstruction('on')}
                                >
                                    <span className="material-icons">tv</span>
                                    ALLUMER
                                </Button>
                            )}
                            {permissions.canShutdownMultiplePanel && (
                                <Button
                                    className={`stop-button ${getButtonClass('off')}`}
                                    onClick={() => sendInstruction('off')}
                                >
                                    <span className="material-icons">tv_off</span>
                                    ÉTEINDRE
                                </Button>
                            )}
                            {permissions.canRefreshMultiplePanel && (
                                <Button
                                    className={`refresh-button ${getButtonClass('refresh')}`}
                                    onClick={() => sendInstruction('refresh')}
                                >
                                    <span className="material-icons">refresh</span>
                                    RAFRAÎCHIR
                                </Button>
                            )}
                            {permissions.canRebootMultiplePanel && (
                                <Button
                                    className={`restart-button ${getButtonClass('reboot')}`}
                                    onClick={() => setShowRebootModal(true)}
                                >
                                    <span className="material-icons">restart_alt</span>
                                    REDÉMARRER
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* Confirmation Modal */}
            <ConfirmationModal
                show={showRebootModal}
                onConfirm={() => {
                    sendInstruction('reboot');
                    setIsRebooting(true);
                    setShowRebootModal(false);
                }}
                onCancel={() => setShowRebootModal(false)}
                message="Êtes-vous sûr de vouloir redémarrer?"
            />
        </div>
    );
};

export default AllPanel;
