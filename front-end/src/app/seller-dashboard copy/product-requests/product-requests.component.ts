import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRequestService } from '../services/product-request.service';
import { ProductRequest } from '../models/product-request.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-requests.component.html',
  styleUrls: ['./product-requests.component.css']
})
export class ProductRequestsComponent implements OnInit {
  requests: ProductRequest[] = [];
  loading = false;
  error: string | null = null;

  constructor(private productRequestService: ProductRequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.error = null;
    
    this.productRequestService.getProductRequestsBySeller().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load product requests';
        this.loading = false;
        console.error('Error loading requests:', err);
        Swal.fire('Error', 'Failed to load requests', 'error');
      }
    });
  }

  updateStatus(id: string, status: string, message: string): void {
    this.productRequestService.updateRequestStatus(id, status, message).subscribe({
      next: () => {
        // Update the local request status to avoid reloading
        const request = this.requests.find(r => r._id === id);
        if (request) {
          request.status = status as 'pending' | 'approved' | 'rejected';
          request.message = message;
        }
        Swal.fire('Success', `Request ${status} successfully`, 'success');
      },
      error: (err) => {
        this.error = err.message || 'Failed to update request status';
        console.error('Error updating request status:', err);
        Swal.fire('Error', `Failed to ${status} request`, 'error');
      }
    });
  }
}