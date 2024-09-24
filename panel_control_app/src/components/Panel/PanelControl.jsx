import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../Contexts/WebSocketContext';
import { useAuth } from '../../Contexts/AuthorizationContext';
import './PanelControl.css';
import ConfirmationModal from '../ConfirmationModal';
import PanelInfo from './PanelInfo';
import ControlButtons from './ControlButtons';
import PanelStatusIndicator from '../PanelStatusIndicator';
import sendMessage from '../../utils/Instructions';


const PanelControl = ({ name, heartbeatTimer }) => {
    const { socket, panelStatus, isAnyPanelInDysfunction } = useWebSocket();
    const { role, permissions } = useAuth();
    const [pendingState, setPendingState] = useState(null);
    const [showRebootModal, setShowRebootModal] = useState(false);
    const [isRebooting, setIsRebooting] = useState(false);
    const [logs, setLogs] = useState([]);
    const [displayMode, setDisplayMode] = useState(0);

    const [panelInfo, setPanelInfo] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [status, setStatus] = useState("not-connected");
    const [state, setState] = useState(null);
    const [cpuTemp, setCpuTemp] = useState(null);
    const [isDoorOpen, setIsDoorOpen] = useState(null);
    const [sectorStatus, setSectorStatus] = useState(null);
    const [maintenanceMode, setMaintenanceMode] = useState(null);
    const [problem, setProblem] = useState(null);
    const [lastHeartbeat, setLastHeartbeat] = useState(null);
    const [lastHeartbeatTimestamp, setLastHeartbeatTimestamp] = useState(null);

    useEffect(() => {
        const info = panelStatus?.[name] || null;
        setPanelInfo(info);
        setIsConnected(info?.connected === true);
        setStatus(info?.connected === true ? (info.state === "on" ? "on" : "off") : "not-connected");
        setState(info?.state || null);
        setCpuTemp(info?.cpuTemp || null);
        setIsDoorOpen(info?.isDoorOpen || null);
        setSectorStatus(info?.sectorStatus || null);
        setMaintenanceMode(info?.maintenanceMode || null);
        setProblem(info?.problem || null);
        setLastHeartbeat(info?.lastHeartbeat || null);
        setLastHeartbeatTimestamp(info?.lastHeartbeatTimestamp || null);
    }, [panelStatus, name]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (message) => {
                const data = JSON.parse(message.data);
                if (data.type == "panel_registered" && panelStatus[name]?.connected === true) {
                    setIsRebooting(false);
                    setPanelInfo(panelStatus[name]);
                    setIsConnected(true);
                }
                if (data.type === "log" && data.name === name) {
                    setLogs((prevLogs) => [...prevLogs, data.log]);
                }
                if (data.type === "status") {
                    setPanelInfo(data.panelStatus);
                }
            };
        }
    }, [socket, name, panelStatus]);

    useEffect(() => {
        if (pendingState) {
            setPendingState(null);
        }
    }, [panelStatus, pendingState]);

    const imageSrc = name === "aval" ? "fleche-i-c.png" : (name === "amont" || name === "indret") ? "fleche-c.png" : "";

    const handlePanelInfoClick = () => {
        setDisplayMode((prevMode) => (prevMode + 1) % 3);
    };

    const handlePanelInfoRightClick = (e) => {
        e.preventDefault();
        setDisplayMode((prevMode) => (prevMode - 1 + 3) % 3);
    };

    const getClassByState = () => {
        if (isRebooting) return "rebooting";
        if (maintenanceMode) return "maintenance";
        if (!isConnected || !sectorStatus) return "dysfunction";
        if (isDoorOpen) return "door-open";
        if (status === "not-connected") return "red";
        if (state === "off") return "dark";
        if (state === "on") return "bright";
    };

    const cardClass = `panel-control ${getClassByState()} ${problem ? 'problem' : ''}`;

    if (!panelStatus) {
        return (
            <div className="panel-control connection-problem">
                <h3>{name}</h3>
                <img src={imageSrc} alt={`${name} indicator`} />
                <div className="door-open-banner">CONNEXION AVEC {name.toUpperCase()} EN COURS...</div>
            </div>
        );
    }

    return (
        <div className={cardClass}>
            <PanelStatusIndicator
                isConnected={isConnected}
                isRebooting={isRebooting}
                maintenanceMode={maintenanceMode}
                sectorStatus={sectorStatus}
                state={state}
                isDoorOpen={isDoorOpen}
                problem={problem}
                status={status}
            />
            <PanelInfo
                name={name}
                displayMode={displayMode}
                state={state}
                cpuTemp={cpuTemp}
                isDoorOpen={isDoorOpen}
                sectorStatus={sectorStatus}
                maintenanceMode={maintenanceMode}
                lastHeartbeat={lastHeartbeat}
                lastHeartbeatTimestamp={lastHeartbeatTimestamp}
                imageSrc={imageSrc}
                handlePanelInfoClick={handlePanelInfoClick}
                handlePanelInfoRightClick={handlePanelInfoRightClick}
            />
            {!isAnyPanelInDysfunction && isConnected && (
                <ControlButtons
                    permissions={permissions}
                    state={state}
                    pendingState={pendingState}
                    sendInstruction={(instruction) => sendMessage(socket, 'instruction', role, name, instruction, heartbeatTimer, setPendingState)}
                    refresh={() => sendMessage(socket, 'refresh', role, name, null, heartbeatTimer, setPendingState)}
                    setShowRebootModal={setShowRebootModal}
                />
            )}
            <ConfirmationModal
                show={showRebootModal}
                onConfirm={() => {
                    sendMessage(socket, 'instruction', role, name, 'off', heartbeatTimer, setPendingState);
                    sendMessage(socket, 'reboot', role, name, null, heartbeatTimer, setPendingState, setIsRebooting);
                    setShowRebootModal(false);
                }}
                onCancel={() => setShowRebootModal(false)}
                message="Are you sure you want to reboot?"
            />
        </div>
    );
};

export default PanelControl;
