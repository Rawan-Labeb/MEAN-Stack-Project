// import { Component, OnInit } from '@angular/core';
// import { CartService } from './../../cart/service/cart.service';
// import { CommonModule } from '@angular/common';
// import Swal from 'sweetalert2';
// import { RouterModule, Router } from '@angular/router';
// import { jwtDecode } from 'jwt-decode';
// import { OfflineOrderService } from './../../_services/OfflineOrder.service';
// import { OfflineOrder, OfflineOrderItem } from './../../_models/offlineOrder.model';

// @Component({
//   selector: 'app-cart-cachier',
//   imports: [CommonModule, RouterModule],
//   templateUrl: './cart-cachier.component.html',
//   styleUrl: './cart-cachier.component.css'
// })
// export class CartCachierComponent {
//   data: any = {};
//   cartItems: any[] = [];
//   userId: string | null = null;
//   branchId: string = '67b129216e1b912065196f93'; 

//   cartItemCount: number = 0;

//   constructor(
//     private cartService: CartService,
//     private offlineOrderService: OfflineOrderService,
//     private router: Router
//     ) {}

//   // ngOnInit(): void {
//   //   // this.userId = this.getUserIdFromToken();
//   //     this.userId = '67ba723899eec16ac3971c6e'
//   //   if (this.userId) {
//   //     this.loadCart();
//   //   } else {
//   //     console.error("User not authenticated.");
//   //   }
//   // }

//    getUserIdFromToken(): string | null {
//      const token = localStorage.getItem('token');
//      if (token) {
//        const decoded: any = jwtDecode(token);
//        return decoded.sub; // استخراج userId
//      }
//      return null;
//    }
//   ngOnInit(): void {
//     this.userId = this.getUserIdFromToken();
//     this.userId = '67ba723899eec16ac3971c6e'
//     this.branchId=this.branchId;
//     if (this.userId) {
//       this.loadCart();
//     } else {
//       console.error("User not authenticated.");
//     }
//   }
//   loadCart(): void {
//     if (!this.userId) return;
  
//     this.cartService.getCart(this.userId).subscribe(
//       res => {
//         console.log('Cart Data:', res);
//         this.data = res;
//         this.data.Total = 0;
  
//         if (res.items && Array.isArray(res.items)) {
//           this.cartItems = res.items.map((item: any) => ({
//             subInventory: item.subInventory._id,
//             branch: item.branch,
//             image: item.image,
//             quantity: item.quantity,
//             price: item.price,
//             product: item.subInventory.product,
//             subInventoryQuantity: item.subInventory.quantity,
//             _id: item._id
//           }));
//         } else {
//           console.error('Items data is not available or not an array');
//         }
//       },
//       error => {
//         console.error('Error loading cart:', error);
//         Swal.fire({
//           title: 'There is No cart',
//           text: "Cart Is Empty",
//           icon: 'error'
//         });
//       }
//     );
//   }

//   increaseQuantity(item: any): void {
//     if (!this.userId) return;
    
//     this.cartService.increaseQuantity(this.userId, item.subInventory).subscribe(
//       () => {
//         item.quantity += 1;
//       },
//       error => console.error('Error increasing quantity:', error)
//     );
//   }

//   decreaseQuantity(item: any): void {
//     if (!this.userId) return;
    
//     if (item.quantity > 1) {
//       this.cartService.decreaseQuantity(this.userId, item.subInventory).subscribe(
//         () => {
//           item.quantity -= 1;
//         },
//         error => console.error('Error decreasing quantity:', error)
//       );
//     } else {
//       this.removeItem(item.subInventory);
//     }
//   }

//   removeItem(subInventoryId: string): void {
//     if (!this.userId) return;
    
//     this.cartService.removeFromCart(this.userId, subInventoryId).subscribe(() => {
//       this.cartItems = this.cartItems.filter(item => item.subInventory !== subInventoryId);
//     });
//   }

//   getTotalPrice(): number {
//     return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   }

//   clearCart(): void {
//     if (!this.userId) return;
    
//     this.cartService.clearCart(this.userId).subscribe(() => {
//       this.cartItems = [];
//     });
//   }

//   // checkout(): void {
//   //   if (this.cartItems.length === 0) {
//   //     Swal.fire({ title: 'Cart is Empty!', text: 'There are no products in your cart.', icon: 'warning' });
//   //     return;
//   //   }

