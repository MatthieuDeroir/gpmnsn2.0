import React from 'react';
import { useWebSocket } from '../Contexts/WebSocketContext';
import PanelControl from './Panel/PanelControl';
import './LoadingCard.css';

const LoadingCard = () => {
    const { isConnected } = useWebSocket();

    if (isConnected) {
        return (
            <div className="panel-controls">
                <PanelControl name="indret" />
                <PanelControl name="aval" />
                <PanelControl name="amont" />
            </div>
        );
    } else {
        return (
            <div className="loading-card">
                <div className="spinner"></div>
                Tentative de Connexion...
            </div>
        );
    }
};

export default LoadingCard;
