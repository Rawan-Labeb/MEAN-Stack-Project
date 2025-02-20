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

export interface Supplier {
  _id: string;
  companyName: string;
  email: string;
  contactNo: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId: Category;
  sellerId: string;
  supplierId: string;
  isActive: boolean;
  images?: string[];
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  images: string[];
  categoryId: Category;
  sellerId: string;
  supplierId: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductSubmitData {
  name: string;
  description?: string;  // Make description optional
  price: number;
  quantity: number;
  categoryId: string;  
  sellerId: string;
  supplierId?: string;
  isActive: boolean;
  images: string[]; 
}

export const DEFAULT_CATEGORIES: Category[] = [
  { _id: '', name: 'Men' },
  { _id: '', name: 'Women' },
  { _id: '', name: 'Unisex' }
];

export const DEFAULT_CATEGORY: Category = DEFAULT_CATEGORIES[0];