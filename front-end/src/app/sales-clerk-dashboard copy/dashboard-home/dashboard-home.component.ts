import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubInventoryService } from '../../_services/sub-inventory.service';
import { OrderService, Order } from '../services/order.service'; // Import Order type
import { ClerkDistributionService } from '../services/clerk-distribution.service';
import { AuthServiceService } from '../../_services/auth-service.service';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
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

// Update the RecentOrder interface to make date optional
interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'completed';
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
    const subInventory$ = this.branchId ? 
      this.subInventoryService.getActiveSubInventoriesByBranchId(this.branchId).pipe(
        catchError(error => {
          console.error('Error loading sub-inventory:', error);
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
          console.error('Error loading distribution requests:', error);
          return of([]);
        })
      ) : of([]);
    
    forkJoin({
      inventory: subInventory$,
      orders: orders$,
      requests: requests$
    }).subscribe(results => {
      // Process inventory data
      const inventory = results.inventory || [];
      this.stats.totalProducts = inventory.length;
      
      // Find low stock products (less than 10 items)
      this.lowStockProducts = inventory
        .filter(item => item.quantity < 10)
        .map(item => ({
          _id: item._id,
          name: item.product?.name || 'Unknown Product',
          category: item.product?.category?.name || 'Uncategorized',
          quantity: item.quantity,
          image: item.product?.images?.[0]
        }))
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 5); // Take only top 5 lowest stock items
      
      // Process orders data
      const orders = results.orders || [];
      this.stats.totalOrders = orders.length;
      
      // Calculate total revenue from orders
      this.stats.revenue = orders.reduce((sum, order) => sum + (order.totalAmount || order.totalPrice || 0), 0);
      
      // Get recent orders - FIX THE TYPE ERRORS HERE
      this.recentOrders = orders
        .sort((a, b) => {
          // Use nullish coalescing to handle potentially undefined dates
          const dateA = new Date(a.createdAt || a.date || new Date()).getTime();
          const dateB = new Date(b.createdAt || b.date || new Date()).getTime();
          return dateB - dateA;
        })
        .slice(0, 5) // Take only 5 most recent orders
        .map(order => ({
          _id: order._id,
          orderNumber: order.orderNumber || order._id.substring(0, 8),
          customerName: this.getCustomerName(order), // Use the helper method
          status: order.status,
          itemCount: order.items?.length || 0,
          totalAmount: order.totalAmount || order.totalPrice || 0,
          date: order.createdAt || order.date || new Date().toISOString() // Ensure date is never undefined
        }));
      
      // Process distribution requests data
      const requests = results.requests || [];
      this.stats.pendingRequests = requests.filter(req => req.status === 'pending').length;
      
      this.isLoading = false;
    });
  }

  

  // Helper method to get customer name
  getCustomerName(order: Order): string {
    if (order.customerDetails) {
      return `${order.customerDetails.firstName} ${order.customerDetails.lastName}`.trim() || 'Customer';
    }
    if (order.customerName) {
      return order.customerName;
    }
    return 'Customer';
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