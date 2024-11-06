// src/components/Logout.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useNavigate } from 'react-router-dom';
import { logout } from '../../actions/authActions'; // Import the logout action

function Logout() {
    const dispatch = useDispatch(); // Use dispatch from Redux
    const navigate = useNavigate();

    useEffect(() => {
        // Dispatch the logout action to update auth state in Redux
        dispatch(logout());
        navigate('/login');
    }, [dispatch, navigate]);

    return null;
}

export default Logout;
