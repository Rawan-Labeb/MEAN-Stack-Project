import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnalyticsData } from '../analytics/models/analytics.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/order';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/getAllOrders`)
      .pipe(catchError(this.handleError));
  }

  changeOrderStatus(orderId: string, newStatus: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/changeOrderStatus/${orderId}/${newStatus}`, {})
      .pipe(catchError(this.handleError));
  }

  getSalesAnalytics(startDate: string, endDate: string): Observable<AnalyticsData> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<AnalyticsData>(`${this.apiUrl}/getSalesAnalytics`, { params })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error.error?.message || 'Server error');
  }
}