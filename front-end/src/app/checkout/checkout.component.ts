// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { CartService } from '../cart/service/cart.service';
// import { OrderService } from './service/order.service';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css'],
//   standalone: true,
//   imports: [CommonModule]
// })
// export class CheckoutComponent implements OnInit {
//   @ViewChild('firstName') firstName!: ElementRef;
//   @ViewChild('lastName') lastName!: ElementRef;
//   @ViewChild('address') address!: ElementRef;
//   @ViewChild('street') street!: ElementRef;
//   @ViewChild('city') city!: ElementRef;
//   @ViewChild('zipCode') zipCode!: ElementRef;
//   @ViewChild('phoneNumber') phoneNumber!: ElementRef;
//   @ViewChild('email') email!: ElementRef;
//   @ViewChild('paymentMethod') paymentMethod!: ElementRef;

//   data: any = {};
//   governorates = [
//     { name: 'Cairo', cities: ['Nasr City', 'Heliopolis', 'Maadi', 'Shubra', 'Zamalek', 'New Cairo'] },
//     { name: 'Alexandria', cities: ['Sidi Gaber', 'Mansheya', 'Smouha', 'Montaza', 'Borg El Arab'] },
//     { name: 'Giza', cities: ['Dokki', 'Mohandessin', 'Haram', '6th of October', 'Sheikh Zayed'] },
//     { name: 'Qalyubia', cities: ['Banha', 'Shibin El Qanater', 'Khosous'] },
//     { name: 'Port Said', cities: ['Al Manakh', 'Al Sharq', 'Al Zohour'] },
//     { name: 'Suez', cities: ['Arbaeen', 'Ganayen', 'Faisal'] },
//     { name: 'Sharqia', cities: ['Zagazig', 'Belbeis', 'Minya Al Qamh'] },
//     { name: 'Dakahlia', cities: ['Mansoura', 'Talkha', 'Mit Ghamr'] },
//     { name: 'Aswan', cities: ['Aswan City', 'Kom Ombo', 'Edfu'] },
//     { name: 'Asyut', cities: ['Asyut City', 'Dairut', 'Manfalut'] },
//     { name: 'Beheira', cities: ['Damanhour', 'Kafr El Dawar', 'Rashid'] },
//     { name: 'Beni Suef', cities: ['Beni Suef City', 'Biba', 'El Wasta'] },
//     { name: 'Fayoum', cities: ['Fayoum City', 'Tamiya', 'Sinnuris'] },
//     { name: 'Gharbia', cities: ['Tanta', 'El Mahalla El Kubra', 'Zefta'] },
//     { name: 'Ismailia', cities: ['Ismailia City', 'Fayed', 'Al Qantara'] },
//     { name: 'Kafr El Sheikh', cities: ['Kafr El Sheikh City', 'Desouk', 'Baltim'] },
//     { name: 'Matruh', cities: ['Marsa Matruh', 'Siwa', 'El Dabaa'] },
//     { name: 'Minya', cities: ['Minya City', 'Mallawi', 'Beni Mazar'] },
//     { name: 'Monufia', cities: ['Shibin El Kom', 'Menouf', 'Ashmoun'] },
//     { name: 'New Valley', cities: ['Kharga', 'Dakhla', 'Farafra'] },
//     { name: 'North Sinai', cities: ['Arish', 'Sheikh Zuweid', 'Rafah'] },
//     { name: 'Qena', cities: ['Qena City', 'Nag Hammadi', 'Luxor'] },
//     { name: 'Red Sea', cities: ['Hurghada', 'Safaga', 'Marsa Alam'] },
//     { name: 'Sohag', cities: ['Sohag City', 'Girga', 'Akhmim'] },
//     { name: 'South Sinai', cities: ['Sharm El Sheikh', 'Dahab', 'Nuweiba'] },
//     { name: 'Damietta', cities: ['Damietta City', 'New Damietta', 'Faraskour'] },
//     { name: 'Luxor', cities: ['Luxor City', 'Esna', 'Armant'] }
//   ];

