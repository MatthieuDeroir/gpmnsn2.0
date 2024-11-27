// src/components/Reusable/PanelNotification.js

import React from 'react';
import './PanelNotification.css';

const PanelNotification = ({ message }) => {
    return (
        <div className="panel-notification">
            <div className="notification-content">
                {message}
            </div>
        </div>
    );
};

export default PanelNotification;
