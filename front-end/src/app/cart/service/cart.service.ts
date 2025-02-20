import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Product } from '../../seller-dashboard/models/product.model';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  public apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // إضافة منتج إلى السلة
  addToCart(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/add`, { userId, productId, quantity });
  }

  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart/${userId}`);
  }

  addOrder(data: any): Observable<{ status: number, message: string, data: { ErrorMsg: string, success: boolean, order: any } }> {
    return this.http.post<{ status: number, message: string, data: { ErrorMsg: string, success: boolean, order: any } }>(`${this.apiUrl}/orders`, data);
  }

  updateCartItem(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart/${userId}`, { productId, quantity });
  }

  increaseQuantity(userId: string, productId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart/inc/${userId}/product/${productId}`, {});
  }

  decreaseQuantity(userId: string, productId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart/dec/${userId}/product/${productId}`, {});
  }

  removeFromCart(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/remove/${userId}/product/${productId}`).pipe(
      catchError(error => {
        console.error('There was an error!', error);
        return throwError(error);
      })
    );
  }

  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/clear/${userId}`);
  }

  getProductDetails(userId: string, productId: string): Observable<Product> {
  return this.http.get<Product>(`${this.apiUrl}/cart/${userId}/product-details/${productId}`);
}
checkout(userId: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/checkout`, { userId });
}

}


