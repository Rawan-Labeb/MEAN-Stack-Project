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
    sellerId:{ _id: string, firstName: string; lastName: string };
    supplierId?: string;
    categoryId: { _id: string,name:string};
  }
  