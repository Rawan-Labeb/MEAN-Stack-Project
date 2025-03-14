import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClerkDistributionService } from '../services/clerk-distribution.service';
import { SubInventoryService } from '../../_services/sub-inventory.service';
import { AuthServiceService } from '../../_services/auth-service.service';
import { HttpClientModule } from '@angular/common/http';
import { DistReq } from '../../_models/dist-req.model';

@Component({
  selector: 'app-distribution-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './distribution-requests.component.html',
  styleUrls: ['./distribution-requests.component.css']
})
export class DistributionRequestsComponent implements OnInit {
  // User data
  clerkId: string = '';
  branchId: string | null = null;
  
  // Form data
  selectedSubInventoryId: string = '';
  requestQuantity: number | null = null;
  requestMessage: string = '';
  
  // Selected item details
  selectedSubInventoryItem: any = null;
  
  // Response messages
  errorMessage: string = '';
  successMessage: string = '';
  
  // Loading state
  isLoading: boolean = false;
  
  // Data from API
  subInventoryItems: any[] = [];
  myRequests: DistReq[] = [];
  filteredRequests: DistReq[] = [];
  
  // Filter values
  statusFilter: string = 'all';
  
  constructor(
    private distService: ClerkDistributionService,
    private subInventoryService: SubInventoryService,
    private authService: AuthServiceService
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }
  
  getUserInfo(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Authentication required. Please log in.';
      return;
    }
    
    this.authService.decodeToken(token).subscribe({
      next: (decoded) => {
        if (decoded) {
          this.clerkId = decoded.sub || decoded.id;
          this.branchId = decoded.branchId;
          console.log('User details:', { clerkId: this.clerkId, branchId: this.branchId });
          
          // Load sub-inventory and previous requests
          if (this.branchId) {
            this.loadSubInventory();
          } else {
            this.errorMessage = 'Branch ID not available.';
          }
          this.loadMyRequests();
        } else {
          this.errorMessage = 'Invalid user session. Please log in again.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to decode authentication token.';
        console.error('Token decode error:', err);
      }
    });
  }
  
  loadSubInventory(): void {
    if (!this.branchId) {
      return;
    }
    
    this.isLoading = true;
    this.subInventoryService.getActiveSubInventoriesByBranchId(this.branchId).subscribe({
      next: (data) => {
        this.subInventoryItems = data;
        console.log('Sub-inventory items:', this.subInventoryItems);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Failed to load your inventory: ${err.message}`;
      }
    });
  }
  
  loadMyRequests(): void {
    if (!this.clerkId || !this.branchId) {
      this.errorMessage = 'User or branch ID not available.';
      return;
    }
    
    this.isLoading = true;
    
    // First make sure we have the inventory items loaded
    this.subInventoryService.getActiveSubInventoriesByBranchId(this.branchId).subscribe({
      next: (items) => {
        this.subInventoryItems = items;
        
        // Now load the requests
        this.distService.getClerkRequests(this.clerkId).subscribe({
          next: (requests) => {
            this.myRequests = requests;
            
            // Add product info to each request
            this.myRequests.forEach(request => {
              // Use type-safe way to get the ID
              const mainInventoryId = typeof request.mainInventory === 'string' ? 
                request.mainInventory : 
                (request.mainInventory && typeof request.mainInventory === 'object' ? 
                  (request.mainInventory as any)._id : undefined);
              
              const matchingItem = this.subInventoryItems.find(item => {
                // Use type-safe way to get the ID
                const itemMainInventoryId = typeof item.mainInventory === 'string' ? 
                  item.mainInventory : 
                  (item.mainInventory && typeof item.mainInventory === 'object' ? 
                    (item.mainInventory as any)._id : undefined);
                
                return itemMainInventoryId === mainInventoryId;
              });
              
              if (matchingItem && matchingItem.product && matchingItem.product.name) {
                // Use type assertion to add the property
                (request as any).productName = matchingItem.product.name;
              }
            });
            
            this.applyFilters();
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = `Failed to load your requests: ${err.message}`;
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Failed to load inventory data: ${err.message}`;
      }
    });
  }
  
