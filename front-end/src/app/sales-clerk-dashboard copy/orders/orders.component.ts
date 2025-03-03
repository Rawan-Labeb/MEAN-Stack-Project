import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../services/order.service';
import { AuthServiceService } from '../../_services/auth-service.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter: string = 'all';
  
  // Branch information
  isOnlineBranch: boolean = false;
  branchId: string | null = null;
  branchName: string = '';
  
  // UI state
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';
  
  constructor(
    private orderService: OrderService,
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
          this.branchId = decoded.branchId;
          this.isOnlineBranch = this.branchId === null;
          console.log(`User is ${this.isOnlineBranch ? 'online' : 'offline'} branch clerk`);
          this.loadOrders();
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
  
  loadOrders(): void {
    this.loading = true;
    this.error = '';
    
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = `Failed to load orders: ${err.message}`;
        console.error('Error loading orders:', err);
      }
    });
  }
  
  applyFilters(): void {
    if (this.statusFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(
        order => order.status === this.statusFilter
      );
    }
    
    // Sort orders by createdAt date (newest first)
    this.filteredOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  updateStatus(orderId: string, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'): void {
    if (!this.isStatusChangeAllowed(orderId, newStatus)) {
      this.error = 'This status change is not allowed. Please contact support.';
      setTimeout(() => this.error = '', 3000);
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        // Update local order status
        const order = this.orders.find(o => o._id === orderId);
        if (order) {
          order.status = newStatus;
          order.updatedAt = new Date().toISOString();
        }
        
        this.applyFilters();
        this.loading = false;
        this.successMessage = `Order status updated to ${newStatus}`;
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = `Failed to update order status: ${err.message}`;
        console.error('Error updating order status:', err);
      }
    });
  }
  
  // Check if status change is allowed based on branch type and current status
  isStatusChangeAllowed(orderId: string, newStatus: string): boolean {
    const order = this.orders.find(o => o._id === orderId);
    if (!order) return false;
    
    // For offline orders, we may only allow cancellation
    if (order.isOfflineOrder && !this.isOnlineBranch) {
      return newStatus === 'cancelled';
    }
    
    // For online branch, allow all status changes
    return true;
  }
  
  // Format price to two decimal places
  formatPrice(price: number): string {
    return price.toFixed(2);
  }
  
  getOrderTypeLabel(order: Order): string {
    return order.isOfflineOrder ? 'In-Store' : 'Online';
  }
  
  clearMessages(): void {
    this.error = '';
    this.successMessage = '';
  }
}