import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService, { TokenManager } from '../services/authService';

const AuthContext = createContext(null);

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // First check if we have a token
      if (!AuthService.isAuthenticated()) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      // Verify with backend
      const data = await AuthService.getCurrentUser();
      
      if (data.isAuthenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        // Token is invalid, clear it
        TokenManager.clear();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token
      TokenManager.clear();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await AuthService.login({ email, password });
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await AuthService.register(userData);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const activateAccount = async (email, code) => {
    try {
      const data = await AuthService.activateAccount({ email, code });
      
      // Auto-login after successful activation
      if (data.token && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      }
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const data = await AuthService.requestPasswordReset({ email });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const confirmPasswordReset = async (uid, token, newPassword, reNewPassword) => {
    try {
      const data = await AuthService.confirmPasswordReset({
        uid,
        token,
        new_password: newPassword,
        re_new_password: reNewPassword,
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const resendActivationCode = async (email) => {
    try {
      const data = await AuthService.resendActivationCode({ email });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    activateAccount,
    requestPasswordReset,
    confirmPasswordReset,
    resendActivationCode,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};