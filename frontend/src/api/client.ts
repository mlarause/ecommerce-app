import axios from 'axios';
import { API_URL } from '../constants/app';
import { getToken, removeToken } from '../utils/auth';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Modifica el interceptor para usar SecureStore en lugar de localStorage
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo elimina el token, la navegación se maneja en AuthContext
      removeToken();
    }
    return Promise.reject(error);
  }
);

export default api;