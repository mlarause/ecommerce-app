import axios from 'axios';
import { API_URL } from '../constants/app';
import { LoginData, User } from '../types';

// Configuración básica de axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Añadir interceptor para el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (data: LoginData): Promise<{ token: string; user: User }> => {
  const response = await api.post<{ token: string; user: User }>('/auth/login', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};