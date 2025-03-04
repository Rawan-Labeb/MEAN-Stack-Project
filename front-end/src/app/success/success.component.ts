import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart/service/cart.service';
import { CheckoutService } from '../checkout/service/checkout.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService 
  ) {}
  userId: string = ''; 
  data: any = {};


  ngOnInit(): void {
    this.getBillingDetails();
    this.getUserIdFromToken();
    
    this.cartService.getCart(this.userId).subscribe(
      (res: any) => {
        console.log(res.items);
        this.data = res;
        this.data.Total = res.items?.reduce((total: number, item: any) => total + item.price * item.quantity, 0) || 0;

        const orderItems = this.data.items.map((item: any) => ({
          productId: item.subInventory.product._id,
          quantity: item.quantity,
          price: item.subInventory.product.price,
          subInventoryId: item.subInventory._id
        }));
        
        const orderData = {
          customerId: this.userId, 
          items: orderItems,
          totalPrice: orderItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0),
          status: 'pending',
          paymentMethod: 'Online',
          customerDetails:this.customerDetails,
          notes: ''
        };

        this.checkoutService.createOrder(orderData).subscribe({
              next: (res: any) => {
                console.log('Order created successfully', res);
                  this.cartService.clearCart(this.userId).subscribe(() => {
                    this.router.navigate(['/']);
                  });
                
              },
              error: (err: any) => {
                console.error('Error creating order', err);
                
              }
            });
        


      },
      error => console.error('Error loading cart:', error)
    );
    
  }
  getUserIdFromToken(): void {
    const token = this.cookieService.get('token'); 
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); 
        this.userId = payload.sub; 
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }
  customerDetails:any;

  getBillingDetails() {
    const cart = localStorage.getItem('customerDetails');
    this.customerDetails = JSON.parse(cart!)
  }

}
