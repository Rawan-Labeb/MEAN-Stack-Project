export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    prevPrice?: number;
    noOfSale: number;
    images: string[];
    isActive: boolean;
    quantity: number;
    sellerId: string;
    supplierId?: string;
    categoryId: string;
  }
  