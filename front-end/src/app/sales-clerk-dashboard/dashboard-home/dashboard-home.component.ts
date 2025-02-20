import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <h5>Today's Sales</h5>
              <h2>$1,234.56</h2>
              <small>15 orders</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <h5>Customers Served</h5>
              <h2>27</h2>
              <small>Today</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-dark">
            <div class="card-body">
              <h5>Low Stock Items</h5>
              <h2>8</h2>
              <small>Needs attention</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <h5>Active Complaints</h5>
              <h2>3</h2>
              <small>Pending resolution</small>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5>Recent Transactions</h5>
            </div>
            <div class="card-body">
              <table class="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let order of recentOrders">
                    <td>#{{order.id}}</td>
                    <td>{{order.customer}}</td>
                    <td>{{order.amount | currency}}</td>
                    <td>{{order.time}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h5>Low Stock Alerts</h5>
            </div>
            <div class="card-body">
              <ul class="list-group">
                <li *ngFor="let item of lowStockItems" 
                    class="list-group-item d-flex justify-content-between align-items-center">
                  {{item.name}}
                  <span class="badge bg-danger">{{item.stock}} left</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container-fluid {
      padding-bottom: 60px; /* Add space for footer */
    }
    .card {
      margin-bottom: 1.5rem;
      box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
    }
    .card-header {
      background-color: #fff;
      border-bottom: 1px solid #dee2e6;
    }
    .list-group-item {
      border-left: none;
      border-right: none;
    }
  `]
})
export class DashboardHomeComponent {
  recentOrders = [
    { id: '1234', customer: 'John Doe', amount: 156.78, time: '10:30 AM' },
    { id: '1235', customer: 'Jane Smith', amount: 89.99, time: '10:15 AM' },
    { id: '1236', customer: 'Bob Wilson', amount: 234.56, time: '9:45 AM' },
    { id: '1237', customer: 'Alice Brown', amount: 45.00, time: '9:30 AM' },
  ];

  lowStockItems = [
    { name: 'Boss Perfume', stock: 5 },
    { name: 'Channel No 5', stock: 3 },
    { name: 'Dior Sauvage', stock: 4 },
    { name: 'Gucci Bloom', stock: 2 },
  ];
}
