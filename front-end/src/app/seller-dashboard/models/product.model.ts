export interface Category {
  _id: string;
  name: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  quantity: number;
  description: string;
  isActive: boolean;
  supplierId: string;
  categoryId: string;
  sellerId: string;
}

export interface Product extends ProductFormData {
  _id: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}