
"use client";

import type { User, Profile } from '@/types'; // Ensured Profile is imported if used directly
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import api from '@/services/api';
import { mockUsers } from '@/lib/mock-data'; // For client-side user creation during signup

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => void; // Password optional for potential signup/auto-login flows
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs once on component mount to load user data from localStorage.
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('odontoUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Ensure the stored user role matches the Profile enum type if applicable
        if (parsedUser.role && Object.values(Profile).includes(parsedUser.role as Profile)) {
          setUser(parsedUser);
        } else {
          console.warn("Stored user has an invalid role, clearing storage.");
          localStorage.removeItem('odontoUser');
        }
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem('odontoUser'); // Clear corrupted data
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      // API login
      const response = await api.post('/sessions', { email, password });
      const token = response.data.token;
      localStorage.setItem('odontoAccessToken', token);
      
      // Fetch user profile after successful login
      // Ensure the Authorization header is set by the interceptor
      const profileResponse = await api.get('/me'); 
      const apiUser = profileResponse.data;

      setUser(apiUser);
      localStorage.setItem('odontoUser', JSON.stringify(apiUser));

    } catch (error: any) {
      console.error("Login attempt failed:", error);
      // It's better to use toast notifications for user feedback if available
      // For now, using alert for simplicity as per previous structure
      if (error.response && error.response.status === 401) {
        alert("Email ou senha inválidos.");
      } else {
        alert("Ocorreu um erro ao tentar fazer login. Verifique o console para mais detalhes.");
      }
      setUser(null); // Ensure user is null on failed login
      localStorage.removeItem('odontoUser');
      localStorage.removeItem('odontoAccessToken');
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    setLoading(true);
    setUser(null);
    try {
      localStorage.removeItem('odontoUser');
      localStorage.removeItem('odontoAccessToken');
    } catch (error) {
      console.error("Failed to remove user/token from localStorage during logout", error);
    }
    // Optionally, call an API endpoint to invalidate the session/token on the server
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
