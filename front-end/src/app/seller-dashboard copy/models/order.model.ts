// Remove the conflicting import
// import { OrderItem } from '../services/order.service';

// Define OrderItem directly here instead
export interface OrderItem {
  subInventoryId: string | any;
  price: number;
  quantity: number;
  productId?: string;
  product?: any;
  sellerId?: string;
}

export interface Order {
  _id: string;
  customerId?: string | {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  customerDetails?: {
    firstName?: string;  // Make these optional
    lastName?: string;
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      zipCode?: string;
    }
  };
  items: OrderItem[];
  totalPrice: number;
  status: string;
  paymentMethod: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
  orderNumber?: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}