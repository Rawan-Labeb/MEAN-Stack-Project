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
  description: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  quantity: number;
  description?: string;
  categoryId: string;  // Keep as string
  supplierId: string;  // Keep as string
  sellerId: string;    // Keep as string
  isActive: boolean;
  images?: string[];
}

export interface Product extends Omit<ProductFormData, 'categoryId' | 'supplierId' | 'sellerId'> {
  _id: string;
  categoryId: Category | null;
  supplierId: Supplier | null;
  sellerId: Seller | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}