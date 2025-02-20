import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Complaint {
  id: string;
  customer: string;
  subject: string;
  description: string;
  date: string;
  status: 'New' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
}

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <h3>Customer Complaints</h3>
            <div class="d-flex gap-3">
              <select class="form-select" [(ngModel)]="statusFilter">
                <option value="all">All Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search complaints..."
                [(ngModel)]="searchTerm">
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let complaint of filteredComplaints">
                  <td>#{{complaint.id}}</td>
                  <td>{{complaint.customer}}</td>
                  <td>
                    <div>{{complaint.subject}}</div>
                    <small class="text-muted">{{complaint.description}}</small>
                  </td>
                  <td>{{complaint.date}}</td>
                  <td>
                    <span class="badge"
                          [class.bg-danger]="complaint.priority === 'High'"
                          [class.bg-warning text-dark]="complaint.priority === 'Medium'"
                          [class.bg-info]="complaint.priority === 'Low'">
                      {{complaint.priority}}
                    </span>
                  </td>
                  <td>
                    <span class="badge"
                          [class.bg-secondary]="complaint.status === 'New'"
                          [class.bg-primary]="complaint.status === 'In Progress'"
                          [class.bg-success]="complaint.status === 'Resolved'">
                      {{complaint.status}}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-info me-2">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary">
                      <i class="fas fa-edit"></i>
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
    small {
      display: block;
      margin-top: 4px;
    }
  `]
})
export class ComplaintsComponent {
  searchTerm = '';
  statusFilter = 'all';
  
  complaints: Complaint[] = [
    {
      id: 'C001',
      customer: 'John Smith',
      subject: 'Product Quality Issue',
      description: 'Received damaged perfume bottle',
      date: '2024-02-17',
      status: 'New',
      priority: 'High'
    },
    {
      id: 'C002',
      customer: 'Mary Johnson',
      subject: 'Service Complaint',
      description: 'Long waiting time at checkout',
      date: '2024-02-16',
      status: 'In Progress',
      priority: 'Medium'
    },
    {
      id: 'C003',
      customer: 'Robert Wilson',
      subject: 'Return Request',
      description: 'Wrong fragrance delivered',
      date: '2024-02-15',
      status: 'Resolved',
      priority: 'Low'
    }
  ];

  get filteredComplaints() {
    return this.complaints.filter(complaint => {
      const matchesSearch = complaint.subject.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          complaint.customer.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || complaint.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }
}
