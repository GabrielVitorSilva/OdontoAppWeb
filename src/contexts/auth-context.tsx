"use client";

import type { User } from '@/types';
import { Profile } from '@/types';
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import api from '@/services/api';

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
    const loadUser = async () => {
      setLoading(true);
      try {
        console.log('Carregando usuário do localStorage...');
        const storedUser = localStorage.getItem('odontoUser');
        const token = localStorage.getItem('odontoAccessToken');
        
        console.log('Token encontrado:', !!token);
        console.log('Usuário encontrado:', !!storedUser);
        
        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          console.log('Usuário parseado:', parsedUser);
          
          // Ensure the stored user role matches the Profile enum type if applicable
          if (parsedUser?.user?.User?.role && Object.values(Profile).includes(parsedUser.user.User.role as Profile)) {
            // Verifica se o token ainda é válido
            try {
              console.log('Verificando validade do token...');
              await api.post('/me');
              console.log('Token válido, definindo usuário...');
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
          console.log('Nenhum usuário ou token encontrado no localStorage');
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
      console.log('Iniciando login...');
      
      // API login
      console.log('Enviando requisição de login...');
      const response = await api.post('/sessions', { email, password });
      console.log('Resposta do login:', response.status);
      
      const token = response.data?.token;
      console.log('Token recebido:', token);
      
      if (!token) {
        throw new Error('Token não recebido da API');
      }

      localStorage.setItem('odontoAccessToken', token);
      console.log('Token salvo no localStorage');
      
      // Fetch user profile after successful login
      console.log('Buscando perfil do usuário...');
      const profileResponse = await api.post('/me'); 
      console.log('Resposta do perfil:', profileResponse.status);
      
      const apiUser = profileResponse.data;
      console.log('Dados do usuário recebidos:', apiUser);

      if (!apiUser) {
        throw new Error('Dados do usuário não recebidos da API');
      }

      // Garante que o usuário tenha um role válido
      if (!apiUser?.user?.User?.role || !Object.values(Profile).includes(apiUser.user.User.role as Profile)) {
        throw new Error('Perfil de usuário inválido');
      }

      setUser(apiUser);
      localStorage.setItem('odontoUser', JSON.stringify(apiUser));
      console.log('Usuário salvo no localStorage:', apiUser);

    } catch (error: any) {
      console.error("Login attempt failed:", error);
      
      // Limpa dados de autenticação em caso de erro
      setUser(null);
      localStorage.removeItem('odontoUser');
      localStorage.removeItem('odontoAccessToken');
      
      // Trata diferentes tipos de erro
      if (error.response) {
        // Erro da API
        console.error('Erro da API:', error.response.status, error.response.data);
        if (error.response.status === 401) {
          alert("Email ou senha inválidos.");
        } else if (error.response.status === 404) {
          alert("Serviço não encontrado. Verifique a URL da API.");
        } else {
          alert(`Erro ao fazer login: ${error.response.data?.message || 'Erro desconhecido'}`);
        }
      } else if (error.request) {
        // Erro de rede
        console.error('Erro de rede:', error.request);
        alert("Erro de conexão. Verifique sua internet e tente novamente.");
      } else {
        // Outros erros
        console.error('Erro:', error.message);
        alert("Ocorreu um erro ao tentar fazer login. Verifique o console para mais detalhes.");
      }
      
      throw error; // Re-throw o erro para ser tratado pelo formulário
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
