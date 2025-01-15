// src/components/LoadingScreen.js
import React, { useState, useEffect } from 'react';
import './LoadingScreen.css'; // Create this file for styling

const LoadingScreen = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        // Change the number of dots every 500ms
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
        }, 500);

        // Clear the interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <img src="warningg.png" alt="" className="warning-icon" />
                <p className="large-text">SERVEUR INJOIGNABLE</p>
                <p className="large-text">Tentative de reconnexion en cours{dots}</p>
                <div className="spinner"></div>
            </div>
        </div>
    );
};

export default LoadingScreen;
