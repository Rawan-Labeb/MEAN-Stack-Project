export interface Order {
    _id:string;
    orderId: number;
    customerId: string;
    items: OrderItem[];
    totalPrice: number;
    status: "pending" | "shipped" | "completed" | "cancelled" | "returned" | "refunded";
    paymentMethod: "Cash" | "Card" | "Online";
    date: Date;
    customerDetails: CustomerDetails;
    notes?: string; // إضافة حقل notes

  }
  
  export interface OrderItem {
    productId: string;
    price: number;
    quantity: number;
  }
  
  export interface CustomerDetails {
    firstName: string;
    lastName: string;
    address: Address;
    email: string;
    phone: string;
  }
  
  export interface Address {
    street: string;
    city: string;
    zipCode: string;
  }
  