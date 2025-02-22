import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';

  constructor(private http: HttpClient) {}

  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  addToCart(userId: string, subInventoryId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { userId, subInventoryId, quantity });
  }

  removeFromCart(userId: string, subInventoryId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${userId}/subInventory/${subInventoryId}`);
  }

  increaseQuantity(userId: string, subInventoryId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/inc/${userId}/subInventory/${subInventoryId}`, {});
  }

  decreaseQuantity(userId: string, subInventoryId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/dec/${userId}/subInventory/${subInventoryId}`, {});
  }

  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/delete`);
  }

  getProductDetails(userId: string, subInventoryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}/subInventory-details/${subInventoryId}`);
  }
}