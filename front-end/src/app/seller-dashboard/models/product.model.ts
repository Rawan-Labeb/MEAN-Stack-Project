export interface Product {
  _id: string;  
  name: string;
  price: number;
  quantity: number;
  description: string;
  isActive: boolean;
  [key: string]: any;  
}