//   selectedGovernorate: string = '';
//   cities: string[] = [];

//   constructor(
//     private cartService: CartService,
//     private orderService: OrderService,
//     private router: Router,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     const userId = '679bd13b5503613c0a14eb9a';
//     this.cartService.getCart(userId).subscribe((res: any) => {
//       console.log(res.items);
//       this.data = res;
//       this.data.Total = 0;
//       if (res.items && Array.isArray(res.items)) {
//         res.items.forEach((item: any) => {
//           this.data.Total += item.price * item.quantity;
//         });
//       } else {
//         console.error('Product data is not available or not an array');
//       }
//     }, error => {
//       console.error('Error loading cart:', error);
//     });
//   }

//   onGovernorateChange(event: Event) {
//     const target = event.target as HTMLSelectElement;
//     const governorate = target.value;
//     this.selectedGovernorate = governorate;
//     const selected = this.governorates.find(g => g.name === governorate);
//     this.cities = selected ? selected.cities : [];
//   }

//   convertToPaymentMethod(value: string): 'Cash' | 'Card' | 'Online' {
//     if (value === 'Cash' || value === 'Card' || value === 'Online') {
//       return value;
//     }
//     throw new Error('Invalid payment method');
//   }

//   // placeOrder(): void {
//   //   const userId = '679bd13b5503613c0a14eb9a';
//   //   const customerDetails = {
//   //     address: this.address.nativeElement.value,
//   //     city: this.city.nativeElement.value,
//   //     zipCode: this.zipCode.nativeElement.value,
//   //     phone: this.phoneNumber.nativeElement.value,
//   //     email: this.email.nativeElement.value,
//   //     firstName: this.firstName.nativeElement.value,
//   //     lastName: this.lastName.nativeElement.value,
//   //     street: this.street.nativeElement.value
//   //   };

//   //   if (!(customerDetails.address && customerDetails.city && customerDetails.zipCode && customerDetails.phone && customerDetails.email && customerDetails.firstName && customerDetails.lastName && customerDetails.street)) {
//   //     console.error('Please complete your billing details');
//   //     return;
//   //   }

    

//   //   const orderData = {
//   //     userId,
//   //     productId: '679bd316017427c66ece2617', // يمكنك تحديث هذا حسب الحاجة
//   //     quantity: 1, // يمكنك تحديث هذا حسب الحاجة
//   //     status: 'Pending',
//   //     paymentMethod: this.convertToPaymentMethod(this.paymentMethod.nativeElement.value),
//   //     customerDetails: {
//   //       firstName: customerDetails.firstName,
//   //       lastName: customerDetails.lastName,
//   //       address: {
//   //         street: customerDetails.street,
//   //         city: customerDetails.city,
//   //         zipCode: customerDetails.zipCode
//   //       },
//   //       email: customerDetails.email,
//   //       phone: customerDetails.phone
//   //     }
//   //   };

//   //   console.log('Order Data:', orderData); // عرض بيانات الطلب في وحدة التحكم

//   //   this.orderService.createOrder(orderData).subscribe({
//   //     next: (res: any) => {
//   //       console.log('Order created successfully', res);
//   //       this.cartService.clearCart(userId).subscribe({
//   //         next: () => {
//   //           console.log('Cart cleared successfully');
//   //           this.router.navigate(['/']);
//   //         },
//   //         error: (err: any) => {
//   //           console.error('Error clearing cart', err);
//   //         }
//   //       });
//   //     },
//   //     error: (err: any) => {
//   //       console.error('Error creating order', err);
//   //     }
//   //   });
//   // }


//   placeOrder(): void {
//     const userId = '679bd13b5503613c0a14eb9a';
//     // const userId = '67a79ab7d6859ed22a0d02f4'; // Remove the extra space

