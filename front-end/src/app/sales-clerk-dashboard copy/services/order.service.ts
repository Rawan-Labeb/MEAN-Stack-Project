import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'; // Add tap import
import { AuthServiceService } from '../../_services/auth-service.service';
import { BRANCH_CONSTANTS } from '../constants/branch-constants';

export interface OrderItem {
  subInventoryId: string;
  price: number;
  quantity: number;
  _id: string;
}

// Update to match backend schema exactly
export type OrderStatus = 'pending' | 'shipped' | 'cancelled' | 'refunded';

// Update the Order interface
export interface Order {
  _id: string;
  customerId?: string | any; // Make this optional - Can be string ID or populated customer object
  branchId?: string; // Add for offline orders
  customerDetails?: {
    firstName?: string;
    lastName?: string;
    address?: {
      street?: string;
      city?: string;
      zipCode?: string;
    };
    email?: string;
    phone?: string;
  };
  items: any[];
  totalPrice: number;
  status: OrderStatus;
  date?: string;
  createdAt?: string; 
  updatedAt?: string;
  paymentMethod: string;
  notes?: string;
  isOfflineOrder?: boolean;
  orderNumber?: string;
  customerName?: string; // Add to support existing code that uses this property
  branch?: any; // For offline orders
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrlOnline = 'http://localhost:5000/order';
  private apiUrlOffline = 'http://localhost:5000/offlineOrder';
  
  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) { }

  getOrders(): Observable<Order[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    
    // Decode the token to determine branch type
    return new Observable<Order[]>(observer => {
      this.authService.decodeToken(token).subscribe({
        next: (decoded) => {
          if (!decoded) {
            observer.error(new Error('Could not decode token'));
            return;
          }
          
          const branchId = decoded.branchId;
          
          // Updated logic: Check for specific online branch ID
          if (branchId === BRANCH_CONSTANTS.ONLINE_BRANCH_ID) {
            // This is an online branch clerk - get online orders
            console.log('Getting online orders');
            this.http.get<any>(`${this.apiUrlOnline}/getAllOrders`)
              .pipe(
                map(this.mapOnlineOrders),
                catchError(this.handleError)
              )
              .subscribe({
                next: orders => {
                  observer.next(orders);
                  observer.complete();
                },
                error: err => observer.error(err)
              });
          } else {
            // This is an offline branch clerk - get offline orders for this branch
            console.log(`Getting offline orders for branch: ${branchId}`);
            
            // Try the correct endpoint as defined in your routes file
            this.http.get<any>(`${this.apiUrlOffline}/getOfflineOrdersByBranchId/${branchId}`)
              .pipe(
                map(this.mapOfflineOrders),
                catchError(error => {
                  console.error('Failed to fetch offline orders:', error);
                  
                  if (error.status === 403) {
                    return throwError(() => new Error('You do not have permission to view offline orders. Please contact your administrator.'));
                  }
                  
                  return throwError(() => new Error('Failed to load offline orders. Please try again later.'));
                })
              )
              .subscribe({
                next: orders => {
                  observer.next(orders);
                  observer.complete();
                },
                error: err => observer.error(err)
              });
          }
        },
        error: err => observer.error(err)
      });
    });
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    
    return new Observable<Order[]>(observer => {
      this.authService.decodeToken(token).subscribe({
        next: (decoded) => {
          if (!decoded) {
            observer.error(new Error('Could not decode token'));
            return;
          }
          
          const branchId = decoded.branchId;
          
          // Updated logic: Check for specific online branch ID
          if (branchId === BRANCH_CONSTANTS.ONLINE_BRANCH_ID) {
            // Online branch - get online orders by status
            this.http.get<any>(`${this.apiUrlOnline}/getOrdersByStatus/${status}`)
              .pipe(
                map(this.mapOnlineOrders),
                catchError(this.handleError)
              )
              .subscribe({
                next: orders => {
                  observer.next(orders);
                  observer.complete();
                },
                error: err => observer.error(err)
              });
          } else {
            // Offline branch - get offline orders by status for this branch
            this.http.get<any>(`${this.apiUrlOffline}/getOfflineOrdersByStatus/${status}/${branchId}`)
              .pipe(
                map(this.mapOfflineOrders),
                catchError(this.handleError)
              )
              .subscribe({
                next: orders => {
                  observer.next(orders);
                  observer.complete();
                },
                error: err => observer.error(err)
              });
          }
        },
        error: err => observer.error(err)
      });
    });
  }
  
  // Update the updateOrderStatus method
  updateOrderStatus(orderId: string, status: OrderStatus): Observable<any> {
    console.log(`Attempting to update order ${orderId} to status: ${status}`);
    
    // No status mapping needed since we're using the exact same values as backend
    return this.http.put<any>(`${this.apiUrlOnline}/changeOrderStatus/${orderId}/${status}`, {})
      .pipe(
        tap((response: any) => {
          console.log('Status update successful:', response);
        }),
        catchError(error => {
          console.error('Status update error:', error);
          return throwError(() => new Error(`Failed to update order status: ${error.error?.message || error.message || 'Unknown error'}`));
        })
      );
  }
  
  // Helper function to map online orders - directly use API response format
  private mapOnlineOrders(orders: any[]): Order[] {
    return orders.map(order => ({
      _id: order._id,
      customerId: order.customerId,
      customerDetails: order.customerDetails,
      items: order.items || [],
      totalPrice: order.totalPrice || 0,
      totalAmount: order.totalPrice || 0, // For backward compatibility
      status: order.status || 'pending',
      paymentMethod: order.paymentMethod || 'N/A',
      notes: order.notes || '',
      date: order.date,
      createdAt: order.date, // For backward compatibility
      updatedAt: order.date, // For backward compatibility
      orderNumber: `ON-${order._id.substring(0, 6)}`,
      customerName: order.customerDetails ? 
        `${order.customerDetails.firstName} ${order.customerDetails.lastName}` : 
        'Customer',
      isOfflineOrder: false
    }));
  }
  
  // Helper function to map offline orders
  private mapOfflineOrders(orders: any[]): Order[] {
    return orders.map(order => ({
      _id: order._id,
      branchId: order.branchId,
      customerDetails: order.customerDetails,
      items: order.items || [],
      totalPrice: order.totalPrice || 0,
      totalAmount: order.totalPrice || 0, // For backward compatibility
      status: order.status || 'completed',
      paymentMethod: order.paymentMethod || 'Cash',
      notes: order.notes || '',
      date: order.date,
      createdAt: order.date, // For backward compatibility
      updatedAt: order.date, // For backward compatibility
      orderNumber: `OFF-${order._id.substring(0, 6)}`,
      customerName: order.customerDetails ? 
        `${order.customerDetails.firstName} ${order.customerDetails.lastName}` : 
        'Walk-in Customer',
      branch: order.branch,
      isOfflineOrder: true
    }));
  }
  
  // Error handler
  private handleError(error: any) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      // Server-side error with message
      errorMessage = error.error.message;
    } else if (error.status) {
      // HTTP error
      errorMessage = `Error ${error.status}: ${error.statusText}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}