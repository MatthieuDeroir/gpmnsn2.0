import React from 'react';
import './App.css';
import { WebSocketProvider } from './WebSocketContext';
import PanelControl from './PanelControl';
import HealthControl from './HealthControl';
import AllPanel from './AllPanel'; // Importer le nouveau composant

function App() {


    return (
        <WebSocketProvider>
            <div className="App">
                <h1>Panel Control</h1>
                <div className="health-controls">
                    <HealthControl />
                </div>
                <div className="panel-controls">
                    {}
                    <PanelControl name="indret" />
                    <PanelControl name="aval" />
                    <PanelControl name="amont" />
                </div>
                <div className="all-control">
                    <AllPanel /> {/* Utiliser le nouveau composant */}
                </div>
            </div>
        </WebSocketProvider>
    );
}

export default App;
