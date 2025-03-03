export interface ProductRequest {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
  };
  superAdmin: {
    _id: string;
    name: string;
  };
  requestedQuantity: number;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: Date;
}