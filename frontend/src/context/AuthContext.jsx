import React, { createContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    // Placeholder - No implementation yet
    console.log('AuthContext login placeholder triggered with:', credentials);
  };

  const register = async (userData) => {
    // Placeholder - No implementation yet
    console.log('AuthContext register placeholder triggered with:', userData);
  };

  const logout = async () => {
    // Placeholder - No implementation yet
    console.log('AuthContext logout placeholder triggered');
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
