import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Complaint {
  _id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  statusFilter: string = 'all';
  filteredComplaints: Complaint[] = [];
  selectedComplaint: Complaint | null = null;

  ngOnInit(): void {
    // Static data for testing
    this.complaints = [
      {
        _id: 'comp001',
        customerName: 'John Smith',
        customerEmail: 'john@example.com',
        subject: 'Wrong perfume delivered',
        message: 'I ordered Chanel No. 5 but received Dior J\'adore instead.',
        status: 'new',
        createdAt: new Date(2023, 11, 15)
      },
      {
        _id: 'comp002',
        customerName: 'Emma Johnson',
        customerEmail: 'emma@example.com',
        subject: 'Damaged packaging',
        message: 'The perfume box was damaged during shipping.',
        status: 'in-progress',
        createdAt: new Date(2023, 11, 10),
        updatedAt: new Date(2023, 11, 11)
      },
      {
        _id: 'comp003',
        customerName: 'Michael Brown',
        customerEmail: 'michael@example.com',
        subject: 'Refund request',
        message: 'I would like to request a refund for my recent purchase.',
        status: 'resolved',
        createdAt: new Date(2023, 11, 5),
        updatedAt: new Date(2023, 11, 8)
      }
    ];
    
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.statusFilter === 'all') {
      this.filteredComplaints = [...this.complaints];
    } else {
      this.filteredComplaints = this.complaints.filter(
        complaint => complaint.status === this.statusFilter
      );
    }
  }

  viewComplaint(complaint: Complaint): void {
    this.selectedComplaint = complaint;
  }

  updateStatus(complaintId: string, newStatus: 'new' | 'in-progress' | 'resolved'): void {
    const complaint = this.complaints.find(c => c._id === complaintId);
    if (complaint) {
      complaint.status = newStatus;
      complaint.updatedAt = new Date();
      this.applyFilters();
      
      if (this.selectedComplaint && this.selectedComplaint._id === complaintId) {
        this.selectedComplaint = { ...complaint };
      }
    }
  }

  closeDetails(): void {
    this.selectedComplaint = null;
  }
}