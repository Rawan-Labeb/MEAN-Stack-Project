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
    private productApiUrl = 'http://localhost:5000/product';


  constructor(private http: HttpClient) {} // Update with your actual backend API URL


  /** Get all orders */
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/getAllOrders`);
  }

  /** Get a single order by ID */
  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  /** Add a new order */
  addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}`, order);
  }

  /** Update an existing order */
  updateOrder(orderId: string, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}`, order);
  }

  /** Delete an order */
  deleteOrder(orderId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteOrder/${orderId}`);
  }
  getUserOrders(id: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/getOrderByCustomerId/${id}`);
  }

  removeFromOrder(orderId: string, productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}/items/${productId}`);
  }

  updateProductQuantity(productId: string, quantity: number): Observable<Product> {
    return this.http.put<Product>(`${this.productApiUrl}/updateQuantity/${productId}`, { quantity });
  }

  updateProductSales(productId: string, sales: number): Observable<Product> {
    return this.http.put<Product>(`${this.productApiUrl}/updateSales/${productId}`, { sales });
  }

}