//     const customerDetails = {
//       address: this.address.nativeElement.value,
//       city: this.city.nativeElement.value,
//       zipCode: this.zipCode.nativeElement.value,
//       phone: this.phoneNumber.nativeElement.value,
//       email: this.email.nativeElement.value,
//       firstName: this.firstName.nativeElement.value,
//       lastName: this.lastName.nativeElement.value,
//       street: this.street.nativeElement.value
//     };
  
//     if (!(customerDetails.address && customerDetails.city && customerDetails.zipCode && customerDetails.phone && customerDetails.email && customerDetails.firstName && customerDetails.lastName && customerDetails.street)) {
//       console.error('Please complete your billing details');
//       return;
//     }
  
//     const orderItems = this.data.items.map((item: any) => ({
//       productId: item.product._id,
//       quantity: item.quantity,
//       price: item.product.price
//     }));
  
//     const totalPrice = orderItems.reduce((total:number, item:any) => total + item.price * item.quantity, 0);
  
//     const orderData = {
//       userId,
//       items: orderItems,
//       totalPrice,
//       status: 'Pending',
//       paymentMethod: this.convertToPaymentMethod(this.paymentMethod.nativeElement.value),
//       customerDetails: {
//         firstName: customerDetails.firstName,
//         lastName: customerDetails.lastName,
//         address: {
//           street: customerDetails.street,
//           city: customerDetails.city,
//           zipCode: customerDetails.zipCode
//         },
//         email: customerDetails.email,
//         phone: customerDetails.phone
//       }
//     };
  
//     console.log('Order Data:', orderData); // Log the order data for debugging
  
//     this.orderService.createOrder(orderData).subscribe({
//       next: (res: any) => {
//         console.log('Order created successfully', res);
//         this.cartService.clearCart(userId).subscribe({
//           next: () => {
//             console.log('Cart cleared successfully');
//             this.router.navigate(['/']);
//           },
//           error: (err: any) => {
//             console.error('Error clearing cart', err);
//           }
//         });
//       },
//       error: (err: any) => {
//         console.error('Error creating order', err);
//       }
//     });
//   }
//   trackByProductId(index: number, item: any): number {
//     return item.product._id;
//   }
// }

////////////////////////////////////////////////

// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { CartService } from '../cart/service/cart.service';
// import { OrderService } from './service/order.service';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms'; // Import FormsModule
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule] // Add FormsModule to imports array
// })
// export class CheckoutComponent implements OnInit {
//   @ViewChild('firstName') firstName!: ElementRef;
//   @ViewChild('lastName') lastName!: ElementRef;
//   @ViewChild('address') address!: ElementRef;
//   @ViewChild('street') street!: ElementRef;
//   @ViewChild('city') city!: ElementRef;
//   @ViewChild('zipCode') zipCode!: ElementRef;
//   @ViewChild('phoneNumber') phoneNumber!: ElementRef;
//   @ViewChild('email') email!: ElementRef;
//   @ViewChild('paymentMethod') paymentMethod!: ElementRef;

