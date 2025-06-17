"use client";

import type { User } from '@/types';
import { Profile } from '@/types';
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
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
    const loadUser = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem('odontoUser');
        const token = localStorage.getItem('odontoAccessToken');
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.user?.User?.role && Object.values(Profile).includes(parsedUser.user.User.role as Profile)) {
            try {
              await api.post('/me');
              setUser(parsedUser);
            } catch (error) {
              console.warn("Token inválido ou expirado, fazendo logout");
              localStorage.removeItem('odontoUser');
              localStorage.removeItem('odontoAccessToken');
              setUser(null);
            }
          } else {
            console.warn("Stored user has an invalid role, clearing storage.");
            localStorage.removeItem('odontoUser');
            localStorage.removeItem('odontoAccessToken');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load user from localStorage", error);
        localStorage.removeItem('odontoUser');
        localStorage.removeItem('odontoAccessToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const response = await api.post('/sessions', { email, password });
      
      const token = response.data?.token;
      
      if (!token) {
        throw new Error('Token não recebido da API');
      }

      localStorage.setItem('odontoAccessToken', token);
      const profileResponse = await api.post('/me'); 
      
      const apiUser = profileResponse.data;

      if (!apiUser) {
        throw new Error('Dados do usuário não recebidos da API');
      }

      if (!apiUser?.user?.User?.role || !Object.values(Profile).includes(apiUser.user.User.role as Profile)) {
        throw new Error('Perfil de usuário inválido');
      }

      setUser(apiUser);
      localStorage.setItem('odontoUser', JSON.stringify(apiUser));

    } catch (error: any) {
      console.error("Login attempt failed:", error);
      
      setUser(null);
      localStorage.removeItem('odontoUser');
      localStorage.removeItem('odontoAccessToken');
      
      if (error.response) {
        console.error('Erro da API:', error.response.status, error.response.data);
        if (error.response.status === 401) {
          alert("Email ou senha inválidos.");
        } else if (error.response.status === 404) {
          alert("Serviço não encontrado. Verifique a URL da API.");
        } else {
          alert(`Erro ao fazer login: ${error.response.data?.message || 'Erro desconhecido'}`);
        }
      } else if (error.request) {
        console.error('Erro de rede:', error.request);
        alert("Erro de conexão. Verifique sua internet e tente novamente.");
      } else {
        console.error('Erro:', error.message);
        alert("Ocorreu um erro ao tentar fazer login. Verifique o console para mais detalhes.");
      }
      
      throw error; 
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
