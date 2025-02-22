
import { Component, OnInit } from '@angular/core';
import { CartService } from './service/cart.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterModule, Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, RouterModule, FooterComponent]
})
export class CartComponent implements OnInit {

  data: any = {};
  cartItems: any[] = [];
  userId: string | null = null;
  cartItemCount: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.getUserIdFromToken();
    if (this.userId) {
      this.loadCart();
    } else {
      console.error("User not authenticated.");
    }
  }

  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.sub; // استخراج userId
    }
    return null;
  }

  loadCart(): void {
    if (!this.userId) return;
    
    this.cartService.getCart(this.userId).subscribe(res => {
      console.log('Cart Data:', res);
      this.data = res;
      this.data.Total = 0;

      if (res.items && Array.isArray(res.items)) {
        this.cartItems = res.items.map((item: any) => ({
          subInventory: item.subInventory._id,
          branch: item.branch,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          product: item.subInventory.product,
          subInventoryQuantity: item.subInventory.quantity,
          _id: item._id
        }));
      } else {
        console.error('Items data is not available or not an array');
      }
      this.updateCartRegisteredCustomerProductNum();
    }, error => {
      console.error('Error loading cart:', error);
    });
  }

  increaseQuantity(item: any): void {
    if (!this.userId) return;
    
    this.cartService.increaseQuantity(this.userId, item.subInventory).subscribe(
      () => {
        item.quantity += 1;
        this.updateCartRegisteredCustomerProductNum();
      },
      error => console.error('Error increasing quantity:', error)
    );
  }

  decreaseQuantity(item: any): void {
    if (!this.userId) return;
    
    if (item.quantity > 1) {
      this.cartService.decreaseQuantity(this.userId, item.subInventory).subscribe(
        () => {
          item.quantity -= 1;
          this.updateCartRegisteredCustomerProductNum();
        },
        error => console.error('Error decreasing quantity:', error)
      );
    } else {
      this.removeItem(item.subInventory);
    }
  }

  removeItem(subInventoryId: string): void {
    if (!this.userId) return;
    
    this.cartService.removeFromCart(this.userId, subInventoryId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.subInventory !== subInventoryId);
      this.updateCartRegisteredCustomerProductNum();
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  clearCart(): void {
    if (!this.userId) return;
    
    this.cartService.clearCart(this.userId).subscribe(() => {
      this.cartItems = [];
      this.updateCartRegisteredCustomerProductNum();
    });
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      Swal.fire({ title: 'Cart is Empty!', text: 'There are no products in your cart.', icon: 'warning' });
      return;
    }
    this.router.navigate(['/checkout']);
  }

  updateCartRegisteredCustomerProductNum(): void {
        if (this.userId) {
          this.cartService.getCart(this.userId).subscribe(cart => {
            const count = cart.items.length;
            this.cartItemCount = count;
          });
        } else {
          const cart = localStorage.getItem('cart');
          let allCartProducts: any[] = cart ? JSON.parse(cart) : [];
          this.cartItemCount = allCartProducts.length;
        }
      }
    
      showProductDetails(item: any): void {
        Swal.fire({
          title: item.product.name,
          html: `
            <p><strong>Price:</strong> &euro; ${item.product.price}</p>
            <p><strong>ONLY</strong> ${item.subInventoryQuantity} left</p>
            <p><strong>Description:</strong> ${item.product.description}</p>
            <img src="${item.product.images[0]}" alt="Product Image" class="img-fluid">
          `,
          confirmButtonText: 'Close'
        });
      }
}