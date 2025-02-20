import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../_services/order.service';
import { Order } from '../../_models/order.module';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cancelled-orders',
  templateUrl: './cancelled-order.component.html',
  styleUrl: './cancelled-order.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class CancelledOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];

  constructor(private orderService: OrderService) {}

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
    this.filteredOrders = this.orders.filter(order => order.status === 'cancelled');
  }

  viewDetails(orderId: string): void {
    const order = this.orders.find(order => order._id === orderId);
    if (order) {
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
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.productId}</td>
                  <td>${item.price}</td>
                  <td>${item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `,
        width: '80%',
        confirmButtonText: 'Close'
      });
    }
  }
}