//   data: any = {};
//   governorates = [
//     { name: 'Cairo', cities: ['Nasr City', 'Heliopolis', 'Maadi', 'Shubra', 'Zamalek', 'New Cairo'] },
//     { name: 'Alexandria', cities: ['Sidi Gaber', 'Mansheya', 'Smouha', 'Montaza', 'Borg El Arab'] },
//     { name: 'Giza', cities: ['Dokki', 'Mohandessin', 'Haram', '6th of October', 'Sheikh Zayed'] },
//     { name: 'Qalyubia', cities: ['Banha', 'Shibin El Qanater', 'Khosous'] },
//     { name: 'Port Said', cities: ['Al Manakh', 'Al Sharq', 'Al Zohour'] },
//     { name: 'Suez', cities: ['Arbaeen', 'Ganayen', 'Faisal'] },
//     { name: 'Sharqia', cities: ['Zagazig', 'Belbeis', 'Minya Al Qamh'] },
//     { name: 'Dakahlia', cities: ['Mansoura', 'Talkha', 'Mit Ghamr'] },
//     { name: 'Aswan', cities: ['Aswan City', 'Kom Ombo', 'Edfu'] },
//     { name: 'Asyut', cities: ['Asyut City', 'Dairut', 'Manfalut'] },
//     { name: 'Beheira', cities: ['Damanhour', 'Kafr El Dawar', 'Rashid'] },
//     { name: 'Beni Suef', cities: ['Beni Suef City', 'Biba', 'El Wasta'] },
//     { name: 'Fayoum', cities: ['Fayoum City', 'Tamiya', 'Sinnuris'] },
//     { name: 'Gharbia', cities: ['Tanta', 'El Mahalla El Kubra', 'Zefta'] },
//     { name: 'Ismailia', cities: ['Ismailia City', 'Fayed', 'Al Qantara'] },
//     { name: 'Kafr El Sheikh', cities: ['Kafr El Sheikh City', 'Desouk', 'Baltim'] },
//     { name: 'Matruh', cities: ['Marsa Matruh', 'Siwa', 'El Dabaa'] },
//     { name: 'Minya', cities: ['Minya City', 'Mallawi', 'Beni Mazar'] },
//     { name: 'Monufia', cities: ['Shibin El Kom', 'Menouf', 'Ashmoun'] },
//     { name: 'New Valley', cities: ['Kharga', 'Dakhla', 'Farafra'] },
//     { name: 'North Sinai', cities: ['Arish', 'Sheikh Zuweid', 'Rafah'] },
//     { name: 'Qena', cities: ['Qena City', 'Nag Hammadi', 'Luxor'] },
//     { name: 'Red Sea', cities: ['Hurghada', 'Safaga', 'Marsa Alam'] },
//     { name: 'Sohag', cities: ['Sohag City', 'Girga', 'Akhmim'] },
//     { name: 'South Sinai', cities: ['Sharm El Sheikh', 'Dahab', 'Nuweiba'] },
//     { name: 'Damietta', cities: ['Damietta City', 'New Damietta', 'Faraskour'] },
//     { name: 'Luxor', cities: ['Luxor City', 'Esna', 'Armant'] }
//   ];

//   selectedGovernorate: string = '';
//   cities: string[] = [];

//   constructor(
//     private cartService: CartService,
//     private orderService: OrderService,
//     private router: Router,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     const userId = '679bd13b5503613c0a14eb9a';
//     this.cartService.getCart(userId).subscribe((res: any) => {
//       console.log(res.items);
//       this.data = res;
//       this.data.Total = 0;
//       if (res.items && Array.isArray(res.items)) {
//         res.items.forEach((item: any) => {
//           this.data.Total += item.price * item.quantity;
//         });
//         this.validateCartItems();
//       } else {
//         console.error('Product data is not available or not an array');
//       }
//     }, error => {
//       console.error('Error loading cart:', error);
//     });
//   }

//   validateCartItems(): boolean {
//     let isValid = true;
//     this.data.items.forEach((item: any, index: number) => {
//       if (item.product.quantity === 0) {
//         Swal.fire({
//           title: 'Out of Stock!',
//           text: `${item.product.name} has been removed from your cart because it is out of stock.`,
//           icon: 'warning',
//           confirmButtonColor: '#d33',
//         }).then(() => {
//           this.removeItem(item.product._id);
//         });
//         isValid = false;
//       } else if (item.quantity > item.product.quantity) {
//         Swal.fire({
//           title: 'Quantity Adjusted!',
//           text: `The quantity of ${item.product.name} exceeds the available stock. It has been adjusted to ${item.product.quantity}.`,
//           icon: 'info',
//           confirmButtonColor: '#3085d6'
//         }).then(() => {
//           item.quantity = item.product.quantity;
//         });
//         isValid = false;
//       } else if (!item.product.isActive) {
//         Swal.fire({
//           title: 'Product Removed!',
//           text: `The product ${item.product.name} has been removed from our site and your cart.`,
//           icon: 'info',
//           confirmButtonColor: '#3085d6'
//         }).then(() => {
//           this.removeItem(item.product._id);
//         });
//         isValid = false;
//       }
//     });
//     return isValid;
//   }

