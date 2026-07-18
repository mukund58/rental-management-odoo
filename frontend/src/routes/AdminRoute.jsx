import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { PATHS } from './paths';

export const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center font-semibold text-indigo-600 dark:text-indigo-400">
          Verifying session...
        </div>
      </div>
    );
  }

  const isAdmin = user && (String(user.role).toLowerCase() === 'admin');

  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to={PATHS.LOGIN} replace />;
};

export default AdminRoute;
