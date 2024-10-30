// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthorizationContext';
import axios from 'axios';

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const { setToken, setRole } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send login request to the backend
            const response = await axios.post('/api/auth/login', credentials);
            const { token, role } = response.data;

            // Update context with token and role
            setToken(token);
            setRole(role);

            // Redirect to the home page
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            // Handle login error (e.g., show a message to the user)
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
            </form>
        </div>
    );
}

export default LoginPage;