//   //   const orderItems: OfflineOrderItem[] = this.cartItems.map(item => ({
//   //     subInventoryId: item.subInventory,
//   //     price: item.price,
//   //     quantity: item.quantity
//   //   }));

//   //   const order: OfflineOrder = {
//   //     items: orderItems,
//   //     totalPrice: this.getTotalPrice(),
//   //     branch: this.cartItems[0].branch,
//   //     branchId: this.branchId,
//   //     status: 'completed'
//   //   };

//   //   this.offlineOrderService.createOfflineOrder(order).subscribe(
//   //     res => {
//   //       Swal.fire({ title: 'Order Created!', text: 'Your order has been created successfully.', icon: 'success' });
//   //       this.clearCart();
//   //       this.router.navigate(['/cachier']);
//   //     },
//   //     error => {
//   //       Swal.fire({ title: 'Error!', text: 'There was an error creating your order.', icon: 'error' });
//   //       console.error('Error creating order:', error);
//   //     }
//   //   );
//   // }


//   checkout(): void {
//     if (this.cartItems.length === 0) {
//       Swal.fire({ 
//         title: 'Cart is Empty!', 
//         text: 'There are no products in your cart.', 
//         icon: 'warning' 
//       });
//       return;
//     }
  
//     const orderItems: OfflineOrderItem[] = this.cartItems.map(item => ({
//       subInventoryId: item.subInventory,
//       price: item.price,
//       quantity: item.quantity
//     }));
  
//     const order: OfflineOrder = {
//       items: orderItems,
//       totalPrice: this.getTotalPrice(),
//       branch: this.cartItems[0].branch,
//       branchId: this.branchId,
//       status: 'completed'
//     };
  
//     this.offlineOrderService.createOfflineOrder(order).subscribe(
//       res => {
//         Swal.fire({
//           title: 'Order Created!',
//           html: `
//             <p><strong>Total Price:</strong> ${order.totalPrice} EGP</p>
//             <p><strong>Branch:</strong> ${this.branchId}</p>
//             <p>Do you want to print the receipt?</p>
//           `,
//           icon: 'success',
//           showCancelButton: true,
//           confirmButtonText: 'Print & Complete Order',
//           cancelButtonText: 'Complete Order'
//         }).then(result => {
//           if (result.isConfirmed) {
//             this.printReceipt(order);
//           }
//           this.completeOrder();
//         });
//       },
//       error => {
//         Swal.fire({ 
//           title: 'Error!', 
//           text: 'There was an error creating your order.', 
//           icon: 'error' 
//         });
//         console.error('Error creating order:', error);
//       }
//     );
//   }
//   printReceipt(order: OfflineOrder): void {
//     const receiptContent = `
//       Order Receipt
//       --------------------
//       Branch: ${order.branchId}
//       Total Price: ${order.totalPrice} EGP
//       Items:
//       ${order.items.map(item => `- Item ID: ${item.subInventoryId}, Price: ${item.price}, Quantity: ${item.quantity}`).join('\n')}
//     `;
  
//     const blob = new Blob([receiptContent], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `receipt_${new Date().toISOString()}.txt`;
//     link.click();
//   }
//   completeOrder(): void {
//     this.clearCart();
//     this.router.navigate(['/cashier']);
//   }
  
    
//       showProductDetails(item: any): void {
//         Swal.fire({
//           title: item.product.name,
//           html: `
//             <p><strong>Price:</strong> &euro; ${item.product.price}</p>
//             <p><strong>ONLY</strong> ${item.subInventoryQuantity} left</p>
//             <p><strong>Description:</strong> ${item.product.description}</p>
//             <img src="${item.product.images[0]}" alt="Product Image" class="img-fluid">
//           `,
//           confirmButtonText: 'Close'
//         });
//       }
// }
import { Component, OnInit } from '@angular/core';
import { CartService } from './../../cart/service/cart.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterModule, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { OfflineOrderService } from './../../_services/OfflineOrder.service';
import { OfflineOrder, OfflineOrderItem } from './../../_models/offlineOrder.model';
import { BranchService } from './../../_services/branch.service';
import { CookieService } from 'ngx-cookie-service'; 

@Component({
  selector: 'app-cart-cachier',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-cachier.component.html',
  styleUrl: './cart-cachier.component.css'
})
export class CartCachierComponent implements OnInit {
  data: any = {};
  cartItems: any[] = [];
  userId: string | null = null;
  branchId: string | null = null;
  isLoading: boolean = false; 


  cartItemCount: number = 0;