//   removeItem(productId: string): void {
//     this.cartService.removeFromCart('679bd13b5503613c0a14eb9a', productId).subscribe(() => {
//       this.data.items = this.data.items.filter((item: any) => item.product._id !== productId);
//     });
//   }

//   onGovernorateChange(event: Event) {
//     const target = event.target as HTMLSelectElement;
//     const governorate = target.value;
//     this.selectedGovernorate = governorate;
//     const selected = this.governorates.find(g => g.name === governorate);
//     this.cities = selected ? selected.cities : [];
//   }

//   convertToPaymentMethod(value: string): 'Cash' | 'Card' | 'Online' {
//     if (value === 'Cash' || value === 'Card' || value === 'Online') {
//       return value;
//     }
//     throw new Error('Invalid payment method');
//   }

//   placeOrder(): void {
//     if (!this.validateCartItems()) {
//       return;
//     }

//     const userId = '679bd13b5503613c0a14eb9a';

//     const customerDetails = {
//       address: this.address.nativeElement.value,
//       city: this.city.nativeElement.value,
//       zipCode: this.zipCode.nativeElement.value,
//       phone: this.phoneNumber.nativeElement.value,
//       email: this.email.nativeElement.value,
//       firstName: this.firstName.nativeElement.value,
//       lastName: this.lastName.nativeElement.value,
//       street: this.street.nativeElement.value
//     };
  
//     if (!(customerDetails.address && customerDetails.city && customerDetails.zipCode && customerDetails.phone && customerDetails.email && customerDetails.firstName && customerDetails.lastName && customerDetails.street)) {
//       console.error('Please complete your billing details');
//       return;
//     }
  
//     const orderItems = this.data.items.map((item: any) => ({
//       productId: item.product._id,
//       quantity: item.quantity,
//       price: item.product.price
//     }));
  
//     const totalPrice = orderItems.reduce((total:number, item:any) => total + item.price * item.quantity, 0);
  
//     const orderData = {
//       userId,
//       items: orderItems,
//       totalPrice,
//       status: 'Pending',
//       paymentMethod: this.convertToPaymentMethod(this.paymentMethod.nativeElement.value),
//       customerDetails: {
//         firstName: customerDetails.firstName,
//         lastName: customerDetails.lastName,
//         address: {
//           street: customerDetails.street,
//           city: customerDetails.city,
//           zipCode: customerDetails.zipCode
//         },
//         email: customerDetails.email,
//         phone: customerDetails.phone
//       },
//       notes: (document.getElementById('comments') as HTMLInputElement).value // Add the notes property
//     };
  
//     console.log('Order Data:', orderData); // Log the order data for debugging
  
//     this.orderService.createOrder(orderData).subscribe({
//       next: (res: any) => {
//         console.log('Order created successfully', res);
//         this.cartService.clearCart(userId).subscribe({
//           next: () => {
//             console.log('Cart cleared successfully');
//             Swal.fire({
//               title: 'Order Successful!',
//               text: 'Your order has been placed successfully.',
//               icon: 'success',
//               confirmButtonColor: '#3085d6'
//             }).then(() => {
//               this.router.navigate(['/']);
//             });
//           },
//           error: (err: any) => {
//             console.error('Error clearing cart', err);
//           }
//         });
//       },
//       error: (err: any) => {
//         console.error('Error creating order', err);
//       }
//     });
//   }

//   trackByProductId(index: number, item: any): number {
//     return item.product._id;
//   }
// }
//////

