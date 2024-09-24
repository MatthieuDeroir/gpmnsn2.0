import React from 'react';
import './App.css';
import { WebSocketProvider } from '../Contexts/WebSocketContext';
import { AuthorizationProvider } from '../Contexts/AuthorizationContext';
import HealthControl from './HealthControl';
import PanelManager from './PanelManager';
import LogsPage from './LogsPage'; // Import the LogPage component
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
    return (
        <WebSocketProvider>
        <AuthorizationProvider>
            <Router>
                <div className="App">
                    <nav>
                        {/* Button to switch to the log page */}
                        <Link to="/logs">
                            <button className="log-button">Go to Logs</button>
                        </Link>
                        {/* Button to switch to the main page */}
                        <Link to="/">
                            <button className="home-button">Go to Home</button>
                        </Link>
                    </nav>

                    <Routes>
                        {/* Main Page */}
                        <Route path="/" element={
                            <>
                                <div className="health-controls">
                                    <HealthControl />
                                </div>
                                <PanelManager />
                            </>
                        } />

                        {/* Log Page */}
                        <Route path="/logs" element={<LogsPage />} />
                    </Routes>
                </div>
            </Router>
        </AuthorizationProvider>
        </WebSocketProvider>
    );
}

export default App;
