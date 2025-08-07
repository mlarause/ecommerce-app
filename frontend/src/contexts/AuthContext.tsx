// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
import { storeToken, getToken, removeToken } from '../utils/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Interfaces para las respuestas de la API
interface LoginResponse {
  token: string;
  user: User;
}

interface UserResponse {
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredToken();
  }, []);

  const loadStoredToken = async () => {
    try {
      const storedToken = await getToken();
      console.log('Stored token:', storedToken);
      
      if (storedToken) {
        setToken(storedToken);
        await getCurrentUser();
      }
    } catch (error) {
      console.error('Error loading token:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await api.get<UserResponse>('/auth/me');
      setUser(response.data.user); // Corregido: tipado específico
    } catch (error) {
      console.error('Error getting current user:', error);
      await logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Intentando login con:', email);
      
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      console.log('Respuesta del login:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      
      await storeToken(newToken);
      setToken(newToken);
      setUser(userData);
      
      console.log('✅ Estado actualizado - User:', userData);
      console.log('✅ Estado actualizado - Token:', newToken);
    } catch (error: any) {
      console.error('Error en login:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Error en el inicio de sesión');
      } else {
        console.error('Error sin respuesta:', error.message);
        throw new Error('Error de conexión. Verifica tu conexión a internet.');
      }
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};