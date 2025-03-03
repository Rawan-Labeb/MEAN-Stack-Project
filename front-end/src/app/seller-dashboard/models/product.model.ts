export interface Seller {
  _id: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  contactNo: string;
  isActive: boolean;
  user_id?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string; // Add this property to fix the error
  isActive?: boolean;
  image?: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  quantity: number;
  description: string;
  isActive: boolean;
  categoryId: string;
  sellerId: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  images?: string[];
  isActive: boolean;
  categoryId: string | Category;
  sellerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductSubmitData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;  
  sellerId?: string;
  isActive?: boolean;
  images?: string[]; 
}

// Default categories with the description field properly defined
export const DEFAULT_CATEGORIES: Category[] = [
  { _id: '', name: 'Men', description: '', isActive: true, image: '' },
  { _id: '', name: 'Women', description: '', isActive: true, image: '' },
  { _id: '', name: 'Unisex', description: '', isActive: true, image: '' }
];

export const DEFAULT_CATEGORY: Category = DEFAULT_CATEGORIES[0];
