
"use client";

import type { User } from '@/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers } from '@/lib/mock-data'; // For demo purposes

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: User['role'], password?: string) => void; // Added password (optional for now)
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

  const login = (email: string, role: User['role'], password?: string) => {
    setLoading(true);
    let userToLogin: User | null = null;

    if (email === 'gabrieldatas2004@gmail.com') {
      // Root admin login
      const rootAdmin = mockUsers.find(u => u.email === 'gabrieldatas2004@gmail.com' && u.role === 'admin');
      if (rootAdmin) {
        // In a real app, you would validate the password here
        // For this mock, if email matches, we assume login is successful for root admin
        userToLogin = rootAdmin;
      } else {
        console.error("Root admin user (gabrieldatas2004@gmail.com) not found in mock-data.ts. Please ensure it's defined.");
        // Fallback for safety, though ideally mock-data should be correct
        userToLogin = { id: 'user-root-admin-fallback', name: 'Gabriel Datas (Fallback)', email: 'gabrieldatas2004@gmail.com', role: 'admin' };
      }
    } else {
      // Standard user login or new client registration (from signup form)
      userToLogin = mockUsers.find(u => u.email === email && u.role === role) || null;

      if (!userToLogin && role === 'client') {
        // This path is taken by the signup form, which now only registers clients
        // Create a new client user
        const newClient: User = { 
          id: `user-${Date.now()}`, 
          name: email.split('@')[0], // Simple name generation
          email, 
          role: 'client' 
        };
        mockUsers.push(newClient); // Add to mockUsers array for demo persistence
        userToLogin = newClient;
        console.log("New client registered and added to mockUsers:", newClient);
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
      // Handle login failure for non-root, non-new-client cases
      // (e.g., trying to log in as a professional/admin that doesn't exist)
      console.warn(`Login attempt failed for ${email} with role ${role}. User not found or incorrect credentials/role.`);
      // Optionally, show a toast or set an error state here
      // For now, user remains null, and isAuthenticated will be false
    }
    setLoading(false);
  };

  const logout = () => {
    setLoading(true);
    setUser(null);
    try {
      localStorage.removeItem('odontoUser');
    } catch (error) {
      console.error("Failed to remove user from localStorage", error);
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
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
