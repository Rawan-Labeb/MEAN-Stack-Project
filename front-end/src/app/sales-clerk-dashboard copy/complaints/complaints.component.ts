import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintsService, Complaint } from '../services/complaints.service';
import { AuthServiceService } from '../../_services/auth-service.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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
  
  // User info
  isOnlineBranch = false;
  clerkId = '';
  branchId: string | null = null;

  // Define the online branch ID constant
  private readonly ONLINE_BRANCH_ID = '67b129216e1b912065196f93';

  constructor(
    private complaintsService: ComplaintsService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'Authentication required. Please log in.';
      return;
    }
    
    this.authService.decodeToken(token).subscribe({
      next: (decoded) => {
        if (decoded) {
          this.clerkId = decoded.sub || decoded.id;
          this.branchId = decoded.branchId;
          
          // Updated logic: Check for specific online branch ID
          this.isOnlineBranch = this.branchId === this.ONLINE_BRANCH_ID;
          
          console.log('User details:', { 
            clerkId: this.clerkId, 
            branchId: this.branchId,
            isOnlineBranch: this.isOnlineBranch 
          });
          
          if (this.isOnlineBranch) {
            // Only load complaints for online branch clerks
            this.loadComplaints();
          } else {
            this.error = 'Complaints are only available for online branch clerks.';
          }
        } else {
          this.error = 'Invalid user session. Please log in again.';
        }
      },
      error: (err) => {
        this.error = 'Failed to decode authentication token.';
        console.error('Token decode error:', err);
      }
    });
  }

  loadComplaints(): void {
    this.loading = true;
    this.error = '';
    
    // The auth interceptor will automatically add the token to the request
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
    
    // Auth interceptor will handle token
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
    if (this.isOnlineBranch) {
      this.loadComplaints();
    }
  }

  dismissSuccess(): void {
    this.successMessage = '';
  }

  dismissError(): void {
    this.error = '';
  }
}