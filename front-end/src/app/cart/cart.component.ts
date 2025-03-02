
import { Component, OnInit } from '@angular/core';
import { CartService } from './service/cart.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterModule, Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CookieService } from 'ngx-cookie-service';
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
  branchId:  null = null;
  quantity: number = 0; 


  constructor(private cartService: CartService, private router: Router, private cookieService: CookieService) {}
  ngOnInit(): void {
    this.getUserIdFromToken();
    console.log("Extracted User ID:", this.userId);
  
    if (!this.userId) {
      console.error('User ID not found!');
      Swal.fire('Error', 'User not authenticated!', 'error');
      this.loadGuestCart(); 
      return;
    }
  
    this.branchId = this.branchId;
  
    if (this.userId) {
      this.loadCart(); 
    } else {
      console.error("User not authenticated.");
    }
  }
  // ngOnInit(): void {
  //   this.getUserIdFromToken();
  //   console.log("Extracted User ID:", this.userId);
  
  //   if (!this.userId) {
  //     console.error('User ID not found!');
  //     Swal.fire('Error', 'User not authenticated!', 'error');
  //     this.loadGuestCart();
  //     return;
  //   }
  
  //   this.branchId = this.branchId;
  
  //   if (this.userId) {
  //     this.loadCart();
  
  //     // إذا كانت سلة الضيف موجودة في localStorage، نقوم بنقلها إلى سلة المستخدم
  //     const guestCart = localStorage.getItem('guestCart');
  //     if (guestCart) {
  //       const guestItems = JSON.parse(guestCart);
  //       this.cartService.addToCart(this.userId, guestItems, this.quantity).subscribe(() => {
  //         // بعد النقل، نقوم بإفراغ سلة الضيف في localStorage
  //         localStorage.removeItem('guestCart');
  //         this.loadCart(); // تحميل السلة الجديدة من الـ Backend
  //       });
  //     }
  //   } else {
  //     console.error("User not authenticated.");
  //   }
  // }
  
  loadGuestCart(): void {
  const cart = localStorage.getItem('guestCart');
  if (cart) {
    this.cartItems = JSON.parse(cart);
    this.cartItemCount = this.cartItems.length;
  } else {
    this.cartItems = [];
    this.cartItemCount = 0;
  }
}

addItemToCart(item: any): void {
  if (!this.userId) {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    guestCart.push(item);
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
  } else {
    this.cartService.addToCart(this.userId, item, this.quantity).subscribe();
  }
}

  
  getUserIdFromToken(): void {
    const token = this.cookieService.get('token'); 
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userId = decodedToken.sub;
        this.branchId = decodedToken.branchId;
        console.log('Decoded Token:', decodedToken);  
        console.log('User ID:', this.userId);        
        console.log('Branch ID:', this.branchId);     
        console.log('Authentication Success');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }
  
  
  loadCart(): void {
    this.cartService.getCart(this.userId!).subscribe(res => {
      this.data = res;
      this.data.Total = 0;
      this.cartItems = []; 
  
      if (res.items && Array.isArray(res.items)) {
        res.items.forEach((item: any) => {
          const subInventory = item.subInventory;
          const product = subInventory?.product;
  
          if (product) {
            if (!product.isActive) {
              return;
            }
  
            if (item.quantity > product.quantity) {
              Swal.fire({
                title: 'Quantity Adjusted!',
                text: `The quantity of ${product.name} exceeds the available stock. It has been adjusted to ${product.quantity}.`,
                icon: 'info',
                confirmButtonColor: '#3085d6'
              });
              item.quantity = product.quantity;
            }
  
            this.data.Total += (product.price * item.quantity);
  
            this.cartItems.push({
              product,
              subInventory,  
              subInventoryQuantity: subInventory.quantity,
              quantity: item.quantity,
              price: product.price,
              image: subInventory.product.images, 
              _id: item._id
            });
          }
        });
  
        this.validateCart();
      } else {
        console.error('Items data is not available or not an array');
      }
  
    }, error => {
      console.error('Error loading cart:', error);
    });
  }
  
  async validateCart(): Promise<void> {
    for (let i = this.cartItems.length - 1; i >= 0; i--) {
      const item = this.cartItems[i];
      console.log("🔍 Checking item:", item.product.name, "Quantity:", item.quantity, "Stock:", item.subInventoryQuantity, "isActive:", item.subInventory.product.isActive);
  
      if (item.subInventoryQuantity === 0) {  
        console.log(`⚠️ ${item.product.name} is out of stock, removing...`);
        await Swal.fire({
          title: 'Out of Stock!',
          text: `${item.product.name} has been removed from your cart because it is out of stock.`,
          icon: 'warning',
          confirmButtonColor: '#d33',
        });
  
        try {
          await this.cartService.removeFromCart(this.userId!, item.subInventory._id).toPromise();
          this.cartItems.splice(i, 1); 
        } catch (error) {
          console.error("Error removing item:", error);
        }
      } else if (item.quantity > item.subInventoryQuantity) {
        console.log(`⚠️ ${item.product.name} quantity exceeds stock, adjusting...`);
        await Swal.fire({
          title: 'Invalid Quantity!',
          text: `The quantity of ${item.product.name} is not Available.`,
          icon: 'error'
        });
        item.quantity = item.subInventoryQuantity;
      } else if (!item.subInventory.product.isActive) {
        console.log(`⚠️ ${item.product.name} is inactive, removing...`);
        await Swal.fire({
          title: 'Product Not Available!',
          text: `The product ${item.product.name} is not available.`,
          icon: 'error'
        });
        await this.cartService.removeFromCart(this.userId!, item.subInventory._id).toPromise();
        this.cartItems.splice(i, 1);
        this.updateCartRegisteredCustomerProductNum();
      }
    }
  }
  
  
