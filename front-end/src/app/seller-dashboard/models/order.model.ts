export interface Order {
  _id: string;  // Ensure _id is always a string
  customerId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'shipped' | 'completed' | 'cancelled' | 'returned' | 'refunded';
  paymentMethod: 'Cash' | 'Card' | 'Online';
  date?: string;
  customerDetails: CustomerDetails;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  price: number;
  quantity: number;
  _id?: string;
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