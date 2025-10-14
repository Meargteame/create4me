import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../lib/api';
import type { User } from '../types';

// Re-export User type for backward compatibility
export type { User };

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, role?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: string | null; success: boolean; user: User | null }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, role?: string) => Promise<{ error: string | null; success: boolean; user: User | null }>;
  updateUserName: (name: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.getMe();
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        localStorage.removeItem('auth_token');
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role?: string) => {
    try {
      setLoading(true);
      const response = await apiClient.signup(email, password, role);
      if (response.success && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        return { error: null };
      } else {
        return { error: response.message || 'Registration failed' };
      }
    } catch (error: any) {
      return { error: error.message || 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiClient.login(email, password);
      if (response.success && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('auth_token', response.token);
        return { error: null };
      } else {
        return { error: response.message || 'Login failed' };
      }
    } catch (error: any) {
      return { error: error.message || 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    return { ...result, success: !result.error, user };
  };
  
  const logout = async () => signOut();
  
  const register = async (email: string, password: string, role?: string) => {
    const result = await signUp(email, password, role);
    return { ...result, success: !result.error, user };
  };

  const updateUserName = async (name: string) => {
    try {
      // When backend API is ready, uncomment this:
      // const response = await apiClient.updateProfile({ name });
      // if (response.success && response.user) {
      //   setUser(response.user);
      // }
      
      // For now, update locally
      if (user) {
        setUser({ ...user, name });
      }
    } catch (error) {
      console.error('Error updating name:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    signUp,
    signIn,
    signOut,
    login,
    logout,
    register,
    updateUserName,
    isLoading: loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
