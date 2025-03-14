import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { OrderService, Order, OrderStatus } from '../services/order.service';
import { ClerkDistributionService } from '../services/clerk-distribution.service';
import { SubInventoryService, SubInventoryItem } from '../services/sub-inventory.service';
import { AuthServiceService } from '../../_services/auth-service.service';
import { of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { BRANCH_CONSTANTS } from '../constants/branch-constants';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingRequests: number;
  revenue: number;
}

interface LowStockProduct {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  image?: string;
}

// Update the RecentOrder interface to use the shared OrderStatus type
interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus; // Use the shared OrderStatus type
  itemCount: number;
  totalAmount: number;
  date: string; // Non-optional
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  isLoading: boolean = true;
  error: string = '';
  
  branchId: string | null = null;
  clerkId: string = '';
  isOnlineBranch: boolean = false;
  
  stats: DashboardStats = {
    totalProducts: 0,
    totalOrders: 0,
    pendingRequests: 0,
    revenue: 0
  };

  lowStockProducts: LowStockProduct[] = [];
  recentOrders: RecentOrder[] = [];
  loadingOrders: boolean = false;
  totalRevenue: number = 0;

  constructor(
    private subInventoryService: SubInventoryService,
    private orderService: OrderService,
    private distributionService: ClerkDistributionService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'Authentication required. Please log in.';
      this.isLoading = false;
      return;
    }
    
    this.authService.decodeToken(token).subscribe({
      next: (decoded) => {
        if (decoded) {
          this.branchId = decoded.branchId;
          this.isOnlineBranch = this.branchId === BRANCH_CONSTANTS.ONLINE_BRANCH_ID;
          this.clerkId = decoded.sub || decoded.id; // Extract clerk ID from token
          this.loadDashboardData();
        } else {
          this.error = 'Invalid user session. Please log in again.';
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.error = 'Failed to decode authentication token.';
        this.isLoading = false;
      }
    });
  }

  loadDashboardData(): void {
    // First, verify the branch ID
    console.log(`Loading dashboard data for branch ID: ${this.branchId}`);

    // Use the method from the working code
    const subInventory$ = this.branchId ? 
      this.subInventoryService.getActiveSubInventoriesByBranchId(this.branchId).pipe(
        catchError(error => {
          console.error(`Error loading sub-inventory for branch ${this.branchId}:`, error);
          return of([]);
        })
      ) : of([]);
      
    const orders$ = this.orderService.getOrders().pipe(
      catchError(error => {
        console.error('Error loading orders:', error);
        return of([]);
      })
    );
    
    const requests$ = this.clerkId ? 
      this.distributionService.getClerkRequests(this.clerkId).pipe(
        catchError(error => {
          console.error(`Error loading distribution requests for clerk ${this.clerkId}:`, error);
          return of([]);
        })
      ) : of([]);
    
    // Debug all observables
    console.log('Starting forkJoin to load dashboard data...');
    
    forkJoin({
      inventory: subInventory$,
      orders: orders$,
      requests: requests$
    }).subscribe({
      next: results => {
        // Log raw results for debugging
        console.log('Dashboard data loaded:', {
          inventoryCount: results.inventory?.length || 0,
          ordersCount: results.orders?.length || 0,
          requestsCount: results.requests?.length || 0
        });
        
        // Process inventory data
        const inventory = results.inventory || [];
        this.stats.totalProducts = inventory.length;
        console.log(`Setting totalProducts to ${this.stats.totalProducts} from inventory array of length ${inventory.length}`);
        
        // Find low stock products (less than 10 items)
        this.lowStockProducts = this.processLowStockItems(inventory);
        
        // Process orders data
        const orders = results.orders || [];
        this.stats.totalOrders = orders.length;
        
        // Calculate total revenue from orders
        this.stats.revenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        
        // Get recent orders
        this.recentOrders = orders
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.date || new Date()).getTime();
            const dateB = new Date(b.createdAt || b.date || new Date()).getTime();
            return dateB - dateA;
          })
          .slice(0, 5)
          .map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber || order._id.substring(0, 8),
            customerName: this.getCustomerName(order),
            status: order.status as OrderStatus,
            itemCount: order.items?.length || 0,
            totalAmount: order.totalPrice || 0,
            date: order.createdAt || order.date || new Date().toISOString()
          }));
        
        // Process distribution requests data
        const requests = results.requests || [];
        this.stats.pendingRequests = requests.filter(req => req.status === 'pending').length;
        
        this.isLoading = false;
      },
      error: err => {
        console.error('Error in forkJoin subscription:', err);
        this.error = 'Failed to load dashboard data';
        this.isLoading = false;
      }
    });
  }

  // Fix the processLowStockItems method to properly extract product names
  processLowStockItems(inventory: any[]): any[] {
    return inventory
      .filter((item: any) => item.quantity < 10)
      .map((item: any) => {
        // Extract product name properly
        let name = 'Unknown Product';
        
        // Check if item has product property with name
        if (item.product) {
          if (typeof item.product === 'object' && item.product.name) {
            name = item.product.name;
          }
        } 
        // If item itself has a name
        else if (item.name) {
          name = item.name;
        }
        
        // Get category name
        let category = 'Uncategorized';
        if (item.product && typeof item.product === 'object') {
          if (item.product.categoryId) {
            if (typeof item.product.categoryId === 'object' && item.product.categoryId.name) {
              category = item.product.categoryId.name;
            }
          } else if (item.product.category) {
            category = String(item.product.category);
          }
        }
        
        return {
          _id: item._id,
          name: name,
          category: category,
          quantity: item.quantity,
          image: item.product && typeof item.product === 'object' && item.product.images && 
                 item.product.images.length > 0 ? item.product.images[0] : undefined
        };
      })
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);
  }

  // Fix getCustomerName method
  getCustomerName(order: Order): string {
    // First try the customerName property (added to Order interface)
    if (order.customerName) {
      return order.customerName;
    }
    
    // Then check for customerDetails
    if (order.customerDetails) {
      if (order.customerDetails.firstName && order.customerDetails.lastName) {
        return `${order.customerDetails.firstName} ${order.customerDetails.lastName}`;
      } else if (order.customerDetails.firstName) {
        return order.customerDetails.firstName;
      }
    }
    
    // Check for nested customer reference
    if (order.customerId && typeof order.customerId === 'object') {
      const customer = order.customerId as any;
      if (customer.name) {
        return customer.name;
      }
      if (customer.firstName && customer.lastName) {
        return `${customer.firstName} ${customer.lastName}`;
      }
    }
    
    // Fall back to ID if no name is available
    return `Customer #${order._id.substring(0, 6)}`;
  }

  // Add any other methods that need type fixes
  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 5) return 'Critical';
    return 'Low';
  }

  // Helper method to get CSS class for order status
  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'processing': return 'bg-info';
      case 'shipped': return 'bg-primary';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  // Helper method to get CSS class for stock status
  getStockStatusClass(quantity: number): string {
    return quantity < 5 ? 'danger' : 'warning';
  }
}