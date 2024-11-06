// src/components/Logout.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthorizationContext';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

    return null;
}

export default Logout;
