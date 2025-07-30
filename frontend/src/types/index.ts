export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coordinator';
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