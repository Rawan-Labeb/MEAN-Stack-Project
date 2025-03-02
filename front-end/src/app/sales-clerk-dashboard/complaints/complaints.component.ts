import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintsService, Complaint } from '../services/complaints.service';

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
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private complaintsService: ComplaintsService
  ) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    
    this.complaintsService.getComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load complaints: ' + err.message;
        this.loading = false;
      }
    });
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
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    
    this.complaintsService.updateComplaintStatus(complaintId, newStatus).subscribe({
      next: (response) => {
        // Update local data
        const complaint = this.complaints.find(c => c._id === complaintId);
        if (complaint) {
          complaint.status = newStatus;
          complaint.updatedAt = new Date().toISOString();
        }
        
        // Update selected complaint if it's the current one
        if (this.selectedComplaint && this.selectedComplaint._id === complaintId) {
          this.selectedComplaint = { ...this.selectedComplaint, status: newStatus, updatedAt: new Date().toISOString() };
        }
        
        this.applyFilters();
        this.loading = false;
        this.successMessage = 'Complaint status updated successfully';

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to update complaint status: ' + err.message;
      }
    });
  }

  closeDetails(): void {
    this.selectedComplaint = null;
  }

  refreshComplaints(): void {
    this.loadComplaints();
  }

  // Add these two methods to fix the errors
  dismissSuccess(): void {
    this.successMessage = '';
  }

  dismissError(): void {
    this.error = '';
  }
}