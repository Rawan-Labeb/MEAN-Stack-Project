import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Models
interface InventoryItem {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  category: string;
}

interface DistributionRequest {
  _id: string;
  mainInventory: {
    _id: string;
    name: string;
  };
  branchManager: string;
  requestedQuantity: number;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  createdAt: Date;
}

@Component({
  selector: 'app-distribution-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './distribution-requests.component.html',
  styleUrls: ['./distribution-requests.component.css']
})
export class DistributionRequestsComponent implements OnInit {
  // Branch manager ID (will be extracted from token in real implementation)
  branchManagerId: string = '67b129216e1b912065196f93'; // Static for now
  
  // Form fields
  selectedInventory: string = '';
  requestQuantity: number | null = null;
  requestMessage: string = '';
  
  // Filter
  statusFilter: string = 'all';
  
  // Static data for UI demonstration
  inventoryItems: InventoryItem[] = [
    {
      _id: '1',
      name: 'Chanel No. 5',
      description: 'Iconic fragrance with aldehydic floral notes',
      quantity: 50,
      category: 'Women\'s Perfume'
    },
    {
      _id: '2',
      name: 'Dior Sauvage',
      description: 'Fresh and bold masculine fragrance',
      quantity: 35,
      category: 'Men\'s Perfume'
    },
    {
      _id: '3',
      name: 'Acqua di Gio',
      description: 'Light and airy marine-inspired fragrance',
      quantity: 20,
      category: 'Men\'s Perfume'
    },
    {
      _id: '4',
      name: 'Marc Jacobs Daisy',
      description: 'Fresh and feminine with notes of wild berries',
      quantity: 15,
      category: 'Women\'s Perfume'
    },
    {
      _id: '5',
      name: 'Versace Eros',
      description: 'Bold and intense with mint and vanilla',
      quantity: 10,
      category: 'Men\'s Perfume'
    }
  ];
  
  distributionRequests: DistributionRequest[] = [
    {
      _id: 'req12345678901234567890',
      mainInventory: {
        _id: '1',
        name: 'Chanel No. 5'
      },
      branchManager: '67b129216e1b912065196f93',
      requestedQuantity: 10,
      status: 'pending',
      createdAt: new Date(2023, 11, 15)
    },
    {
      _id: 'req23456789012345678901',
      mainInventory: {
        _id: '2',
        name: 'Dior Sauvage'
      },
      branchManager: '67b129216e1b912065196f93',
      requestedQuantity: 5,
      status: 'approved',
      message: 'Urgent need for holiday season',
      createdAt: new Date(2023, 10, 20)
    },
    {
      _id: 'req34567890123456789012',
      mainInventory: {
        _id: '3',
        name: 'Acqua di Gio'
      },
      branchManager: '67b129216e1b912065196f93',
      requestedQuantity: 15,
      status: 'rejected',
      message: 'Need more stock for the weekend sale',
      createdAt: new Date(2023, 9, 10)
    }
  ];
  
  filteredRequests: DistributionRequest[] = [];
  
  ngOnInit(): void {
    // Initialize filtered requests
    this.applyFilters();
  }
  
  submitRequest(): void {
    if (!this.selectedInventory || !this.requestQuantity) {
      return;
    }
    
    // Find inventory item
    const selectedItem = this.inventoryItems.find(item => item._id === this.selectedInventory);
    
    if (!selectedItem) {
      return;
    }
    
    // Create new request (static implementation)
    const newRequest: DistributionRequest = {
      _id: 'req' + Math.random().toString(36).substring(2, 15),
      mainInventory: {
        _id: selectedItem._id,
        name: selectedItem.name
      },
      branchManager: this.branchManagerId,
      requestedQuantity: this.requestQuantity,
      status: 'pending',
      message: this.requestMessage,
      createdAt: new Date()
    };
    
    // Add to requests array (in real implementation, this would be an API call)
    this.distributionRequests.unshift(newRequest);
    this.applyFilters();
    
    // Reset form
    this.selectedInventory = '';
    this.requestQuantity = null;
    this.requestMessage = '';
    
    // Show success message
    alert('Distribution request submitted successfully!');
  }
  
  applyFilters(): void {
    if (this.statusFilter === 'all') {
      this.filteredRequests = [...this.distributionRequests];
    } else {
      this.filteredRequests = this.distributionRequests.filter(
        request => request.status === this.statusFilter
      );
    }
  }
}