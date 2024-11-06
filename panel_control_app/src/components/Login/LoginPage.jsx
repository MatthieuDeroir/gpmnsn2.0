// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthorizationContext';
import axios from 'axios';

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const { login } = useAuth(); // Utiliser la fonction login du contexte
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Envoyer la requête de connexion au backend
            const response = await axios.post('http://localhost:4000/api/auth/login', credentials);
            const { token, role } = response.data;

            // Mettre à jour l'état d'authentification en utilisant la fonction login
            login(token, role);

            // Rediriger vers la page d'accueil
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            setErrorMessage('Nom d\'utilisateur ou mot de passe incorrect.');
        }
    };

    return (
        <div className="login-page">
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                />
                <button type="submit">Se connecter</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
}

export default LoginPage;
