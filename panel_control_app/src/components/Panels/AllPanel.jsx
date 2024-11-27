// src/components/AllPanel.jsx

import React, { useState, useEffect, useCallback } from 'react';
import './AllPanel.css';
import ConfirmationModal from './Reusable/ConfirmationModal';
import { useSelector, useDispatch } from 'react-redux';
import { sendInstructionMessage } from '../../utils/messageUtils';
import { setRole } from '../../actions/authActions';
import Button from './Reusable/Button';
import { toast } from 'react-toastify';

const AllPanel = () => {
    const dispatch = useDispatch();
    const role = useSelector((state) => state.auth.role);
    const permissions = useSelector((state) => state.auth.permissions);
    const panelStatus = useSelector((state) => state.websocket.panelStatus);
    const isAnyPanelInDysfunction = useSelector((state) => state.websocket.isAnyPanelInDysfunction);

    const [pendingState, setPendingState] = useState(null);
    const [isRebooting, setIsRebooting] = useState(false);
    const [showRebootModal, setShowRebootModal] = useState(false);
    const [heartbeatTimer, setHeartbeatTimer] = useState(5);

    const isBlinking = useCallback(
        (action) => pendingState === action,
        [pendingState]
    );

    const sendInstruction = useCallback(
        (instruction) => {
            sendInstructionMessage({
                instruction,
                role,
                heartbeatTimer,
            });
            setPendingState(instruction);
            toast.info(`Action "${instruction}" initiée sur tous les panneaux.`);
        },
        [role, heartbeatTimer]
    );

    useEffect(() => {
        if (pendingState && panelStatus) {
            const panelNames = ['aval', 'amont', 'indret'];
            const filteredPanels = Object.entries(panelStatus).filter(([name]) =>
                panelNames.includes(name.toLowerCase())
            );

            const states = filteredPanels.map(([_, panel]) => (panel.state || '').toLowerCase());

            if (
                (pendingState === 'on' && states.every(state => state === 'on')) ||
                (pendingState === 'off' && states.every(state => state === 'off')) ||
                (pendingState === 'reboot' && states.every(state => state === 'rebooting')) ||
                (pendingState === 'refresh' && !isAnyPanelInDysfunction)
            ) {
                setPendingState(null);
                setIsRebooting(false);
                toast.success(`Action "${pendingState}" terminée avec succès sur tous les panneaux.`);
            }
        }
    }, [panelStatus, pendingState, isAnyPanelInDysfunction]);

    // Determine overall panel states
    const panelNames = ['aval', 'amont', 'indret'];
    const filteredPanels = panelStatus
        ? Object.entries(panelStatus).filter(([name]) =>
            panelNames.includes(name.toLowerCase())
        )
        : [];

    const states = filteredPanels.map(([_, panel]) => (panel.state || '').toLowerCase());

    const allOn = states.length > 0 && states.every(state => state === 'on');
    const allOff = states.length > 0 && states.every(state => state === 'off');
    const allRebooting = states.length > 0 && states.every(state => state === 'rebooting');

    const handleRoleChange = (newRole) => {
        dispatch(setRole(newRole));
    };

    return (
        <div className="all-panel-container">
            <div className="all-panel-content">
                {/* ...existing code... */}
            </div>

            {/* Fixed Bottom Navigation Bar */}
            <nav className="all-panel-bottom-nav">
                <div className="all-panel-button-group">
                    {!isAnyPanelInDysfunction && (
                        <div className="all-panel-actions">
                            {permissions.canStartMultiplePanel && (
                                <Button
                                    className={`start-button ${
                                        isBlinking('on') ? 'blinking' : ''
                                    } ${
                                        allOn ? 'active-green' :
                                            allOff || allRebooting ? 'border-button' :
                                                ''
                                    }`}
                                    onClick={() => sendInstruction('on')}
                                    disabled={allOn}
                                >
                                    <span className="material-icons">tv</span>
                                    ALLUMER
                                </Button>
                            )}
                            {permissions.canShutdownMultiplePanel && (
                                <Button
                                    className={`stop-button ${
                                        isBlinking('off') ? 'blinking' : ''
                                    } ${
                                        allOff ? 'active-dark-red' :
                                            allOn || allRebooting ? 'border-button' :
                                                ''
                                    }`}
                                    onClick={() => sendInstruction('off')}
                                    disabled={allOff}
                                >
                                    <span className="material-icons">tv_off</span>
                                    ÉTEINDRE
                                </Button>
                            )}
                            {permissions.canRefreshMultiplePanel && (
                                <Button
                                    className={`refresh-button ${
                                        isBlinking('refresh') ? 'blinking' : ''
                                    } ${
                                        pendingState === 'refresh' ? 'active-blue' : 'border-button'
                                    }`}
                                    onClick={() => sendInstruction('refresh')}
                                    disabled={isAnyPanelInDysfunction}
                                >
                                    <span className="material-icons">refresh</span>
                                    RAFRAÎCHIR
                                </Button>
                            )}
                            {permissions.canRebootMultiplePanel && (
                                <Button
                                    className={`restart-button ${
                                        isBlinking('reboot') ? 'blinking' : ''
                                    } ${
                                        allRebooting ? 'active-orange' :
                                            allOn || allOff ? 'border-button' :
                                                ''
                                    }`}
                                    onClick={() => setShowRebootModal(true)}
                                    disabled={allRebooting}
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
                    sendInstruction('off');
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
