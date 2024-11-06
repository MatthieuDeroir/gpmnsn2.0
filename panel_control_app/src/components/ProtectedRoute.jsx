// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        // Not authenticated, redirect to login
        return <Navigate to="/login" replace />;
    }

    // Authenticated, render the children
    return children;
};

export default ProtectedRoute;
