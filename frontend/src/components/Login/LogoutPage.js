// src/components/Logout.jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../../actions/authActions'; // Import the logout action

function Logout() {
    const dispatch = useDispatch(); // Use dispatch from Redux
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Send logout request to backend
                await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true }).then((response) => {
                    // Dispatch the logout action to update auth state in Redux
                    dispatch(logout());

                    // Redirect to login page
                    navigate('/login');
                    }
                );


            } catch (error) {
                console.error('Logout failed', error);
                // Handle error if needed
                // Even if logout fails on server, proceed to clear client state
                dispatch(logout());
                navigate('/login');
            }
        };

        performLogout();
    }, [dispatch, navigate]);

    return null;
}

export default Logout;
