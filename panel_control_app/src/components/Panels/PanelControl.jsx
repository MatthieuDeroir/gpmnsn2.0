// PanelControl.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import websocketClient from '../../utils/websocketClient';
import { useAuth } from '../../Contexts/AuthorizationContext';
import './PanelControl.css';
import ConfirmationModal from './Reusable/ConfirmationModal';
import PanelInfo from './Reusable/PanelInfo';
import PanelStatusIndicator from './Reusable/PanelStatusIndicator';
import usePanelData from '../../hooks/usePanelData';

const PanelControl = ({ name, heartbeatTimer }) => {
  const { panelInfo, logs, isAnyPanelInDysfunction, isLoading } = usePanelData(name);
  const { role, permissions } = useAuth();
  const [pendingState, setPendingState] = useState(null);
  const [showRebootModal, setShowRebootModal] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [displayMode, setDisplayMode] = useState(1);

  const isOn = panelInfo && panelInfo.state === 'on';
  const isOff = panelInfo && panelInfo.state === 'off';

  useEffect(() => {
    if (pendingState && panelInfo) {
      if (
        (pendingState === 'on' && panelInfo.state === 'on') ||
        (pendingState === 'off' && panelInfo.state === 'off') ||
        (pendingState === 'refresh') ||
        (pendingState === 'reboot' && panelInfo.state === 'rebooting')
      ) {
        setPendingState(null);
      }
    }

    if (panelInfo && panelInfo.state === 'rebooting') {
      setIsRebooting(true);
    } else {
      setIsRebooting(false);
    }
  }, [panelInfo, pendingState]);

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
    if (isLoading) return 'loading'; // Appliquer la classe 'loading' pendant le chargement
    if (!panelInfo) return 'not-connected'; // Gestion des cas où panelInfo est null ou undefined
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
    (!isAnyPanelInDysfunction && panelInfo && panelInfo.connected && permissions && !isLoading && !isRebooting);

  const sendInstruction = (instruction) => {
    websocketClient.sendMessage({
      type: 'instruction',
      to: 'panel',
      role,
      name,
      instruction,
      heartbeatTimer,
    });
    setPendingState(instruction);

    if (instruction === 'reboot') {
      setIsRebooting(true);
    }
  };

  const refresh = () => {
    websocketClient.sendMessage({
      type: 'refresh',
      to: 'panel',
      role,
      name,
    });
    setPendingState('refresh');
  };

  return (
    <div className={cardClass}>
      {isLoading ? (
        <div className="loading-content">
          <h3>{name.toUpperCase()}</h3>
          <img src={imageSrc} alt={`${name} indicator`} className="panel-image" />
          <div className="door-open-banner">CHARGEMENT...</div>
        </div>
      ) : (
        <>
          <PanelStatusIndicator
            isConnected={panelInfo.connected}
            isRebooting={isRebooting}
            maintenanceMode={panelInfo.maintenanceMode}
            sectorStatus={panelInfo.sectorStatus}
            state={panelInfo.state}
            isDoorOpen={panelInfo.isDoorOpen}
            problem={panelInfo.problem}
            status={panelInfo.state}
          />
          <PanelInfo
            name={name}
            displayMode={displayMode}
            panelInfo={panelInfo}
            logs={logs}
            imageSrc={imageSrc}
            handlePanelInfoClick={handlePanelInfoClick}
            handlePanelInfoRightClick={handlePanelInfoRightClick}
          />

          {shouldDisplayButtons && (
            <div className="button-group">
              {permissions.canStartIndividualPanel && (
                <button
                  className={`btn btn-green ${
                    pendingState === 'on' ? 'btn-blinking-fast' : ''
                  } ${isOn ? 'btn-active' : ''}`}
                  onClick={() => sendInstruction('on')}
                  disabled={isOn || pendingState === 'on'}
                >
                  <span className="material-icons">tv</span>
                </button>
              )}
              {permissions.canShutdownIndividualPanel && (
                <button
                  className={`btn btn-red ${
                    pendingState === 'off' ? 'btn-blinking-fast' : ''
                  } ${isOff ? 'btn-active' : ''}`}
                  onClick={() => sendInstruction('off')}
                  disabled={isOff || pendingState === 'off'}
                >
                  <span className="material-icons">tv_off</span>
                </button>
              )}
              {permissions.canRefreshIndividualPanel && (
                <button
                  className={`btn btn-blue ${
                    pendingState === 'refresh' ? 'btn-blinking-fast' : ''
                  }`}
                  onClick={() => sendInstruction('refresh')}
                  disabled={pendingState === 'refresh'}
                >
                  <span className="material-icons">refresh</span>
                </button>
              )}
              {permissions.canRebootIndividualPanel && (
                <button
                  className={`btn btn-orange ${
                    pendingState === 'reboot' ? 'btn-blinking-fast' : ''
                  } ${isRebooting ? 'btn-active' : ''}`}
                  onClick={() => setShowRebootModal(true)}
                  disabled={pendingState === 'reboot' || isRebooting}
                >
                  <span className="material-icons">restart_alt</span>
                </button>
              )}
            </div>
          )}

          <ConfirmationModal
            show={showRebootModal}
            onConfirm={() => {
              sendInstruction('reboot');
              setIsRebooting(true);
              setShowRebootModal(false);
            }}
            onCancel={() => setShowRebootModal(false)}
            message={`Êtes-vous sûr de vouloir redémarrer ${name} ?`}
          />
        </>
      )}
    </div>
  );
};

export default PanelControl;
