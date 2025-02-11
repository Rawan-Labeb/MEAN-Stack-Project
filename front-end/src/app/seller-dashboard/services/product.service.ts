import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { Product, ProductFormData } from '../models/product.model';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';
  private productUpdated = new Subject<Product>();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addProduct(data: ProductFormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  updateProduct(id: string, data: ProductFormData): Observable<Product> {
    console.log('Updating product:', id, data);
    
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data).pipe(
      tap(updatedProduct => {
        console.log('Update successful:', updatedProduct);
        this.productUpdated.next(updatedProduct);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Update error:', error);
        if (error.status === 400) {
          const errors = error.error?.errors || [];
          const errorMessage = errors.map((e: any) => 
            `${e.field}: ${e.message}`
          ).join(', ');
          return throwError(() => new Error(errorMessage || error.error?.message));
        }
        return throwError(() => new Error('Failed to update product'));
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    console.log('Deleting product at:', `${this.apiUrl}/${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Delete successful'))
    );
  }

  onProductUpdate(): Observable<Product> {
    return this.productUpdated.asObservable();
  }

  getSellerProducts(sellerId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/seller/${sellerId}`);
  }
}