// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { login as apiLogin, getCurrentUser as apiGetCurrentUser } from '../api/auth';
import { storeToken, getToken, removeToken } from '../utils/auth';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = await getToken();
      if (storedToken) {
        try {
          const userData = await apiGetCurrentUser();
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          await removeToken();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Intentando login con:", email);
      const response = await api.post('/auth/login', { email, password });
      console.log("Respuesta:", response.data);
      
      const { token: newToken, user: userData } = response.data;
      await storeToken(newToken);
      setUser(userData);
      setToken(newToken);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      login: handleLogin,
      logout: handleLogout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};