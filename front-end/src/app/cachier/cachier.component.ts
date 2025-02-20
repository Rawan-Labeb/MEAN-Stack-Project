import { Component, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { ProductService } from '../_services/product.service';
import { Order } from '../_models/order.module';
import { Product } from '../_models/product.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { OrderDetailsComponent } from './order-details/order-details.component';

@Component({
  selector: 'app-cachier',
  templateUrl: './cachier.component.html',
  styleUrls: ['./cachier.component.css'],
  standalone: true,
  imports: [CommonModule, OrderDetailsComponent]
})
export class CachierComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
    showCancelledOrders: boolean = false;


  constructor(private orderService: OrderService, private productService: ProductService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getOrders().subscribe(
      (orders: Order[]) => {
        this.orders = orders;
        this.filterOrders();
      },
      (error: any) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => 
      order.status === 'pending' || order.status === 'completed' || order.status === 'cancelled' || order.status === 'returned'
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
        const order = this.orders.find(order => order._id === orderId);
        if (order) {
          order.status = 'returned';
          this.orderService.updateOrder(orderId, order).subscribe(
            () => {
              this.filterOrders();
              order.items.forEach(item => {
                this.productService.getProductById(item.productId).subscribe(product => {
                  product.quantity += item.quantity;
                  this.productService.updateProduct(product._id, product).subscribe();
                });
              });
              Swal.fire('Cancelled!', 'Your order has been cancelled and products have been returned to stock.', 'success');
            },
            (error: any) => {
              console.error('Error canceling order:', error);
              Swal.fire('Error!', 'There was an error canceling your order.', 'error');
            }
          );
        }
      }
    });
  }
  toggleCancelledOrders(): void {
    this.showCancelledOrders = !this.showCancelledOrders;
    this.filterOrders();
  }

  viewDetails(orderId: string): void {
    const order = this.orders.find(order => order._id === orderId);
    if (order) {
      const productDetailsPromises = order.items.map(item => 
        this.productService.getProductById(item.productId).toPromise()
      );

      Promise.all(productDetailsPromises).then(products => {
        Swal.fire({
          title: `Order Details - ${order._id}`,
          html: `
            <p><strong>Total Price:</strong> ${order.totalPrice}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Date:</strong> ${order.date}</p>
            <h3>Products</h3>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((item, index) => `
                  <tr>
                    <td>${item.productId}</td>
                    <td>${products[index]?.name || 'N/A'}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td><img src="${products[index]?.images[0] || ''}" alt="Product Image" class="img-fluid" style="max-width: 100px;"></td>
                    <td><button class="btn btn-danger btn-sm" data-product-id="${item.productId}" data-quantity="${item.quantity}">Delete</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `,
          width: '80%',  // تحسين عرض SweetAlert
          confirmButtonText: 'Close',
          customClass: {
            popup: 'swal-wide'
          },
          didOpen: () => {
            const deleteButtons = document.querySelectorAll('.btn-danger');
            deleteButtons.forEach(button => {
              button.addEventListener('click', (event) => {
                const target = event.target as HTMLButtonElement;
                const productId = target.getAttribute('data-product-id');
                const quantity = target.getAttribute('data-quantity');
                if (productId && quantity) {
                  this.confirmRemoveItem(productId, parseInt(quantity, 10));
                }
              });
            });
          }
        });
      }).catch(error => {
        console.error('Error fetching product details:', error);
        Swal.fire('Error!', 'There was an error fetching product details.', 'error');
      });
    }
  }

  confirmRemoveItem(productId: string, quantity: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product from the order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeItem(productId, quantity);
      }
    });
  }

  removeItem(productId: string, quantity: number): void {
    if (this.selectedOrder) {
      this.orderService.removeFromOrder(this.selectedOrder._id, productId).subscribe(() => {
        this.selectedOrder!.items = this.selectedOrder!.items.filter(item => item.productId !== productId);
        this.productService.getProductById(productId).subscribe(product => {
          product.quantity += quantity;
          this.productService.updateProduct(product._id, product).subscribe(() => {
            Swal.fire('Deleted!', 'The product has been removed.', 'success');
          });
        });
      });
    }
  }
}