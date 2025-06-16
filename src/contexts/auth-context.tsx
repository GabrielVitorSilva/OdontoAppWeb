
"use client";

import type { User } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers } from '@/lib/mock-data'; // For demo purposes

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: User['role']) => void; // Simplified login
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
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

  const login = (email: string, role: User['role']) => {
    // In a real app, this would involve an API call.
    // For demo, find a user with matching email and role, or create a mock one.
    let foundUser = mockUsers.find(u => u.email === email && u.role === role);
    if (!foundUser) {
      // Create a generic user if not found in mock for simplicity
      foundUser = { id: `user-${Date.now()}`, name: email.split('@')[0], email, role };
    }
    setUser(foundUser);
    try {
      localStorage.setItem('odontoUser', JSON.stringify(foundUser));
    } catch (error) {
       console.error("Failed to save user to localStorage", error);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('odontoUser');
    } catch (error) {
      console.error("Failed to remove user from localStorage", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
