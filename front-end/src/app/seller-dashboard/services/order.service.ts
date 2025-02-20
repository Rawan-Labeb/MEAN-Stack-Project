import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderItem {
  productId: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  customerId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'shipped' | 'completed' | 'cancelled' | 'returned' | 'refunded';
  paymentMethod: 'Cash' | 'Card' | 'Online';
  date: Date;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      zipCode: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/getAllOrders`);
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/getOrdersByStatus/${status}`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/changeOrderStatus/${orderId}/${status}`, {});
  }

  getOrderAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics`);
  }
}