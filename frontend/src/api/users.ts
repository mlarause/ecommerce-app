import api from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coordinator';
}

export const getUsers = async () => {
  return api.get('/users');
};

export const getUser = async (id: string) => {
  return api.get(`/users/${id}`);
};

export const createUser = async (data: Omit<User, 'id'>) => {
  return api.post('/users', data);
};

export const updateUser = async (id: string, data: Partial<User>) => {
  return api.put(`/users/${id}`, data);
};

export const deleteUser = async (id: string) => {
  return api.delete(`/users/${id}`);
};