export interface User {
  _id: string;
  role: 'customer' | 'seller' | 'admin' | 'manager';
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address?: Address;
  contactNo?: string;
  image?: string[];
  isActive?: boolean;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}
  