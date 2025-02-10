// export class Order {
//   constructor(
//     public _id: string,
//     public orderId: number,
//     public customerId: string,
//     public items: {
//       productId: string,
//       price: number,
//       quantity: number
//     }[],
//     public totalPrice: number,
//     // public status: 'Pending' | 'Shipped' | 'Completed' | 'Cancelled' | 'Returned' | 'Refunded',
//     public status: string,
//     public paymentMethod: string,
//     //public paymentMethod: 'Cash' | 'Card' | 'Online',
//     public date: Date,
//     public customerDetails: {
//       firstName: string,
//       lastName: string,
//       address: {
//         street: string,
//         city: string,
//         zipCode: string
//       },
//       email: string,
//       phone: string
//     }
//   ) {}
// }


export class Order {
  constructor(
    public _id: string,
    public orderId: number,
    public customerId: string,
    public items: {
      productId: string,
      price: number,
      quantity: number
    }[],
    public totalPrice: number,
    public status: string,
    public paymentMethod: string,
    public date: Date,
    public customerDetails: {
      firstName: string,
      lastName: string,
      address: {
        street: string,
        city: string,
        zipCode: string
      },
      email: string,
      phone: string
    },
    public notes?: string // Add the notes property

  ) {}
}