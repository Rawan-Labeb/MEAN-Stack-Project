export interface ProductReview {
  _id: string;
  product: {
    name: string;
    image: string;
  };
  customer: {
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: Date;
}