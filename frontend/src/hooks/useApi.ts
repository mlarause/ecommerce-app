import { useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../constants/app'; // Usando ruta correcta
import { useAuth } from '../contexts/AuthContext'; // Ruta correcta

export const useApi = () => {
  const { logout } = useAuth();

  const request = useCallback(async (config: {
    method: 'get' | 'post' | 'put' | 'delete';
    url: string;
    data?: any;
    params?: any;
  }) => {
    try {
      const response = await axios({
        baseURL: API_URL,
        method: config.method,
        url: config.url,
        data: config.data,
        params: config.params,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        logout();
      }
      throw error.response?.data?.message || 'Error de servidor';
    }
  }, [logout]);

  return { request };
};