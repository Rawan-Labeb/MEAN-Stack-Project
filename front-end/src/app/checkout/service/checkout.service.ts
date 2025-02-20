import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../_models/order.module';
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'http://localhost:5000/api/checkout';

  constructor(private http: HttpClient) {}
  

  createOrder(order: Partial<Order>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, order);
  }

  // getOrderById(orderId: number): Observable<Order> {
  //   return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  // }

  // updateOrder(orderId: number, order: Order): Observable<Order> {
  //   return this.http.put<Order>(`${this.apiUrl}/${orderId}`, order);
  // }

  // deleteOrder(orderId: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  // }
}