  constructor(
    private cartService: CartService,
    private offlineOrderService: OfflineOrderService,
    private branchService: BranchService,
    private router: Router,
   private cookieService: CookieService 

  ) {}

  

  
    ngOnInit(): void {
      this.getUserDataFromToken(); 
    }
  
    getUserDataFromToken(): void {
      const token = this.cookieService.get('token'); 
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token); 
          this.userId = decodedToken.sub; 
          this.branchId = decodedToken.branchId || 'defaultBranchId'; 
  
          console.log('User ID:', this.userId);
          console.log('Branch ID:', this.branchId);
  
          if (this.userId) {
            this.loadCart(); 
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      } else {
        console.log('No token found');
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

isOutOfStock(item: any): boolean {
  return item.quantity === 0;
}
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  clearCart(): void {
    if (!this.userId) return;

    this.cartService.clearCart(this.userId).subscribe(() => {
      this.cartItems = [];
    });
  }


  checkout(): void {
    if (this.cartItems.length === 0) {
      Swal.fire({ 
        title: 'Cart is Empty!', 
        text: 'There are no products in your cart.', 
        icon: 'warning' 
      });
      return;
    }
  
    if (!this.branchId) {
      Swal.fire({ 
        title: 'Error!', 
        text: 'Branch ID is missing.', 
        icon: 'error' 
      });
      return;
    }
  
    this.branchService.getBranchById(this.branchId).subscribe(
      branch => {
        const orderItems: OfflineOrderItem[] = this.cartItems.map(item => ({
          subInventoryId: item.subInventory,
          price: item.price,
          quantity: item.quantity
        }));
  
        const order: OfflineOrder = {
          items: orderItems,
          totalPrice: this.getTotalPrice(),
          branchId: this.branchId!,
          branch: branch,
          status: 'completed'
        };
  
        Swal.fire({
          title: 'Create Order',
          text: `Total Price: ${order.totalPrice} EGP\nBranch: ${branch.branchName}`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Complete with Receipt',
          cancelButtonText: 'Complete Order'
        }).then(result => {
          if (result.isConfirmed) {
            this.printReceipt(order);
          }
          this.createOfflineOrder(order);
        });
      },
      error => {
        Swal.fire({ 
          title: 'Error!', 
          text: 'There was an error fetching branch details.', 
          icon: 'error' 
        });
        console.error('Error fetching branch details:', error);
      }
    );
  }
  
  createOfflineOrder(order: OfflineOrder): void {
    this.offlineOrderService.createOfflineOrder(order).subscribe(
      res => {
        Swal.fire({
          title: 'Order Created!',
          html: `
            <p><strong>Total Price:</strong> ${order.totalPrice} EGP</p>
            <p><strong>Branch:</strong> ${order.branch!.branchName}</p>
            <p>The order has been completed successfully.</p>
          `,
          icon: 'success',
          confirmButtonText: 'OK' 
        }).then(result => {
          this.completeOrder();  
        });
      },
      error => {
        Swal.fire({ 
          title: 'Error!', 
          text: 'There was an error creating your order.', 
          icon: 'error' 
        });
        console.error('Error creating order:', error);
      }
    );
  }
  
  
  printReceipt(order: OfflineOrder): void {
    const receiptContent = `
      Order Receipt
      --------------------
      Branch: ${order.branch!.branchName}
      Total Price: ${order.totalPrice} EGP
      Items:
      ${order.items.map(item => `- Item ID: ${item.subInventoryId}, Price: ${item.price}, Quantity: ${item.quantity}`).join('\n')}
    `;
  
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${new Date().toISOString()}.txt`;
    link.click();
  }
  
  completeOrder(): void {
    this.clearCart();
    this.router.navigate(['/cashier']);
  }
  
  
  // printReceipt(order: OfflineOrder): void {
  //   const receiptContent = `
  //     Order Receipt
  //     --------------------
  //     Branch: ${order.branch!.branchName}
  //     Total Price: ${order.totalPrice} EGP
  //     Items:
  //     ${order.items.map(item => `- Item ID: ${item.subInventoryId}, Price: ${item.price}, Quantity: ${item.quantity}`).join('\n')}
  //   `;
  
  //   const blob = new Blob([receiptContent], { type: 'text/plain' });
  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `receipt_${new Date().toISOString()}.txt`;
  //   link.click();
  // }
  
  // completeOrder(): void {
  //   this.clearCart();
  //   this.router.navigate(['/cashier']);
  // }
  
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

