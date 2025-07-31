// src/constants/app.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  ADMIN: 'admin',
  COORDINATOR: 'coordinator',
} as const;