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
  isActive: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;
  sellerId?: string;
  images?: string[];
  isActive?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string | Category;
  sellerId?: string;
  images: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductSubmitData extends ProductFormData {
  _id?: string;
}

// Fix the mock categories - remove description property
export const MOCK_CATEGORIES: Category[] = [
  { _id: '', name: 'Men', isActive: true, image: '' },
  { _id: '', name: 'Women', isActive: true, image: '' },
  { _id: '', name: 'Unisex', isActive: true, image: '' }
];

// Default categories with the description field properly defined
export const DEFAULT_CATEGORIES: Category[] = [
  { _id: '', name: 'Men', isActive: true, image: '' },
  { _id: '', name: 'Women', isActive: true, image: '' },
  { _id: '', name: 'Unisex', isActive: true, image: '' }
];

export const DEFAULT_CATEGORY: Category = DEFAULT_CATEGORIES[0];
