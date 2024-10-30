// src/components/App.jsx
import React, { useState, Suspense, lazy } from 'react';
import './App.css';
import { AuthorizationProvider } from '../Contexts/AuthorizationContext';
import HealthControl from './Features/HealthControl';
import PanelManager from './Panels/PanelManager';
import WebSocketComponent from '../utils/WebsocketComponent';
import LoadingScreen from './Features/LoadingScreen';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import des icônes pour le menu hamburger

// Chargement paresseux de LogsPage
const LogsPage = lazy(() => import('./Logs/LogsPage'));

function App() {
  const [isBackendUp, setIsBackendUp] = useState(null); // Track backend status
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // État du menu mobile

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <AuthorizationProvider>
      <Router>
        <div className="App">
          {/* Barre de Navigation */}
          <nav className="navbar">
            <div className="navbar-container">
              {/* Logo ou Titre */}
              <NavLink to="/" className="navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="material-icons">dashboard</span> PanelManager
              </NavLink>

              {/* Icône du Menu Hamburger */}
              <div className="menu-icon" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </div>
              <div className="health-controls">
                  <HealthControl onBackendStatusChange={setIsBackendUp} />
                </div>

              {/* Liens de Navigation */}
              <ul className={isMobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
                <li className="nav-item">
                
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => isActive ? 'nav-links active' : 'nav-links'}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="material-icons">home</span> Accueil
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/logs" 
                    className={({ isActive }) => isActive ? 'nav-links active' : 'nav-links'}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="material-icons">assignment</span> Journaux
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>

          {/* Contenu Principal */}
          <Routes>
            <Route path="/" element={
              <>
               
                
                {isBackendUp === false ? (
                  <LoadingScreen />
                ) : (
                  <>
                    <PanelManager />
                  </>
                )}
                <WebSocketComponent />
                <ToastContainer />
              </>
            } />

            <Route path="/logs" element={
              <Suspense fallback={<div className="loading-fallback">Chargement des journaux...</div>}>
                <LogsPage />
              </Suspense>
            } />
          </Routes>
        </div>
      </Router>
    </AuthorizationProvider>
  );
}

export default App;
