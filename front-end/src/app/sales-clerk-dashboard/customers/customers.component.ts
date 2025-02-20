import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalSpent: number;
  loyaltyPoints: number;
  status: 'Regular' | 'VIP' | 'New';
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <h3>Store Customers</h3>
            <div class="search-box">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search customers..."
                [(ngModel)]="searchTerm"
                (input)="filterCustomers()">
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Contact Info</th>
                  <th>Last Visit</th>
                  <th>Total Spent</th>
                  <th>Loyalty Points</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let customer of filteredCustomers">
                  <td>#{{customer.id}}</td>
                  <td>{{customer.name}}</td>
                  <td>
                    <div>{{customer.email}}</div>
                    <small class="text-muted">{{customer.phone}}</small>
                  </td>
                  <td>{{customer.lastVisit}}</td>
                  <td>{{customer.totalSpent | currency}}</td>
                  <td>{{customer.loyaltyPoints}}</td>
                  <td>
                    <span class="badge"
                          [class.bg-success]="customer.status === 'VIP'"
                          [class.bg-primary]="customer.status === 'Regular'"
                          [class.bg-info]="customer.status === 'New'">
                      {{customer.status}}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-info me-2">
                      <i class="fas fa-history"></i>
                    </button>
                    <button class="btn btn-sm btn-primary">
                      <i class="fas fa-user-edit"></i>
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
    .search-box {
      width: 300px;
    }
    .badge {
      padding: 0.5em 0.75em;
    }
    .table td {
      vertical-align: middle;
    }
  `]
})
export class CustomersComponent {
  searchTerm = '';
  customers: Customer[] = [
    {
      id: '001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      lastVisit: '2024-02-17',
      totalSpent: 1250.50,
      loyaltyPoints: 450,
      status: 'VIP'
    },
    {
      id: '002',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 234-5678',
      lastVisit: '2024-02-15',
      totalSpent: 750.25,
      loyaltyPoints: 200,
      status: 'Regular'
    },
    {
      id: '003',
      name: 'Mike Wilson',
      email: 'mike.w@email.com',
      phone: '(555) 345-6789',
      lastVisit: '2024-02-17',
      totalSpent: 150.00,
      loyaltyPoints: 50,
      status: 'New'
    }
  ];

  filteredCustomers = [...this.customers];

  filterCustomers() {
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredCustomers = this.customers.filter(customer =>
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(this.searchTerm)
    );
  }
}
