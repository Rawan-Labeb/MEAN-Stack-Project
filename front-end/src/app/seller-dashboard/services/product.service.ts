import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { Product, ProductFormData, ProductSubmitData } from '../models/product.model';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'http://localhost:5000/api/products'; 
  private productUpdated = new Subject<Product>();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addProduct(product: ProductSubmitData): Observable<Product> {
    console.log('Adding product with data:', product);
    // Use the root endpoint for POST
    return this.http.post<Product>(`${this.apiUrl}`, product).pipe(
      tap(response => console.log('Product creation response:', response))
    );
  }

  updateProduct(id: string, data: ProductFormData): Observable<Product> {
    console.log('Updating product:', id, data);
    
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data).pipe(
      tap(updatedProduct => {
        console.log('Update successful:', updatedProduct);
        this.productUpdated.next(updatedProduct);
      }),
      catchError(this.handleError)
    );
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`).pipe(
      tap(() => console.log('Delete successful')),
      catchError(this.handleError)
    );
  }

  onProductUpdate(): Observable<Product> {
    return this.productUpdated.asObservable();
  }

  getSellerProducts(sellerId: string): Observable<Product[]> {
    console.log('Fetching products for seller:', sellerId);
    return this.http.get<Product[]>(`${this.apiUrl}/seller/${sellerId}`).pipe(
      tap(products => {
        console.log('Raw product response:', JSON.stringify(products, null, 2));
      }),
      catchError(this.handleError)
    );
  }

  uploadImages(formData: FormData): Observable<{imageUrls: string[]}> {
    return this.http.post<{imageUrls: string[]}>('http://localhost:5000/api/upload/upload', formData);
  }

  toggleProductStatus(productId: string): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/toggle-status/${productId}`, {}).pipe(
      tap(response => console.log('Toggle status response:', response)),
      catchError(this.handleError)
    );
  }

  uploadProductImage(file: File): Observable<string[]> {
    const formData = new FormData();
    formData.append('image', file);
    
    // Update the upload URL to match your backend
    return this.http.post<{imageUrls: string[]}>(`${this.apiUrl}/upload`, formData).pipe(
      map(response => response.imageUrls),
      tap(urls => console.log('Uploaded image URLs:', urls)),
      catchError(error => {
        console.error('Error uploading image:', error);
        throw error;
      })
    );
  }

  getProductImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    return imagePath.startsWith('http') 
      ? imagePath 
      : `http://localhost:5000/${imagePath}`;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    if (error.status === 400) {
      const errors = error.error?.errors || [];
      const errorMessage = errors.map((e: any) => 
        `${e.field}: ${e.message}`
      ).join(', ');
      return throwError(() => new Error(errorMessage || error.error?.message));
    }
    return throwError(() => new Error('An error occurred. Please try again.'));
  }
}