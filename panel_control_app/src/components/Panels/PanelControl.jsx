// src/components/PanelControl.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './PanelControl.css';
import ConfirmationModal from './Reusable/ConfirmationModal';
import PanelInfo from './Reusable/PanelInfo';
import PanelStatusIndicator from './Reusable/PanelStatusIndicator';
import { useSelector, useDispatch } from 'react-redux';
import { sendInstructionMessage } from '../../utils/messageUtils';
import { fetchLogsForPanel } from '../../actions/websocketActions';

const PanelControl = ({ name }) => {
  const dispatch = useDispatch();
  const panelInfo = useSelector((state) => state.websocket.panelStatus[name]);
  const logs = useSelector((state) => state.websocket.logs[name] || []);
  const isAnyPanelInDysfunction = useSelector((state) => state.websocket.isAnyPanelInDysfunction);
  const role = useSelector((state) => state.auth.role);
  const permissions = useSelector((state) => state.auth.permissions);
  const [pendingState, setPendingState] = useState(null);
  const [showRebootModal, setShowRebootModal] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [displayMode, setDisplayMode] = useState(1);

  const isLoading = !panelInfo;

  useEffect(() => {
    dispatch(fetchLogsForPanel(name));
  }, [dispatch, name]);

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
      !isRebooting;


  const sendInstruction = (instruction) => {
    sendInstructionMessage({
      instruction,
      role,
      name,
    });
    setPendingState(instruction);

    if (instruction === 'reboot') {
      setIsRebooting(true);
    }
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
                  isConnected={panelInfo.connected ?? true}
                  isRebooting={isRebooting}
                  maintenanceMode={panelInfo.maintenanceMode ?? false}
                  sectorStatus={panelInfo.sectorStatus ?? false}
                  state={panelInfo.state ?? 'unknown'}
                  isDoorOpen={panelInfo.isDoorOpen ?? false}
                  problem={panelInfo.problem ?? false}
                  status={panelInfo.state ?? 'unknown'}
              />

              <PanelInfo
                  name={name}
                  displayMode={displayMode}
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
                            } ${panelInfo.state === 'on' ? 'btn-active' : ''}`}
                            onClick={() => sendInstruction('on')}
                            disabled={panelInfo.state === 'on' || pendingState === 'on'}
                        >
                          <span className="material-icons">tv</span>
                        </button>
                    )}
                    {permissions.canShutdownIndividualPanel && (
                        <button
                            className={`btn btn-red ${
                                pendingState === 'off' ? 'btn-blinking-fast' : ''
                            } ${panelInfo.state === 'off' ? 'btn-active' : ''}`}
                            onClick={() => sendInstruction('off')}
                            disabled={panelInfo.state === 'off' || pendingState === 'off'}
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
