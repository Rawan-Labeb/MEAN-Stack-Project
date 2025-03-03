import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRequestService } from '../services/product-request.service';
import { AuthServiceService } from '../../_services/auth-service.service';
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

  constructor(
    private productRequestService: ProductRequestService,
    private authService: AuthServiceService
  ) {}

  ngOnInit() {

    // Simplified initialization - the service now handles getting the token and ID
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    // No longer need to pass sellerId and token - service handles that
    this.productRequestService.getProductRequestsBySeller()
      .subscribe({
        next: (requests: ProductRequest[]) => {
          this.requests = requests;
          this.loading = false;
        },
        error: (error: Error) => {
          console.error('Error loading requests:', error);
          this.loading = false;
          Swal.fire('Error', 'Failed to load requests', 'error');
        }
      });
  }

  updateStatus(requestId: string, status: 'approved' | 'rejected', defaultMessage: string): void {
    Swal.fire({
      title: `${status === 'approved' ? 'Approve' : 'Reject'} Request`,
      input: 'text',
      inputLabel: 'Enter message',
      inputValue: defaultMessage,
      showCancelButton: true,
      confirmButtonText: status === 'approved' ? 'Approve' : 'Reject',
    }).then((result) => {
      if (result.isConfirmed) {
        // No longer need to pass token - service handles that
        this.productRequestService.updateRequestStatus(requestId, status, result.value)
          .subscribe({
            next: (updatedRequest: ProductRequest) => {
              const index = this.requests.findIndex(r => r._id === requestId);
              if (index !== -1) {
                this.requests[index] = updatedRequest;
              }
              Swal.fire('Success', `Request ${status} successfully`, 'success');
            },
            error: (error: Error) => {
              console.error('Error updating request:', error);
              Swal.fire('Error', `Failed to ${status} request`, 'error');
            }
          });
      }
    });
  }
}