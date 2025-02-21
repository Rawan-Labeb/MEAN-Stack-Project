import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { ProductService } from '../_services/product.service';
import { OfflineOrderService } from '../_services/OfflineOrder.service'; // Import the OfflineOrderService
import { Order } from '../_models/order.module';
import { OfflineOrder } from '../_models/offlineOrder.model'; // Import the OfflineOrder model
import { Branch } from '../_models/branch.model'; // Import the Branch model
import { SubInventory } from '../_models/sub-inventory.model'; // Import the SubInventory model
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-cachier',
  templateUrl: './cachier.component.html',
  styleUrls: ['./cachier.component.css'],
  standalone: true,
  imports: [CommonModule, OrderDetailsComponent,FooterComponent,HeaderComponent]
})
export class CachierComponent implements OnInit {
  orders: Order[] = [];
  offlineOrders: OfflineOrder[] = []; // Add offlineOrders array
  filteredOrders: Order[] = [];
  filteredOfflineOrders: OfflineOrder[] = []; // Add filteredOfflineOrders array
  selectedOrder: Order | null = null;
  selectedOfflineOrder: OfflineOrder | null = null; // Add selectedOfflineOrder
  showCancelledOrders: boolean = false;
  branchId: string = '67b129216e1b912065196f93'; // Replace with actual branch ID

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private offlineOrderService: OfflineOrderService // Inject the OfflineOrderService
  ) {}

  ngOnInit(): void {
    this.getOfflineOrders(); // Fetch offline orders
  }

  getOfflineOrders(): void {
    this.offlineOrderService.getOfflineOrdersByBranchId(this.branchId).subscribe(
      (orders: OfflineOrder[]) => {
        this.offlineOrders = orders;
        this.filterOfflineOrders();
      },
      (error: any) => {
        console.error('Error fetching offline orders:', error);
      }
    );
  }

  filterOfflineOrders(): void {
    this.filteredOfflineOrders = this.offlineOrders.filter(order => 
      order.status === 'completed' || order.status === 'canceled'
    );
  }

  cancelOrder(orderId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        const offlineOrder = this.offlineOrders.find(order => order._id === orderId);
        if (offlineOrder) {
          this.offlineOrderService.cancelOfflineOrder(orderId).subscribe(
            () => {
              this.getOfflineOrders();
              Swal.fire('Cancelled!', 'The offline order has been cancelled.', 'success');
            },
            (error: any) => {
              console.error('Error canceling offline order:', error);
              Swal.fire('Error!', 'There was an error canceling the offline order.', 'error');
            }
          );
        }
      }
    });
  }

  toggleCancelledOrders(): void {
    this.showCancelledOrders = !this.showCancelledOrders;
    this.filterOfflineOrders();
  }

  viewDetails(_id: string): void {
    const offlineOrder = this.offlineOrders.find(order => order._id === _id);
    if (offlineOrder) {
      console.log('Offline Order:', offlineOrder); // Log the offlineOrder object
      if (offlineOrder.branch && offlineOrder.branch._id) {
        console.log('Branch ID:', offlineOrder.branch._id); // Log the branchId

        const branchDetailsPromise = this.offlineOrderService.getBranchById(offlineOrder.branch._id).toPromise();
        const subInventoryDetailsPromises = offlineOrder.items.map(item => {
          return this.offlineOrderService.getSubInventoryById(item.subInventoryId).toPromise();
        });

        Promise.all([branchDetailsPromise, ...subInventoryDetailsPromises]).then(([branch, ...subInventories]) => {
          Swal.fire({
            title: `Order Details - ${offlineOrder._id}`,
            html: `
              <p><strong>Total Price:</strong> ${offlineOrder.totalPrice}</p>
              <p><strong>Status:</strong> ${offlineOrder.status}</p>
              <p><strong>Date:</strong> ${offlineOrder.date}</p>
              <p><strong>Branch:</strong> ${branch?.branchName || 'N/A'}</p>
              <h3>Products</h3>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${offlineOrder.items.map((item, index) => `
                    <tr>
                      <td>${item._id}</td>
                      <td>${subInventories[index]?.product || 'N/A'}</td>
                      <td>${item.price}</td>
                      <td>${item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `,
            width: '80%',
            confirmButtonText: 'Close',
            customClass: {
              popup: 'swal-wide'
            },
            didOpen: () => {
              // Add event listeners for delete buttons
              const popup = Swal.getPopup();
              if (popup) {
                const deleteButtons = popup.querySelectorAll('.btn-danger');
                deleteButtons.forEach(button => {
                  button.addEventListener('click', (event) => {
                    const subInventoryId = (event.target as HTMLElement).getAttribute('data-sub-inventory-id');
                    const quantity = parseInt((event.target as HTMLElement).getAttribute('data-quantity')!, 10);
                    if (subInventoryId) {
                      this.confirmRemoveItem(offlineOrder._id!, subInventoryId, quantity);
                    } else {
                      console.error('Sub-Inventory ID is undefined');
                    }
                  });
                });
              }
            }
          });
          
        }).catch(error => {
          console.error('Error fetching details:', error);
        });
      } else {
        console.error('Branch is undefined or branch ID is missing');
      }
    }
  }

  confirmRemoveItem(orderId: string, productId: string, quantity: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product from the order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.offlineOrderService.deleteProductFromOrder(orderId, productId, quantity).subscribe(
          () => {
            this.getOfflineOrders();
            Swal.fire('Deleted!', 'The product has been removed from the order.', 'success');
          },
          (error: any) => {
            console.error('Error deleting product from order:', error);
            Swal.fire('Error!', 'There was an error deleting the product from the order.', 'error');
          }
        );
      }
    });
  }
}
//                    <th>Actions</th>

// <td><button class="btn btn-danger btn-sm" data-sub-inventory-id="${item.subInventoryId}" data-quantity="${item.quantity}">Delete</button></td>
