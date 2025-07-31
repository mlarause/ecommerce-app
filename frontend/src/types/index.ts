// src/types/index.ts
export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coordinator';
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Subcategory extends Category {
  categoryId: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  subcategoryId: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}