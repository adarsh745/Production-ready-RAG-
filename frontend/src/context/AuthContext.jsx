import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          setToken(storedToken);
          localStorage.setItem('user_info', JSON.stringify(userData));
        } catch (error) {
          console.error('Failed to authenticate stored token:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_info');
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const data = await authService.login({ email, password });
    const { access_token, user: userData } = data;

    setToken(access_token);
    setUser(userData);

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user_info', JSON.stringify(userData));

    return userData;
  };

  const signup = async (fullName, email, password, confirmPassword) => {
    const data = await authService.signup({
      fullName,
      email,
      password,
      confirmPassword,
    });
    const { access_token, user: userData } = data;

    setToken(access_token);
    setUser(userData);

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user_info', JSON.stringify(userData));

    return userData;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
