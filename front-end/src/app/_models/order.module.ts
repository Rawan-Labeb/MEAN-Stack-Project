export interface Order {
    orderId: number;
    customerId: string;
    items: OrderItem[];
    totalPrice: number;
    status: "Pending" | "Shipped" | "Completed" | "Cancelled" | "Returned" | "Refunded";
    paymentMethod: "Cash" | "Card" | "Online";
    date: Date;
    customerDetails: CustomerDetails;
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
  