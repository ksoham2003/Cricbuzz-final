import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <Loader message="Authenticating user..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and preserve the location we were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    // Redirect unauthorized users to home page
    return <Navigate to="/" replace />;
  }

  return children;
}
