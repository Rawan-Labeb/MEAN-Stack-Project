import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../_models/order.module';
import { Product } from '../_models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/order';

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}/createOrder`, order);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/getAllOrders`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/getOrderById/${id}`);
  }

  getOrdersByCustomerAndStatus(id: string, status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/getOrderByCustomerAndStatus/${id}/${status}`);
  }

  getOrdersByCustomerId(id: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/getOrderByCustomerId/${id}`);
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/getOrdersByStatus/${status}`);
  }

  getOrdersByProductId(id: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/getOrdersByProductId/${id}`);
  }

  changeOrderStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/changeOrderStatus/${id}/${status}`, {});
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteOrder/${id}`);
  }

  updateOrder(id: string, order: Partial<Order>): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateOrder/${id}`, order);
  }

}