increaseQuantity(item: any): void {
  const subInventory = item.subInventory;
  const product = subInventory?.product;

  console.log("🔍 Checking increaseQuantity function...");

  if (!this.userId) {
      console.log("⚠️ Error: User ID is missing!");
      return;
  }

  if (!product || !subInventory) {
      console.log("⚠️ Error: Product or SubInventory is missing!", item);
      return;
  }

  console.log(`📌 Increasing quantity for ${product.name} (Current: ${item.quantity}, Available: ${subInventory.quantity})`);

  if (item.quantity < subInventory.quantity) {
      this.cartService.increaseQuantity(this.userId, subInventory._id).subscribe(
          () => {
              item.quantity += 1;
              console.log(`✅ Quantity increased! New Quantity: ${item.quantity}`);

              Swal.fire({
                  title: 'Quantity Increased!',
                  text: `The quantity of ${product.name} has been increased.`,
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Okay'
              });

              this.updateCartRegisteredCustomerProductNum();
          },
          (error) => {
              console.error('❌ Error increasing quantity:', error);
              Swal.fire({
                  title: 'Error!',
                  text: 'There was an issue increasing the quantity.',
                  icon: 'error',
                  confirmButtonColor: '#d33',
              });
          }
      );
  } else {
      console.log(`⚠️ Cannot increase quantity beyond available stock (${subInventory.quantity})`);
      Swal.fire({
          title: 'Error!',
          text: `You cannot increase the quantity beyond the available stock of ${subInventory.quantity}.`,
          icon: 'error',
          confirmButtonColor: '#d33',
      });
  }
}

decreaseQuantity(item: any): void {
  const subInventory = item.subInventory;
  const product = subInventory?.product;

  console.log("🔍 Checking decreaseQuantity function...");

  if (!this.userId) {
      console.log("⚠️ Error: User ID is missing!");
      return;
  }

  if (!product || !subInventory) {
      console.log("⚠️ Error: Product or SubInventory is missing!", item);
      return;
  }

  console.log(`📌 Decreasing quantity for ${product.name} (Current: ${item.quantity})`);

  if (item.quantity > 1) {
      this.cartService.decreaseQuantity(this.userId, subInventory._id).subscribe(
          () => {
              item.quantity -= 1;
              console.log(`✅ Quantity decreased! New Quantity: ${item.quantity}`);

              Swal.fire({
                  title: 'Quantity Decreased!',
                  text: `The quantity of ${product.name} has been decreased.`,
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Okay'
              });

              this.updateCartRegisteredCustomerProductNum();
          },
          (error) => {
              console.error('❌ Error decreasing quantity:', error);
              Swal.fire({
                  title: 'Error!',
                  text: 'There was an issue decreasing the quantity.',
                  icon: 'error',
                  confirmButtonColor: '#d33',
              });
          }
      );
  } else {
      console.log("⚠️ Quantity is 1, asking user for confirmation to remove item.");

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
              console.log(`🗑 Removing item: ${product.name} (${subInventory._id})`);
              this.removeItem(subInventory._id);
          }
      });
  }
}

  
removeItem(subInventoryId: string): void {
  if (!this.userId) return;

  console.log("🗑 Removing item with ID:", subInventoryId); 

  Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to undo this action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel'
  }).then((result) => {
      if (result.isConfirmed) {
          this.cartService.removeFromCart(this.userId!, subInventoryId).subscribe(() => {
              this.cartItems = this.cartItems.filter(item => item.subInventory._id !== subInventoryId);
              this.updateCartRegisteredCustomerProductNum();

              Swal.fire({
                  title: 'Removed!',
                  text: 'The item has been removed from the cart.',
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false
              });
          }, (error) => {
              console.error("❌ Error removing item:", error);
          });
      }
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
  
  
  // checkStockAndRemove(): void {
  //   this.cartItems.forEach((item, index) => {
  //     if (item.subInventoryQuantity=== 0) {
  //       Swal.fire({
  //         title: 'Out of Stock!',
  //         text: `${item.subInventory.product.name} has been removed from your cart because it is out of stock.`,
  //         icon: 'warning',
  //         confirmButtonColor: '#d33',
  //       });

  //       // Remove the out-of-stock item from the cart
  //       this.cartService.removeFromCart(this.userId!, item.subInventoryId.subscribe(() => {
  //         this.cartItems.splice(index, 1);
  //         this.updateCartRegisteredCustomerProductNum();
  //       }):
  //     }
  //   });
  // }
  isOutOfStock(item: any): boolean {
    return item.quantity === 0;
  }

}