
import { Component, OnInit } from '@angular/core';
import { CartService } from './service/cart.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterModule, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '../seller-dashboard/services/product.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, RouterModule, FooterComponent, HeaderComponent]
})
export class CartComponent implements OnInit {

  data: any = {};
  cartItems: any[] = [];
  userId: string = '67b8ed1c1e0dd2e2fc573d63';  // استبدل هذا بمعرف مستخدم صالح
  cartItemCount: number = 0;

  constructor(private cartService: CartService, private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart(this.userId).subscribe(res => {
      console.log('Cart Data:', res);
      this.data = res;
      this.data.Total = 0;

      if (res.items && Array.isArray(res.items)) {
        res.items.forEach((item: any) => {
          this.cartItems.push({
            subInventory: item.subInventory._id,
            branch: item.branch,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
            product: item.subInventory.product,
            subInventoryQuantity: item.subInventory.quantity,
            _id: item._id
          });
        });
      } else {
        console.error('Items data is not available or not an array');
      }

      // Update the cart item count
      this.updateCartRegisteredCustomerProductNum();
    }, error => {
      console.error('Error loading cart:', error);
    });
  }

  increaseQuantity(item: any): void {
    this.cartService.increaseQuantity(this.userId, item.subInventory).subscribe(
      (response) => {
        item.quantity += 1;
        Swal.fire({
          title: 'Quantity Increased!',
          text: `The quantity has been increased.`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Okay'
        });
        this.updateCartRegisteredCustomerProductNum();
      },
      (error) => {
        console.error('Error increasing quantity:', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue increasing the quantity.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    );
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      this.cartService.decreaseQuantity(this.userId, item.subInventory).subscribe(
        (response) => {
          item.quantity -= 1;
          Swal.fire({
            title: 'Quantity Decreased!',
            text: `The quantity has been decreased.`,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Okay'
          });
          this.updateCartRegisteredCustomerProductNum();
        },
        (error) => {
          console.error('Error decreasing quantity:', error);
          Swal.fire({
            title: 'Error!',
            text: 'There was an issue decreasing the quantity.',
            icon: 'error',
            confirmButtonColor: '#d33',
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Warning!',
        text: 'The quantity is 1. If you decrease it further, the item will be removed from the cart. Do you want to proceed?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeItem(item.subInventory);
        }
      });
    }
  }

  removeItem(subInventoryId: string): void {
    this.cartService.removeFromCart(this.userId, subInventoryId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.subInventory !== subInventoryId);
      Swal.fire('Deleted!', 'Your item has been removed.', 'success');
      this.updateCartRegisteredCustomerProductNum();
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  clearCart(): void {
    this.cartService.clearCart(this.userId).subscribe(() => {
      this.cartItems = [];
      this.updateCartRegisteredCustomerProductNum();
    });
  }

  async checkout(): Promise<void> {
    if (this.cartItems.length === 0) {
      Swal.fire({
        title: 'Cart is Empty!',
        text: 'There are no products in your cart.',
        icon: 'warning',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
   
    const isValid = await this.validateCart();
    if (isValid) {
      console.log('Cart is valid. Proceed to checkout.');
      this.router.navigate(['/checkout']).then(success => {
        if (success) {
          console.log('Navigation to checkout successful.');
        } else {
          this.router.navigate(['/checkout']).catch(err => {
            console.error('Navigation to checkout failed:', err);
          });        }
      }).catch(error => {
        console.error('Navigation error:', error);
      });
    } else {
      alert('Cart is invalid. Please fix the issues.');
      this.loadCart(); // Reload the cart if validation fails
    }
  }
  validateCart(): Promise<boolean> {
    return new Promise((resolve) => {
      let isValid = true;
      const removalPromises: Promise<void>[] = [];
  
      this.cartItems.forEach((item, index) => {
        if (!item.product.isActive) {
          Swal.fire({
            title: 'Product Removed!',
            text: `The product ${item.product.name} has been removed from our site and your cart.`,
            icon: 'info',
            confirmButtonColor: '#3085d6'
          });
          removalPromises.push(
            this.cartService.removeFromCart(this.userId, item.subInventory).toPromise().then(() => {
              this.cartItems.splice(index, 1);
              this.updateCartRegisteredCustomerProductNum();
            })
          );
          isValid = false;
        } else if (item.quantity > item.product.quantity) {
          Swal.fire({
            title: 'Quantity Adjusted!',
            text: `The quantity of ${item.product.name} exceeds the available stock. It has been adjusted to ${item.product.quantity}.`,
            icon: 'info',
            confirmButtonColor: '#3085d6'
          });
          item.quantity = item.product.quantity;
          isValid = false;
        } else if (this.isOutOfStock(item)) {
          Swal.fire({
            title: 'Out of Stock!',
            text: `${item.product.name} has been removed from your cart because it is out of stock.`,
            icon: 'warning',
            confirmButtonColor: '#d33',
          });
          removalPromises.push(
            this.cartService.removeFromCart(this.userId, item.subInventory).toPromise().then(() => {
              this.cartItems.splice(index, 1);
              this.updateCartRegisteredCustomerProductNum();
            })
          );
          isValid = false;
        }
      });
  
      Promise.all(removalPromises).then(() => {
        resolve(isValid);
      });
    });
  }

  isOutOfStock(item: any): boolean {
    return item.product.quantity === 0;
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