  onProductSelection(): void {
    const selectedItem = this.subInventoryItems.find(item => item._id === this.selectedSubInventoryId);
    if (selectedItem) {
      this.selectedSubInventoryItem = selectedItem;
      console.log('Selected item:', selectedItem);
    } else {
      this.selectedSubInventoryItem = null;
    }
  }
  
  submitRequest(): void {
    if (!this.selectedSubInventoryItem || !this.requestQuantity || this.requestQuantity <= 0) {
      this.errorMessage = 'Please select a product and enter a valid quantity.';
      return;
    }
    
    if (!this.clerkId) {
      this.errorMessage = 'User ID not available. Please log in again.';
      return;
    }
    
    // Make sure we have a mainInventory ID to reference
    if (!this.selectedSubInventoryItem.mainInventory) {
      this.errorMessage = 'Cannot determine main inventory for this product.';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const requestData = {
      mainInventory: this.selectedSubInventoryItem.mainInventory,
      branchManager: this.clerkId,
      requestedQuantity: this.requestQuantity,
      message: this.requestMessage || undefined
    };
    
    this.distService.createRequest(requestData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `Request for ${this.selectedSubInventoryItem.product?.name} submitted successfully!`;
        
        // Reset form
        this.selectedSubInventoryId = '';
        this.selectedSubInventoryItem = null;
        this.requestQuantity = null;
        this.requestMessage = '';
        
        // Refresh requests list
        this.loadMyRequests();
        
        // Auto-hide success message
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        
     
        if (err.userFriendly) {
          this.errorMessage = err.message;
        } else {
        
          console.error('Request submission error:', err);
          this.errorMessage = 'Unable to process your request at this time. Please try again later.';
        }
      }
    });
  }
  
  applyFilters(): void {
    if (this.statusFilter === 'all') {
      this.filteredRequests = [...this.myRequests];
    } else {
      this.filteredRequests = this.myRequests.filter(req => 
        req.status === this.statusFilter
      );
    }
  }
  
  // Get product name for display in request history
  getProductName(request: any): string {
    // Case 1: If request has populated product data
    if (request.mainInventory && request.mainInventory.product && request.mainInventory.product.name) {
      return request.mainInventory.product.name;
    }
    
    // Case 2: If mainInventory is an ID, try to match it with our local inventory
    const mainInventoryId = typeof request.mainInventory === 'string' ? 
      request.mainInventory : 
      (request.mainInventory && typeof request.mainInventory === 'object' ? 
        (request.mainInventory as any)._id : undefined);
    
    if (mainInventoryId && this.subInventoryItems && this.subInventoryItems.length > 0) {
      // Try to find a matching item
      const matchingItem = this.subInventoryItems.find(item => {
        // Handle both string mainInventory and object with _id
        const itemMainInventoryId = typeof item.mainInventory === 'string' ? 
          item.mainInventory : 
          (item.mainInventory && typeof item.mainInventory === 'object' ? 
            (item.mainInventory as any)._id : undefined);
        
        return itemMainInventoryId === mainInventoryId;
      });
      
      if (matchingItem) {
        // Extract product name from the matching item
        if (matchingItem.product) {
          if (typeof matchingItem.product === 'object' && matchingItem.product.name) {
            return matchingItem.product.name;
          }
        }
        
        // If the item itself has a name, use that
        if (matchingItem.name) {
          return matchingItem.name;
        }
      }
    }
    
    // Case 3: Check if the request itself has product information
    if (request.product) {
      if (typeof request.product === 'object' && request.product.name) {
        return request.product.name;
      }
    }
    
    // Case 4: Check the added productName property
    if ((request as any).productName) {
      return (request as any).productName;
    }
    
    return 'Unknown Product';
  }
  
  dismissError(): void {
    this.errorMessage = '';
  }
  
  dismissSuccess(): void {
    this.successMessage = '';
  }
  
  // Format status for display
  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'pending': return 'bg-warning text-dark';
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
  
  refreshRequests(): void {
    this.loadMyRequests();
  }
}