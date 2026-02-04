import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, isAdmin } from '../auth/api';

/**
 * AdminRoute - Protected route component that only allows admin users
 * Redirects non-admin users to the home page
 */
function AdminRoute({ children }) {
    const user = getCurrentUser();

    // Check if user is logged in and has admin role
    if (!user) {
        // Not logged in - redirect to login
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin()) {
        // Logged in but not admin - redirect to home
        return <Navigate to="/" replace />;
    }

    // User is admin - render the protected component
    return children;
}

export default AdminRoute;
