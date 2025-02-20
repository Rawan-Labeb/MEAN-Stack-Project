export interface SubInventory {
    _id?: string;
    mainInventory: string;
    product: string;
    branch: string;
    quantity: number;
    numberOfSales?: number;
    lastUpdated?: Date;
    active?: boolean;
  }
  