import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Since /user/profile endpoint is not available, we'll skip this check
      // and rely on the login data stored in context
      setUser(null);
    } catch (error) {
      console.log('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, role) => {
    setUser({ ...userData, role });
  };

  const logout = async () => {
    try {
      // Call logout endpoint if available
      await fetch('https://pweb-be-production.up.railway.app/user/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.log('Logout request failed:', error);
    }
    
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isLoggedIn,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
