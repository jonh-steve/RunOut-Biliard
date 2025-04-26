import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * GuestGuard component
 * 
 * Protects routes that should only be accessible to non-authenticated users.
 * If user is already authenticated, redirects to home page or return URL.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 * @returns {React.ReactElement} Protected route or redirect
 */
const GuestGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Get return URL from location state or default to home page
  const returnUrl = location.state?.returnUrl || '/';

  if (isAuthenticated) {
    // Redirect to return URL or home page
    return <Navigate to={returnUrl} replace />;
  }

  return children;
};

export default GuestGuard;