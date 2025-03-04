import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { AnalyticsData } from '../analytics/models/analytics.model';
import { Order } from '../models/order.model';
import { AuthServiceService } from '../../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';

// Define the item structure
export interface OrderItem {
  subInventoryId: string | {
    _id: string;
    name?: string;
    quantity?: number;
    price?: number;
    product?: {
      _id: string;
      name?: string;
      sellerId?: string;
    }
  };
  price: number;
  quantity: number;
  productId?: string; // Add this field
  product?: {
    _id: string;
    name?: string;
    sellerId?: string;
  };
  sellerId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/order'; // Add /order to base URL

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService,
    private cookieService: CookieService
  ) {}

  getAllOrders(): Observable<Order[]> {
    // Use correct endpoint with /order prefix
    return this.http.get<Order[]>(`${this.apiUrl}/getAllOrders`)
      .pipe(
        tap(orders => console.log(`Fetched ${orders.length} total orders`)),
        catchError(error => {
          console.error('Error fetching all orders:', error);
          return throwError(() => error);
        })
      );
  }

  changeOrderStatus(orderId: string, status: string): Observable<Order> {
    // Use correct endpoint with /order prefix
    return this.http.put<Order>(`${this.apiUrl}/changeOrderStatus/${orderId}/${status}`, {})
      .pipe(catchError(this.handleError));
  }

  getSalesAnalytics(startDate: string, endDate: string): Observable<AnalyticsData> {
    const token = this.cookieService.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.authService.decodeToken(token).pipe(
      switchMap(decodedToken => {
        if (!decodedToken) {
          throw new Error('Invalid token');
        }
        
        const params = new HttpParams()
          .set('startDate', startDate)
          .set('endDate', endDate)
          .set('sellerId', decodedToken.sub);
        
        return this.http.get<AnalyticsData>(`${this.apiUrl}/getSalesAnalytics`, { params });
      }),
      catchError(this.handleError)
    );
  }

  // Update the getSellerOrders method
  getSellerOrders(): Observable<Order[]> {
    const token = this.cookieService.get('token');
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    return this.authService.decodeToken(token).pipe(
      switchMap(decodedToken => {
        if (!decodedToken) {
          return throwError(() => new Error('Invalid token'));
        }
        
        const sellerId = decodedToken.sub || decodedToken.id || decodedToken._id;
        console.log('Getting orders for seller ID:', sellerId);
        
        // Use the new endpoint specifically for seller orders
        return this.http.get<Order[]>(`${this.apiUrl}/getOrdersBySellerId/${sellerId}`).pipe(
          tap(orders => console.log(`Found ${orders.length} orders for seller ${sellerId}`)),
          catchError(error => {
            console.error('Error fetching seller orders:', error);
            return throwError(() => error);
          })
        );
      })
    );
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    // Use correct endpoint with /order prefix
    return this.http.get<Order[]>(`${this.apiUrl}/getOrdersByStatus/${status}`)
      .pipe(catchError(this.handleError));
  }

  getOrderById(orderId: string): Observable<Order> {
    // Use correct endpoint with /order prefix
    return this.http.get<Order>(`${this.apiUrl}/getOrderById/${orderId}`)
      .pipe(catchError(this.handleError));
  }

  // Updated method with improved filtering
  filterOrdersBySeller(orders: Order[], sellerId: string): Order[] {
    console.log(`Filtering ${orders.length} orders for seller ${sellerId}`);
    
    return orders.filter(order => {
      // Check if order has items
      if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
        return false;
      }
      
      return order.items.some((item: OrderItem) => {
        // Case 1: Check subInventoryId as object with nested product
        if (item.subInventoryId && typeof item.subInventoryId === 'object') {
          const subInv = item.subInventoryId;
          if (subInv.product && typeof subInv.product === 'object') {
            if (subInv.product.sellerId === sellerId) {
              console.log(`Found match in subInventoryId.product.sellerId for order ${order._id}`);
              return true;
            }
          }
        }
        
        // Case 2: Check direct product field
        if (item.product && typeof item.product === 'object') {
          if (item.product.sellerId === sellerId) {
            console.log(`Found match in item.product.sellerId for order ${order._id}`);
            return true;
          }
        }
        
        // Case 3: Check direct sellerId on item
        if (item.sellerId === sellerId) {
          console.log(`Found match in item.sellerId for order ${order._id}`);
          return true;
        }
        
        return false;
      });
    });
  }

  // Add this diagnostic method
  testSellerOrdersApi(): void {
    const token = this.cookieService.get('token');
    if (!token) {
      console.error('No token available');
      return;
    }
    
    this.authService.decodeToken(token).subscribe(decodedToken => {
      if (!decodedToken) {
        console.error('Invalid token');
        return;
      }
      
      const sellerId = decodedToken.sub || decodedToken.id || decodedToken._id;
      console.log('Testing API for seller:', sellerId);
      
      // Make a direct API call
      this.http.get(`${this.apiUrl}/getOrdersBySellerId/${sellerId}`).subscribe({
        next: (response) => console.log('API Response:', response),
        error: (err) => console.error('API Error:', err)
      });
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error.error?.message || 'Server error');
  }
}