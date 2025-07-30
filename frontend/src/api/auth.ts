import api from './client';

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coordinator';
}

export const login = async (data: LoginData) => {
  return api.post('/auth/login', data);
};

export const getCurrentUser = async () => {
  return api.get('/auth/me');
};