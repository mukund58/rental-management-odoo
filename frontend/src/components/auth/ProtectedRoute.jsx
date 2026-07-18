import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../../api/axios';
import { PATHS } from '../../routes/paths';

export const ProtectedRoute = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    api.get('/auth/me')
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, []);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center font-medium text-indigo-600 dark:text-indigo-400">
          Verifying session...
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={PATHS.LOGIN} replace />;
};

export default ProtectedRoute;
