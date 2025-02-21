export interface OfflineOrder {
    _id: string;
    items: OrderItem[];
    totalPrice: number;
    date?: string;
    branch: Branch;
    status: 'completed' | 'canceled';
  }
  
  export interface OrderItem {
    _id: string;
    subInventoryId: SubInventory;
    price: number;
    quantity: number;
  }
  
  export interface SubInventory {
    _id: string;
    mainInventory: string;
    product: string;
    branch: string;
    quantity: number;
    numberOfSales: number;
    active: boolean;
    lastUpdated: string;
  }
  
  export interface Branch {
    _id: string;
    branchName: string;
    location: string;
    contactNumber: string;
    type: 'offline' | 'online';
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  