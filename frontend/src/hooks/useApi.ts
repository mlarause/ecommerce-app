import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants/app';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (config: {
    method: 'get' | 'post' | 'put' | 'delete';
    url: string;
    data?: any;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios({
        ...config,
        url: `${API_URL}${config.url}`,
        withCredentials: true
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de servidor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
};