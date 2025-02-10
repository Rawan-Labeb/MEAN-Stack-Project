// export interface IProduct {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
//   quantity: number;
// }

// // This model represents the cart items
// export interface ICartProduct {
//   _id: string;
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//     quantity: number;
//     images: string[];
//   };
//   image: string;
//   quantity: number;
//   price: number;
// }

// export interface ICartRes {
//   status: string;
//   data: ICartData;
//   numOfCartItems: number;
// }

// export interface ICartData {
//   _id: string;
//   user: string;
//   items: ICartProduct[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   totalCartPrice: number;
// }
export class Cart {
  constructor(
    public _id: string,
    public cart_id: string,
    public product: {
      product_id: string,
      seller_id: string,
      name: string,
      qty: number,
      price: number,
      _id: string,
      pic_path: string[]
    }[],
    public customer_id: string,
    public createdAt: Date,
    public updatedAt: Date,
    public Total: number,
  ) {}
}
// //////
// export interface ICartRes {
//   status: string;
//   data: ICartData;
//   numOfCartItems: number;
// }

// export interface ICartData {
//   _id: string;
//   user: string;
//   items: ICartProduct[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   totalCartPrice: number;
// }

// export interface ICartProduct {
//   _id: string;
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//     quantity: number;
//     images: string[];
//     description: string;
//     isActive: boolean;
//   };
//   image: string;
//   quantity: number;
//   price: number;
// }
