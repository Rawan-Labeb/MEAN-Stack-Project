import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Product, ProductFormData } from '../models/product.model';
import { tap, catchError, take } from 'rxjs/operators';

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

  updateProduct(id: string, data: any): Observable<Product> {
    // Send direct JSON data instead of FormData
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data).pipe(
      tap(updatedProduct => {
        console.log('Update successful:', updatedProduct);
        this.productUpdated.next(updatedProduct);
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
}