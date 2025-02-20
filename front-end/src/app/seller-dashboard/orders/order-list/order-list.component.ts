import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../../services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter: string = 'all';
  loading = false;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    if (this.statusFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => 
        order.status.toLowerCase() === this.statusFilter.toLowerCase()
      );
    }
  }

  viewDetails(order: Order): void {
    Swal.fire({
      title: `Order #${order._id}`,
      html: this.generateOrderDetailsHtml(order),
      width: '500px'
    });
  }

  changeOrderStatus(order: Order, newStatus: string): void {
    this.orderService.updateOrderStatus(order._id, newStatus).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o._id === order._id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.applyFilters();
        }
        Swal.fire('Success', 'Order status updated successfully', 'success');
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        Swal.fire('Error', 'Failed to update order status', 'error');
      }
    });
  }

  getStatusButtonClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'btn-warning';
      case 'shipped': return 'btn-info';
      case 'completed': return 'btn-success';
      case 'cancelled': return 'btn-danger';
      default: return 'btn-secondary';
    }
  }

  private generateOrderDetailsHtml(order: Order): string {
    return `
      <div class="text-left">
        <p><strong>Customer:</strong> ${order.customerDetails.firstName} ${order.customerDetails.lastName}</p>
        <p><strong>Email:</strong> ${order.customerDetails.email}</p>
        <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
        <p><strong>Total:</strong> $${order.totalPrice}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <hr>
        <h6>Items:</h6>
        ${order.items.map(item => `
          <div class="d-flex justify-content-between">
            <span>Product ID: ${item.productId} x${item.quantity}</span>
            <span>$${item.price}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
}