import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * AuthGuard component
 * 
 * Protects routes that require authentication.
 * If user is not authenticated, redirects to login page with return URL.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactElement} Protected route or redirect
 */
const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return (
      <Navigate 
        to="/auth/login" 
        state={{ returnUrl: location.pathname + location.search }}
        replace 
      />
    );
  }

  return children;
};

export default AuthGuard;