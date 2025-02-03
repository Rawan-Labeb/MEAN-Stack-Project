import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: Date;
  customerName: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  items: OrderItem[];
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent {
  orders: Order[] = [
    {
      id: '1',
      date: new Date(),
      customerName: 'John Doe',
      total: 299.99,
      status: 'pending',
      items: [{ name: 'Product 1', quantity: 2, price: 149.99 }]
    },
    {
      id: '2',
      date: new Date(),
      customerName: 'Jane Smith',
      total: 499.99,
      status: 'shipped',
      items: [{ name: 'Product 2', quantity: 1, price: 499.99 }]
    }
  ];

  statusFilter: 'all' | 'pending' | 'shipped' | 'delivered' = 'all';
  filteredOrders: Order[] = this.orders;

  filterOrders(): void {
    if (this.statusFilter === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.statusFilter);
    }
  }

  viewDetails(order: Order): void {
    Swal.fire({
      title: `Order #${order.id}`,
      html: this.generateOrderDetailsHtml(order),
      width: '500px'
    });
  }

  private generateOrderDetailsHtml(order: Order): string {
    return `
      <div class="text-left">
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Date:</strong> ${order.date.toLocaleDateString()}</p>
        <p><strong>Total:</strong> $${order.total}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <hr>
        <h6>Items:</h6>
        ${order.items.map(item => `
          <div class="d-flex justify-content-between">
            <span>${item.name} x${item.quantity}</span>
            <span>$${item.price}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'shipped': return 'bg-info';
      case 'delivered': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
}