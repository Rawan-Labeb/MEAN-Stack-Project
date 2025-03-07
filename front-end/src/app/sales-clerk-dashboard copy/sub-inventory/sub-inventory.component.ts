import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubInventoryService } from '../../_services/sub-inventory.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthServiceService } from '../../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';
// Add this import
import { CategoryService } from '../../_services/category.service';

interface SubInventoryDisplayItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  isActive: boolean;
  imageUrl: string;
  createdAt: Date;
  subInventoryId: string; // ID of the sub inventory record
  productId: string; // ID of the product
}

@Component({
  selector: 'app-sub-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './sub-inventory.component.html',
  styleUrls: ['./sub-inventory.component.css']
})
export class SubInventoryComponent implements OnInit {
  subInventoryItems: SubInventoryDisplayItem[] = [];
  filteredItems: SubInventoryDisplayItem[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  isLoading: boolean = true;
  error: string = '';
  successMessage: string = '';
  
  // User related properties
  branchId: string | null = null;
  branchName: string = '';
  isOnlineBranch: boolean = false;
  clerkId: string = '';

  // Define the online branch ID constant
  private readonly ONLINE_BRANCH_ID = '67b129216e1b912065196f93';

  // Add this category map to your component
  private categoryIdMap: {[key: string]: string} = {
    '67ad2a39f43067609aa806ba': 'Women',  // Update these with the correct mappings
    '67ad2a52f43067609aa806bc': 'Men',    // after running the fetch code
    '67ad2a6ff43067609aa806be': 'Unisex'  // to get actual category names
  };

  constructor(
    private subInventoryService: SubInventoryService,
    private authService: AuthServiceService,
    private cookieService: CookieService,
    // Add this injection
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories(); // Load categories first, then inventory
  }

  initializeUserData(): void {
    this.isLoading = true;
    const token = this.authService.getToken();
    
    if (token) {
      this.authService.decodeToken(token).subscribe(decoded => {
        if (decoded) {
          this.clerkId = decoded.id || decoded.sub;
          this.branchId = decoded.branchId;
          
          // Update: Check for the specific online branch ID
          this.isOnlineBranch = this.branchId === this.ONLINE_BRANCH_ID;
          
          // For online branches, we might not have branch ID in some cases
          // If not, we try to get it from localStorage
          if (!this.branchId && this.isOnlineBranch) {
            this.branchId = localStorage.getItem('branchId') || this.ONLINE_BRANCH_ID;
          }
          
          this.branchName = decoded.branchName || '';
          
          console.log('User details:', {
            clerkId: this.clerkId,
            branchId: this.branchId,
            branchName: this.branchName,
            isOnline: this.isOnlineBranch
          });
          
          // Now load sub-inventory based on the clerk's branch
          this.loadSubInventory();
        } else {
          this.error = 'Invalid user session. Please log in again.';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'Authentication token not found. Please log in.';
      this.isLoading = false;
    }
  }

  loadSubInventory(): void {
    this.isLoading = true;
    this.error = '';
    
    // Always get branch ID either from token or from localStorage as fallback
    const branchId = this.branchId || localStorage.getItem('branchId');
    
    if (branchId) {
      // Branch ID available - use this endpoint (doesn't require auth per controller)
      console.log(`Loading inventory by branch ID: ${branchId}`);
      this.subInventoryService.getActiveSubInventoriesByBranchId(branchId).subscribe({
        next: (data: any[]) => {
          this.handleInventoryData(data);
        },
        error: this.handleError.bind(this)
      });
    } 
    else {
      // If no branch ID available, show an error
      this.error = 'Could not determine your branch. Please contact support.';
      this.isLoading = false;
      
      // Try to log branch information for debugging
      console.error('Branch information missing:', {
        decodedBranchId: this.branchId,
        localStorageBranchId: localStorage.getItem('branchId'),
        branchName: this.branchName,
        isOnlineBranch: this.isOnlineBranch
      });
    }
  }

  private handleInventoryData(data: any[]): void {
    // Process received inventory data
    if (Array.isArray(data) && data.length > 0) {
      this.subInventoryItems = this.transformSubInventoryData(data);
      this.filteredItems = [...this.subInventoryItems];
      this.isLoading = false;
    } else {
      // Handle empty inventory case
      this.subInventoryItems = [];
      this.filteredItems = [];
      this.isLoading = false;
      console.log('No inventory items found or empty response');
    }
  }

  private handleError(err: any): void {
    console.error('Error loading sub-inventory:', err);
    this.error = `Failed to load inventory items: ${err.message || 'Unknown error'}`;
    this.isLoading = false;
  }

  // Transform API data to our display format
  transformSubInventoryData(data: any[]): SubInventoryDisplayItem[] {
    return data.map(item => {
      // Handle both nested and flat data structures
      const product = item.product || item;
      
      let category = 'Uncategorized';
      
      // Use the ID mapping for category names
      if (product.categoryId) {
        if (typeof product.categoryId === 'string') {
          // Look up the category name by ID
          category = this.categoryIdMap[product.categoryId] || 'Uncategorized';
        } else if (typeof product.categoryId === 'object' && product.categoryId.name) {
          // If there's already a name property, use it
          category = product.categoryId.name;
        }
      } else if (product.category) {
        if (typeof product.category === 'string') {
          // Check if this string is an ID in our map
          category = this.categoryIdMap[product.category] || product.category;
        } else if (typeof product.category === 'object' && product.category.name) {
          category = product.category.name;
        }
      }
      
      return {
        _id: product._id || item._id,
        name: product.name || 'Unknown Product',
        description: product.description || '',
        category: category,
        quantity: item.quantity || 0,
        price: product.price || 0,
        isActive: item.isActive !== undefined ? item.isActive : true,
        imageUrl: product.images && product.images.length > 0 
          ? product.images[0] 
          : 'assets/images/placeholder.jpg',
        createdAt: new Date(item.createdAt || Date.now()),
        subInventoryId: item._id, // The actual sub-inventory record ID
        productId: product._id  // The product ID
      };
    });
  }

  applyFilters(): void {
    this.filteredItems = this.subInventoryItems.filter(item => {
      // Apply search term filter
      const searchMatch = !this.searchTerm || 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Apply status filter
      const statusMatch = this.statusFilter === 'all' || 
        (this.statusFilter === 'active' && item.isActive) || 
        (this.statusFilter === 'inactive' && !item.isActive);
      
      return searchMatch && statusMatch;
    });
    
    this.sortItems();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      // If already sorting by this column, toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.sortItems();
  }

  sortItems(): void {
    this.filteredItems.sort((a: any, b: any) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];
      
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'bi bi-sort-alpha-down';
    }
    return this.sortDirection === 'asc' ? 'bi bi-sort-up' : 'bi bi-sort-down';
  }

  toggleStatus(item: SubInventoryDisplayItem): void {
    this.isLoading = true;
    
    if (item.isActive) {
      // Deactivate - requires auth per controller
      this.subInventoryService.deactiveSubInventory(item.subInventoryId).subscribe({
        next: (response) => {
          item.isActive = false;
          this.isLoading = false;
          this.successMessage = `${item.name} has been deactivated`;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error deactivating item:', err);
          this.error = `Failed to deactivate item: ${err.message || 'Unknown error'}`;
          this.isLoading = false;
        }
      });
    } else {
      // Activate - requires auth per controller
      this.subInventoryService.activeSubInventory(item.subInventoryId).subscribe({
        next: (response) => {
          item.isActive = true;
          this.isLoading = false;
          this.successMessage = `${item.name} has been activated`;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error('Error activating item:', err);
          this.error = `Failed to activate item: ${err.message || 'Unknown error'}`;
          this.isLoading = false;
        }
      });
    }
  }

  refreshStock(): void {
    this.loadSubInventory();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  // Simple method to show a success message
  private showSuccessMessage(message: string): void {
    // Create a transient success message that auto-clears
    this.error = ''; // Clear any existing errors
    this.successMessage = message;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  dismissError(): void {
    this.error = '';
  }

  dismissSuccess(): void {
    this.successMessage = '';
  }

  // Then add a method to load categories when component initializes
  private loadCategories(): void {
    // Change getAllCategories to getAllCategorier
    this.categoryService.getAllCategorier().subscribe({
      next: (categories: any[]) => {
        // Update the category mapping
        categories.forEach((category: any) => {
          this.categoryIdMap[category._id] = category.name;
        });
        
        // After loading categories, load inventory data
        this.initializeUserData();
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        // Still load inventory even if categories fail
        this.initializeUserData();
      }
    });
  }
}