import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthServiceService } from '../../_services/auth-service.service';

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    image?: string;
    price?: number;
  };
  quantity: number;
  price: number;
  subTotal?: number;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  branch?: any;
  paymentMethod?: string;
  shippingAddress?: any;
  isOfflineOrder?: boolean;
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

  // Get orders based on branch type
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
          
          // If branchId is null, this is an online branch clerk
          if (branchId === null) {
            // Get all online orders
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
           
            this.http.get<any>(`${this.apiUrlOffline}/getOfflineOrdersByBranchId/${branchId}`)
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
  
  // Get orders by status
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
          
          // If branchId is null, this is an online branch clerk
          if (branchId === null) {
            // Get online orders by status
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
            // For offline orders, we need to filter client-side as there might not be a specific API
            this.getOrders().subscribe({
              next: allOrders => {
                const filtered = allOrders.filter(order => order.status === status);
                observer.next(filtered);
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
  
  // Update order status
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    
    return new Observable(observer => {
      this.authService.decodeToken(token).subscribe({
        next: (decoded) => {
          if (!decoded) {
            observer.error(new Error('Could not decode token'));
            return;
          }
          
          const branchId = decoded.branchId;
          
          // If branchId is null, this is an online branch clerk
          if (branchId === null) {
            // Update online order status
            this.http.put<any>(`${this.apiUrlOnline}/changeOrderStatus/${orderId}/${status}`, {})
              .pipe(catchError(this.handleError))
              .subscribe({
                next: response => {
                  observer.next(response);
                  observer.complete();
                },
                error: err => observer.error(err)
              });
          } else {
            // Update offline order status - if cancelOfflineOrder is the only method available
            if (status === 'cancelled') {
              this.http.put<any>(`${this.apiUrlOffline}/cancelOfflineOrder/${orderId}`, {})
                .pipe(catchError(this.handleError))
                .subscribe({
                  next: response => {
                    observer.next(response);
                    observer.complete();
                  },
                  error: err => observer.error(err)
                });
            } else {
              // If there's no API for other status updates on offline orders
              observer.error(new Error('Status update not supported for offline orders'));
            }
          }
        },
        error: err => observer.error(err)
      });
    });
  }
  
  // Helper function to map online orders
  private mapOnlineOrders(orders: any[]): Order[] {
    return orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber || `ORD-${order._id.substring(0, 6)}`,
      customerName: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'Guest',
      customerEmail: order.userId ? order.userId.email : (order.guestEmail || 'N/A'),
      items: Array.isArray(order.products) ? order.products.map((item: any) => ({
        product: {
          _id: item.productId?._id || item.productId,
          name: item.productId?.name || 'Product',
          image: item.productId?.images?.[0]
        },
        quantity: item.quantity || 1,
        price: item.price || 0,
        subTotal: (item.quantity || 1) * (item.price || 0)
      })) : [],
      totalAmount: order.totalPrice || 0,
      status: order.status ? order.status.toLowerCase() : 'pending',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      isOfflineOrder: false
    }));
  }
  
  // Helper function to map offline orders
  private mapOfflineOrders(orders: any[]): Order[] {
    return orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber || `OFF-${order._id.substring(0, 6)}`,
      customerName: order.customerName || 'Walk-in Customer',
      items: Array.isArray(order.products) ? order.products.map((item: any) => ({
        product: {
          _id: item.productId?._id || item.productId,
          name: item.productId?.name || 'Product',
          image: item.productId?.images?.[0]
        },
        quantity: item.quantity || 1,
        price: item.price || 0,
        subTotal: (item.quantity || 1) * (item.price || 0)
      })) : [],
      totalAmount: order.totalPrice || 0,
      status: order.status ? order.status.toLowerCase() : 'pending',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      branch: order.branch,
      paymentMethod: order.paymentMethod,
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