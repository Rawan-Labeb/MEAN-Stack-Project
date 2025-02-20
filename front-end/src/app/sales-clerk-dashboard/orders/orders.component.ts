import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: 'Completed' | 'Processing' | 'Cancelled';
  date: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <h3>Today's Orders</h3>
            <div class="d-flex gap-3">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search orders..."
                [(ngModel)]="searchTerm">
              <select class="form-select" [(ngModel)]="statusFilter">
                <option value="all">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of filteredOrders">
                  <td>#{{order.id}}</td>
                  <td>{{order.customer}}</td>
                  <td>{{order.items}}</td>
                  <td>{{order.total | currency}}</td>
                  <td>
                    <span class="badge" 
                          [class.bg-success]="order.status === 'Completed'"
                          [class.bg-primary]="order.status === 'Processing'"
                          [class.bg-danger]="order.status === 'Cancelled'">
                      {{order.status}}
                    </span>
                  </td>
                  <td>{{order.date}}</td>
                  <td>{{order.paymentMethod}}</td>
                  <td>
                    <button class="btn btn-sm btn-info me-2">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success">
                      <i class="fas fa-print"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-bottom: 60px;
      box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
    }
    .form-control, .form-select {
      width: 200px;
    }
    .badge {
      padding: 0.5em 0.75em;
    }
    .table td {
      vertical-align: middle;
    }
  `]
})
export class OrdersComponent {
  orders: Order[] = [
    { id: '1001', customer: 'John Smith', items: 3, total: 159.99, status: 'Completed', date: '10:30 AM', paymentMethod: 'Credit Card' },
    { id: '1002', customer: 'Mary Johnson', items: 2, total: 89.99, status: 'Processing', date: '10:45 AM', paymentMethod: 'Cash' },
    { id: '1003', customer: 'Robert Brown', items: 1, total: 45.00, status: 'Completed', date: '11:00 AM', paymentMethod: 'Debit Card' },
    { id: '1004', customer: 'Alice Wilson', items: 4, total: 199.99, status: 'Cancelled', date: '11:15 AM', paymentMethod: 'Credit Card' },
  ];

  searchTerm = '';
  statusFilter = 'all';

  get filteredOrders() {
    return this.orders.filter(order => {
      const matchesSearch = order.customer.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          order.id.includes(this.searchTerm);
      const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }
}
