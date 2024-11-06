// src/components/App.jsx
import React, { useState, Suspense, lazy, useEffect } from 'react';
import './App.css';
import {AuthorizationProvider, useAuth} from '../Contexts/AuthorizationContext';
import HealthControl from './Features/HealthControl';
import PanelManager from './Panels/PanelManager';
import WebSocketComponent from '../utils/WebsocketComponent';
import LoadingScreen from './Features/LoadingScreen';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import LoginPage from './Login/LoginPage'; // Import LoginPage
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute component
import Logout from './Login/LogoutPage'; // Import Logout component

function Navigation({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { isAuthenticated } = useAuth();

  return (
      <ul className={isMobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
        {isAuthenticated ? (
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
        ) : (
            <li className="nav-item">
              <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? 'nav-links active' : 'nav-links')}
                  onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="material-icons">login</span> Connexion
              </NavLink>
            </li>
        )}
      </ul>
  );
}

// Lazy load LogsPage
const LogsPage = lazy(() => import('./Logs/LogsPage'));

function App() {
  const [isBackendUp, setIsBackendUp] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
      <AuthorizationProvider>
        <Router>
          <div className="App">
            {/* Navigation Bar */}
            <nav className="navbar">
              <div className="navbar-container">
                {/* Logo or Title */}
                <NavLink to="/" className="navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="material-icons">dashboard</span> PanelManager
                </NavLink>


                <div className="health-controls">
                  <HealthControl onBackendStatusChange={setIsBackendUp} />
                </div>

                {/* Navigation Links */}
                <Navigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
              </div>
            </nav>

            {/* Main Content */}
            <Routes>
              <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      {isBackendUp === false ? (
                          <LoadingScreen />
                      ) : (
                          <>
                            <PanelManager />
                            <WebSocketComponent />
                            <ToastContainer />
                          </>
                      )}
                    </ProtectedRoute>
                  }
              />
              <Route
                  path="/logs"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<div className="loading-fallback">Chargement des journaux...</div>}>
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
      </AuthorizationProvider>
  );
}

export default App;
