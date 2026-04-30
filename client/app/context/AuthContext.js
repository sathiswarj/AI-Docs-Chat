'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        try {
          const data = await authService.getCurrentUser();
          setUser(data.data);
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const signup = async (userData) => {
    try {
      const data = await authService.register(userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      router.push('/');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || error,
      };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      router.push('/');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || error,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data.data);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await import('../services/api.service').then(m => m.default.patch('/auth/profile', profileData));
      setUser(data.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
