// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { login } from '../../actions/authActions';
import './LoginPage.css'; // Importation du fichier CSS

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Envoi de la requête de connexion au backend
            const response = await axios.post('http://localhost:4000/api/auth/login', credentials);
            const { token, role } = response.data;

            // Mise à jour de l'état d'authentification avec Redux
            dispatch(login(token, role));

            // Redirection vers la page d'accueil
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            setErrorMessage("Nom d'utilisateur ou mot de passe incorrect.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <img src={'/Stramatel_Logo_FR.png'} alt="Stramatel Logo" className="login-logo" />
                <h2>Connexion</h2>
                <br/>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Nom d'utilisateur"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="login-button">Se connecter</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
