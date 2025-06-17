"use client";

import type { User } from '@/types';
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { mockUsers } from '@/lib/mock-data'; // For demo purposes
import api from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('odontoUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem('odontoUser');
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      setLoading(true);
      const response = await api.post('/sessions',{
        email,
        password
      })
      localStorage.setItem('odontoAccessToken', response.data.token);
      const profile = await api.post('/me');
      setUser(profile.data);
      localStorage.setItem('odontoUser', JSON.stringify(profile.data));
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.response && error.response.status === 401) {
        alert("Email ou senha inválidos.");
      } else {
        alert("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
      }
      return;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    setUser(null);
    try {
      localStorage.removeItem('odontoUser');
    } catch (error) {
      console.error("Failed to remove user from localStorage during logout", error);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
