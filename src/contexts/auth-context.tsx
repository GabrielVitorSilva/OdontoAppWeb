
"use client";

import type { User } from '@/types';
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { mockUsers } from '@/lib/mock-data'; // For demo purposes

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

  const login = (email: string, password?: string) => {
    setLoading(true);
    let userToLogin: User | null = null;

    if (email === 'gabrieldatas2004@gmail.com') {
      // Root admin login
      const rootAdmin = mockUsers.find(u => u.email === 'gabrieldatas2004@gmail.com' && u.role === 'admin');
      if (rootAdmin) {
        // In a real app, you would validate the password here (e.g. check if password === '123456')
        userToLogin = rootAdmin;
      } else {
        // This case should ideally not happen if mock-data.ts is correct
        console.error("Root admin user (gabrieldatas2004@gmail.com) not found in mock-data.ts. Please ensure it's defined.");
        // Fallback for safety, creates a temporary root admin object if not found in mocks
        userToLogin = { id: 'user-root-admin-fallback', name: 'Gabriel Datas (Fallback)', email: 'gabrieldatas2004@gmail.com', role: 'admin', password: password };
      }
    } else {
      // Standard user login or new client registration (from signup form)
      userToLogin = mockUsers.find(u => u.email === email) || null;

      // Signup form only creates 'client' role users
      if (!userToLogin) {
        const newClient: User = { 
          id: `user-${Date.now()}`, 
          name: email.split('@')[0], // Simple name generation
          email, 
          role: 'client',
          password: password // Store password from signup for the new mock user
        };
        mockUsers.push(newClient); // Add to mockUsers array for demo persistence
        userToLogin = newClient;
      }
    }
    
    if (userToLogin) {
      setUser(userToLogin);
      try {
        localStorage.setItem('odontoUser', JSON.stringify(userToLogin));
      } catch (error) {
         console.error("Failed to save user to localStorage", error);
      }
    } else {
      // Login failed for existing user attempt (not a new client signup)
      setUser(null); // Explicitly set user to null
      try {
        localStorage.removeItem('odontoUser'); // Clear any erroneous stored user
      } catch (error) {
        console.error("Failed to remove user from localStorage", error);
      }
      console.warn(`Login attempt failed for ${email}. User not found or credentials/role mismatch.`);
      // Optionally, you could use a toast notification here to inform the user of login failure
    }
    setLoading(false);
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
