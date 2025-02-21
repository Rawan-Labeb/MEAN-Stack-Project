import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart/service/cart.service';
import { CheckoutService } from './service/checkout.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

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
    const customerId = '67b8ed1c1e0dd2e2fc573d63';
    this.cartService.getCart(customerId).subscribe((res: any) => {
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
      if (item.subInventory.product.quantity === 0) {
        Swal.fire({
          title: 'Out of Stock!',
          text: `${item.subInventory.product.name} has been removed from your cart because it is out of stock.`,
          icon: 'warning',
          confirmButtonColor: '#d33',
        }).then(() => {
          this.removeItem(item.subInventory.product._id);
        });
        isValid = false;
      } else if (item.quantity > item.subInventory.product.quantity) {
        Swal.fire({
          title: 'Quantity Adjusted!',
          text: `The quantity of ${item.subInventory.product.name} exceeds the available stock. It has been adjusted to ${item.subInventory.product.quantity}.`,
          icon: 'info',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          item.quantity = item.subInventory.product.quantity;
        });
        isValid = false;
      } else if (!item.subInventory.product.isActive) {
        Swal.fire({
          title: 'Product Removed!',
          text: `The product ${item.subInventory.product.name} has been removed from our site and your cart.`,
          icon: 'info',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.removeItem(item.subInventory.product._id);
        });
        isValid = false;
      }
    });
    return isValid;
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart('67b8ed1c1e0dd2e2fc573d63', productId).subscribe(() => {
      this.data.items = this.data.items.filter((item: any) => item.subInventory.product._id !== productId);
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

    const customerId = '67b8ed1c1e0dd2e2fc573d63';

    const customerDetails = {
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
        text: 'Please provide a valid email address',
        icon: 'warning',
        confirmButtonColor: '#d33',
      });
      return;
    }
    
    const orderItems = this.data.items.map((item: any) => ({
      productId: item.subInventory.product._id,
      quantity: item.quantity,
      price: item.subInventory.product.price,
      subInventoryId: item.subInventory._id // Ensure subInventoryId is included
    }));
    
    const totalPrice = orderItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
    
    const orderData = {
      customerId,
      items: orderItems,
      totalPrice,
      status: 'pending' as 'pending', // Ensure the status is of type 'pending'
      paymentMethod: this.convertToPaymentMethod(this.paymentMethod),
      customerDetails: {
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        address: {
          street: customerDetails.address.street,
          city: customerDetails.address.city,
          zipCode: customerDetails.address.zipCode
        },
        email: customerDetails.email,
        phone: customerDetails.phone
      },
      notes: this.comments
    };
    
    console.log('Order Data:', orderData);
    
    this.checkoutService.createOrder(orderData).subscribe({
      next: (res: any) => {
        console.log('Order created successfully', res);
        this.cartService.clearCart(customerId).subscribe({
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
  }

  trackByProductId(index: number, item: any): number {
    return item.subInventory.product ? item.subInventory.product._id : index;
  }
}