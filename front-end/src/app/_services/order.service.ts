import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Order } from "../_models/order.module";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiUrl = "http://localhost:5000/order"; // Update with your actual backend API URL

  constructor(private http: HttpClient) {}

  /** Get all orders */
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  /** Get a single order by ID */
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  /** Add a new order */
  addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  /** Update an existing order */
  updateOrder(orderId: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}`, order);
  }

  /** Delete an order */
  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  }

  getUserOrders(id:string)
  {
    return this.http.get<Order[]>(`${this.apiUrl}/getOrderByCustomerId/${id}`)
  }


}

