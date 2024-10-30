import React from 'react';

const ControlButtons = ({ permissions, state, pendingState, sendInstruction, refresh, setShowRebootModal }) => {
    const isBlinking = (action) => pendingState === action;

    return (
        <div className="button-group">
            {permissions.canRebootIndividualPanel && (
                <button className="btn icon-button restart-button" onClick={() => setShowRebootModal(true)} title='Redémarrer'>
                    <span className="material-icons">restart_alt</span>
                </button>
            )}
            {permissions.canStartIndividualPanel && (
                <button
                    className={`btn start-button ${state === 'on' ? 'btn-green-active' : 'btn-green'} ${isBlinking('on') ? 'blinking-text-green' : ''}`}
                    onClick={() => sendInstruction('on')}
                    title='Allumer'
                >
                    <span className="material-icons">tv</span>
                </button>
            )}
            {permissions.canShutdownIndividualPanel && (
                <button
                    className={`btn stop-button ${state === 'off' ? 'btn-red-active' : 'btn-red'} ${isBlinking('off') ? 'blinking-text-red' : ''}`}
                    onClick={() => sendInstruction('off')}
                    title='Éteindre'
                >
                    <span className="material-icons">tv_off</span>
                </button>
            )}
            {permissions.canRefreshIndividualPanel && (
                <button className="btn icon-button refresh-button" onClick={refresh} title='Actualiser'>
                    <span className="material-icons">refresh</span>
                </button>
            )}
        </div>
    );
};

export default ControlButtons;