import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart/service/cart.service';
import { CheckoutService } from '../checkout/service/checkout.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Order, OrderItem, CustomerDetails, Address } from '../_models/order.module';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CheckoutComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  address: string = '';
  street: string = '';
  city: string = '';
  zipCode: string = '';
  phoneNumber: string = '';
  email: string = '';
  paymentMethod: string = 'Cash';
  comments: string = '';

  data: any = {};
  governorates = [
    { name: 'Cairo', cities: ['Nasr City', 'Heliopolis', 'Maadi', 'Shubra', 'Zamalek', 'New Cairo'] },
    { name: 'Alexandria', cities: ['Sidi Gaber', 'Mansheya', 'Smouha', 'Montaza', 'Borg El Arab'] },
    { name: 'Giza', cities: ['Dokki', 'Mohandessin', 'Haram', '6th of October', 'Sheikh Zayed'] },
    { name: 'Qalyubia', cities: ['Banha', 'Shibin El Qanater', 'Khosous'] },
    { name: 'Port Said', cities: ['Al Manakh', 'Al Sharq', 'Al Zohour'] },
    { name: 'Suez', cities: ['Arbaeen', 'Ganayen', 'Faisal'] },
    { name: 'Sharqia', cities: ['Zagazig', 'Belbeis', 'Minya Al Qamh'] },
    { name: 'Dakahlia', cities: ['Mansoura', 'Talkha', 'Mit Ghamr'] },
    { name: 'Aswan', cities: ['Aswan City', 'Kom Ombo', 'Edfu'] },
    { name: 'Asyut', cities: ['Asyut City', 'Dairut', 'Manfalut'] },
    { name: 'Beheira', cities: ['Damanhour', 'Kafr El Dawar', 'Rashid'] },
    { name: 'Beni Suef', cities: ['Beni Suef City', 'Biba', 'El Wasta'] },
    { name: 'Fayoum', cities: ['Fayoum City', 'Tamiya', 'Sinnuris'] },
    { name: 'Gharbia', cities: ['Tanta', 'El Mahalla El Kubra', 'Zefta'] },
    { name: 'Ismailia', cities: ['Ismailia City', 'Fayed', 'Al Qantara'] },
    { name: 'Kafr El Sheikh', cities: ['Kafr El Sheikh City', 'Desouk', 'Baltim'] },
    { name: 'Matruh', cities: ['Marsa Matruh', 'Siwa', 'El Dabaa'] },
    { name: 'Minya', cities: ['Minya City', 'Mallawi', 'Beni Mazar'] },
    { name: 'Monufia', cities: ['Shibin El Kom', 'Menouf', 'Ashmoun'] },
    { name: 'New Valley', cities: ['Kharga', 'Dakhla', 'Farafra'] },
    { name: 'North Sinai', cities: ['Arish', 'Sheikh Zuweid', 'Rafah'] },
    { name: 'Qena', cities: ['Qena City', 'Nag Hammadi', 'Luxor'] },
    { name: 'Red Sea', cities: ['Hurghada', 'Safaga', 'Marsa Alam'] },
    { name: 'Sohag', cities: ['Sohag City', 'Girga', 'Akhmim'] },
    { name: 'South Sinai', cities: ['Sharm El Sheikh', 'Dahab', 'Nuweiba'] },
    { name: 'Damietta', cities: ['Damietta City', 'New Damietta', 'Faraskour'] },
    { name: 'Luxor', cities: ['Luxor City', 'Esna', 'Armant'] }
  ];

  selectedGovernorate: string = '';
  cities: string[] = [];

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userId = '67a79ab7d6859ed22a0d02f4';
    this.cartService.getCart(userId).subscribe((res: any) => {
      console.log(res.items);
      this.data = res;
      this.data.Total = 0;
      if (res.items && Array.isArray(res.items)) {
        res.items.forEach((item: any) => {
          this.data.Total += item.price * item.quantity;
        });
      } else {
        console.error('Product data is not available or not an array');
      }
    }, error => {
      console.error('Error loading cart:', error);
    });
  }

  validateCartItems(): boolean {
    let isValid = true;
    this.data.items.forEach((item: any, index: number) => {
      if (item.product.quantity === 0) {
        Swal.fire({
          title: 'Out of Stock!',
          text: `${item.product.name} has been removed from your cart because it is out of stock.`,
          icon: 'warning',
          confirmButtonColor: '#d33',
        }).then(() => {
          this.removeItem(item.product._id);
        });
        isValid = false;
      } else if (item.quantity > item.product.quantity) {
        Swal.fire({
          title: 'Quantity Adjusted!',
          text: `The quantity of ${item.product.name} exceeds the available stock. It has been adjusted to ${item.product.quantity}.`,
          icon: 'info',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          item.quantity = item.product.quantity;
        });
        isValid = false;
      } else if (!item.product.isActive) {
        Swal.fire({
          title: 'Product Removed!',
          text: `The product ${item.product.name} has been removed from our site and your cart.`,
          icon: 'info',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.removeItem(item.product._id);
        });
        isValid = false;
      }
    });
    return isValid;
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart('67a79ab7d6859ed22a0d02f4', productId).subscribe(() => {
      this.data.items = this.data.items.filter((item: any) => item.product._id !== productId);
    });
  }

  onGovernorateChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const governorate = target.value;
    this.selectedGovernorate = governorate;
    const selected = this.governorates.find(g => g.name === governorate);
    this.cities = selected ? selected.cities : [];
  }

  convertToPaymentMethod(value: string): 'Cash' | 'Card' | 'Online' {
    if (value === 'Cash' || value === 'Card' || value === 'Online') {
      return value;
    }
    throw new Error('Invalid payment method');
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  placeOrder(): void {
    if (!this.validateCartItems()) {
      return;
    }

    const userId = '67a79ab7d6859ed22a0d02f4';

    const customerDetails: CustomerDetails = {
      firstName: this.firstName,
      lastName: this.lastName,
      address: {
        street: this.street,
        city: this.city,
        zipCode: this.zipCode
      },
      email: this.email,
      phone: this.phoneNumber
    };

    // Log customer details for debugging
    console.log('Customer Details:', customerDetails);

    if (!(customerDetails.address.street && customerDetails.address.city && customerDetails.address.zipCode && customerDetails.phone && customerDetails.email && customerDetails.firstName && customerDetails.lastName)) {
      console.error('Please complete your billing details');
      Swal.fire({
        title: 'Incomplete Details',
        text: 'Please complete your billing details',
        icon: 'warning',
        confirmButtonColor: '#d33',
      });
      return;
    }

    if (!this.isValidEmail(customerDetails.email)) {
      console.error('Invalid email address');
      Swal.fire({
        title: 'Incomplete Details',
        text: 'Please A Valid Email Address',
        icon: 'warning',
        confirmButtonColor: '#d33',
      });
      return;
    }
    
    const orderItems: OrderItem[] = this.data.items.map((item: any) => ({
      productId: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));
    
    const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    
    const orderData: Order = {
      // _id: '', // Use empty string as _id for new orders
      orderId: Date.now(), // Use current timestamp as orderId
      customerId: userId,
      items: orderItems,
      totalPrice,
      status: 'pending',
      paymentMethod: this.convertToPaymentMethod(this.paymentMethod),
      date: new Date(),
      customerDetails: {
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        address: {
          street: customerDetails.address.street, // Corrected this line
          city: customerDetails.address.city,
          zipCode: customerDetails.address.zipCode
        },
        email: customerDetails.email,
        phone: customerDetails.phone
      },
      notes: this.comments
    };
    
    // Log order data for debugging
    console.log('Order Data:', orderData);
    
    this.checkoutService.createOrder(orderData).subscribe({
      next: (res: any) => {
        console.log('Order created successfully', res);
        this.cartService.clearCart(userId).subscribe({
          next: () => {
            console.log('Cart cleared successfully');
            Swal.fire({
              title: 'Order Successful!',
              text: 'Your order has been placed successfully.',
              icon: 'success',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              this.router.navigate(['/']);
            });
          },
          error: (err: any) => {
            console.error('Error clearing cart', err);
          }
        });
      },
      error: (err: any) => {
        console.error('Error creating order', err);
      }
    });

    // Log order data for debugging
    console.log('Order Data:', orderData);
  }

  trackByProductId(index: number, item: any): number {
    return item.product._id;
  }
}