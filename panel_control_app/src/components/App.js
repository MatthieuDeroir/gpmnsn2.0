// src/components/App.jsx

import React, { useState, Suspense, lazy, useEffect } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import HealthControl from './Features/HealthControl';
import PanelManager from './Panels/PanelManager';
import LoadingScreen from './Features/LoadingScreen';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connectWebSocket } from '../actions/websocketActions';
import LoginPage from './Login/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import Logout from './Login/LogoutPage';

import { FaBars, FaTimes } from 'react-icons/fa';

function Navigation({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return (
        <ul className={isMobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
            {isAuthenticated && (
                <>
                    <li className="nav-item">
                        <NavLink
                            to="/"
                            className={({ isActive }) => (isActive ? 'nav-links active' : 'nav-links')}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="material-icons">home</span> Accueil
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/logs"
                            className={({ isActive }) => (isActive ? 'nav-links active' : 'nav-links')}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="material-icons">assignment</span> Journaux
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            to="/logout"
                            className="nav-links"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="material-icons">logout</span> Déconnexion
                        </NavLink>
                    </li>
                </>
            )}
        </ul>
    );
}

// Chargement asynchrone de LogsPage
const LogsPage = lazy(() => import('./Logs/LogsPage'));

function App() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [isBackendUp, setIsBackendUp] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        dispatch(connectWebSocket());
        // Cleanup on unmount
        return () => {
            // Optionnellement, vous pouvez déconnecter le WebSocket ici
        };
    }, [dispatch]);

    return (
        <Router>
            <div className="App">
                {/* Navigation Bar */}
                {isAuthenticated && (
                    <nav className="navbar">
                        <div className="navbar-container">
                            {/* Logo et Titre */}
                            <div className="navbar-logo-container">
                                <NavLink
                                    to="/"
                                    className="navbar-logo-image-link"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <img
                                        src="/Stramatel_Logo_FR.png"
                                        alt="Stramatel Logo"
                                        className="navbar-logo-image"
                                    />
                                </NavLink>
                            </div>

                            {/* Icône du Menu Hamburger */}
                            <div className="menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                            </div>

                            {/* Navigation Links */}
                            <Navigation
                                isMobileMenuOpen={isMobileMenuOpen}
                                setIsMobileMenuOpen={setIsMobileMenuOpen}
                            />
                        </div>
                    </nav>
                )}

                {/* Main Content */}
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                {isBackendUp === false ? (
                                    <>
                                        <PanelManager />
                                        <ToastContainer />
                                        <div className="health-controls">
                                            <HealthControl onBackendStatusChange={setIsBackendUp} />
                                        </div>
                                        <LoadingScreen />

                                    </>
                                ) : (
                                    <>
                                        <PanelManager />
                                        <ToastContainer />
                                        <div className="health-controls">
                                            <HealthControl onBackendStatusChange={setIsBackendUp} />
                                        </div>
                                    </>
                                )}
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/logs"
                        element={
                            <ProtectedRoute>
                                <Suspense
                                    fallback={<div className="loading-fallback">Chargement des journaux...</div>}
                                >
                                    <LogsPage />
                                </Suspense>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
