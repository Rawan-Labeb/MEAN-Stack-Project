import { Component, OnInit } from '@angular/core';
import { CartService } from './service/cart.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterModule, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '../seller-dashboard/services/product.service';

interface cartguestproduct {
  productId: string;
  qty: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, RouterModule]
})
export class CartComponent implements OnInit {

  data: any = {};
  cartItems: any[] = [];
  userId: string = '679bd13b5503613c0a14eb9a';  // 67a79ab7d6859ed22a0d02f4
  cartItemCount: number = 0;

  constructor(private cartService: CartService, private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart(this.userId).subscribe(res => {
      this.data = res;
      this.data.Total = 0;

      if (res.items && Array.isArray(res.items)) {
        res.items.forEach((item: any) => {
          if (item.product) {
            if (!item.product.isActive) {
              Swal.fire({
                title: 'Product Removed!',
                text: `The product ${item.product.name} has been removed from our site and your cart.`,
                icon: 'info',
                confirmButtonColor: '#3085d6'
              }).then(() => {
                this.cartService.removeFromCart(this.userId, item.product._id).subscribe(() => {
                  this.cartItems = this.cartItems.filter(cartItem => cartItem.product._id !== item.product._id);
                  this.updateCartRegisteredCustomerProductNum();
                });
              });
            } else {
              this.data.Total += (item.product.price * item.quantity);
              if (item.quantity > item.product.quantity) {
                Swal.fire({
                  title: 'Quantity Adjusted!',
                  text: `The quantity of ${item.product.name} exceeds the available stock. It has been adjusted to ${item.product.quantity}.`,
                  icon: 'info',
                  confirmButtonColor: '#3085d6'
                });
                item.quantity = item.product.quantity;
              }
              this.cartItems.push({
                product: item.product,
                quantity: item.quantity,
                price: item.product.price,
                image: item.image,
                _id: item._id
              });
            }
          }
        });
      } else {
        console.error('Items data is not available or not an array');
      }

      // Check for out-of-stock items and remove them
      this.checkStockAndRemove();

      // Update the cart item count
      this.updateCartRegisteredCustomerProductNum();
    }, error => {
      console.error('Error loading cart:', error);
    });
  }

  increaseQuantity(item: any): void {
    if (item.quantity < item.product.quantity) {
      this.cartService.increaseQuantity(this.userId, item.product._id).subscribe(
        (response) => {
          item.quantity += 1;
          Swal.fire({
            title: 'Quantity Increased!',
            text: `The quantity of ${item.product.name} has been increased.`,
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
    } else {
      Swal.fire({
        title: 'Error!',
        text: `You cannot increase the quantity beyond the available stock of ${item.product.quantity}.`,
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      this.cartService.decreaseQuantity(this.userId, item.product._id).subscribe(
        (response) => {
          item.quantity -= 1;
          Swal.fire({
            title: 'Quantity Decreased!',
            text: `The quantity of ${item.product.name} has been decreased.`,
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
          this.removeItem(item.product._id);
        }
      });
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(this.userId, productId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.product._id !== productId);
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
  checkout(): void {
    if (this.cartItems.length === 0) {
      Swal.fire({
        title: 'Cart is Empty!',
        text: 'There are no products in your cart.',
        icon: 'warning',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
  
    this.validateCart().then((isValid) => {
      if (isValid) {
        window.location.href = '/checkout';
      } else {
        this.loadCart(); // Reload the cart if validation fails
      }
    });
  }
  validateCart(): Promise<boolean> {
    return new Promise((resolve) => {
      let isValid = true;
      this.cartItems.forEach((item, index) => {
        if (!item.product.isActive) {
          Swal.fire({
            title: 'Product Removed!',
            text: `The product ${item.product.name} has been removed from our site and your cart.`,
            icon: 'info',
            confirmButtonColor: '#3085d6'
          });
          this.cartService.removeFromCart(this.userId, item.product._id).subscribe(() => {
            this.cartItems.splice(index, 1);
            this.updateCartRegisteredCustomerProductNum();
          });
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
          this.cartService.removeFromCart(this.userId, item.product._id).subscribe(() => {
            this.cartItems.splice(index, 1);
            this.updateCartRegisteredCustomerProductNum();
          });
          isValid = false;
        }
      });
      resolve(isValid);
    });
  }

  checkStockAndRemove(): void {
    this.cartItems.forEach((item, index) => {
      if (item.product.quantity === 0) {
        Swal.fire({
          title: 'Out of Stock!',
          text: `${item.product.name} has been removed from your cart because it is out of stock.`,
          icon: 'warning',
          confirmButtonColor: '#d33',
        });

        // Remove the out-of-stock item from the cart
        this.cartService.removeFromCart(this.userId, item.product._id).subscribe(() => {
          this.cartItems.splice(index, 1);
          this.updateCartRegisteredCustomerProductNum();
        });
      }
    });
  }

  isOutOfStock(item: any): boolean {
    return item.product.quantity === 0;
  }

  updateProductToCartGuest(data: any, type: 'more' | 'one'): void {
    const cart = localStorage.getItem('cart');
    let allCartProducts: cartguestproduct[] = cart ? JSON.parse(cart) : [];
    const existingProduct = allCartProducts.find(item => item.productId === data.productId);
    if (!existingProduct && type === 'one') {
      allCartProducts.push(data);
    } else if (existingProduct && type === 'more') {
      existingProduct.qty = data.qty;
    } else if (!existingProduct && type === 'more') {
      allCartProducts.push(data);
    }
    localStorage.setItem('cart', JSON.stringify(allCartProducts));
    this.updateCartRegisteredCustomerProductNum();
  }

  getProductDetails(productId: string): void {
    this.cartService.getProductDetails(this.userId, productId).subscribe(
      (productDetails) => {
        console.log('Product Details:', productDetails);
        // Handle the product details as needed
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  getCartGuest(): Observable<any[]> {
    const cart = localStorage.getItem('cart');
    if (!cart) {
      return new Observable((observer) => observer.next([]));
    }
    let allCartProducts: cartguestproduct[] = JSON.parse(cart);
    const getProductDetailsRequests = allCartProducts.map(product => this.cartService.getProductDetails(this.userId, product.productId));
    return forkJoin(getProductDetailsRequests).pipe(
      map((products: any[]) => {
        return allCartProducts.map((cartProduct, index) => {
          return {
            ...cartProduct,
            productDetails: products[index]
          };
        });
      })
    );
  }

  updateCartRegisteredCustomerProductNum(): void {
    if (this.userId) {
      this.cartService.getCart(this.userId).subscribe(cart => {
        const count = cart.items.length;
        this.cartItemCount = count;
      });
    } else {
      const cart = localStorage.getItem('cart');
      let allCartProducts: cartguestproduct[] = cart ? JSON.parse(cart) : [];
      this.cartItemCount = allCartProducts.length;
    }
  }
  showProductDetails(item: any): void {
    Swal.fire({
      title: item.product.name,
      html: `
        <p><strong>Price:</strong> &euro; ${item.product.price}</p>
        <p><strong>Stock:</strong> ${item.product.quantity} left</p>
        <p><strong>Description:</strong> ${item.product.description}</p>
        <img src="${item.product.images[0]}" alt="Product Image" class="img-fluid">
      `,
      confirmButtonText: 'Close'
    });
  }

  // getImageUrl(imagePath: string): string {
  //   return `${this.cartService.apiUrl}/${imagePath}`;
  // }
}