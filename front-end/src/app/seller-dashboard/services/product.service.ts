import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { Product, ProductFormData, ProductSubmitData } from '../models/product.model';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthServiceService } from '../../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000';
  private productUpdated = new Subject<Product>();

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService,
    private cookieService: CookieService
  ) {}

  private getSellerId(): string {
    const token = this.cookieService.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const decodedToken = this.authService.decodeToken(token);
    return decodedToken.id; // or whatever field contains the user/seller ID
  }

  // Keep core CRUD operations
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getAllProducts`);
  }

  getActiveProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getActiveProducts`);
  }

  getDeactivatedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getDeactivatedProducts`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/getProductById/${id}`);
  }

  createProduct(productData: ProductSubmitData): Observable<Product> {
    const sellerId = this.getSellerId();
    const product = {
      ...productData,
      sellerId: sellerId
    };

    return this.http.post<Product>(`${this.apiUrl}/product/createProduct`, product);
  }

  updateProduct(id: string, data: ProductSubmitData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/product/updateProduct/${id}`, data);
  }

  // Keep only one delete method with error handling
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/product/deleteProduct/${id}`).pipe(
      tap(() => console.log('Delete successful')),
      catchError(this.handleError)
    );
  }

  activateProduct(id: string): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product/activeProduct/${id}`, {});
  }

  deactivateProduct(id: string): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product/deactiveProduct/${id}`, {});
  }

  // Keep other unique methods
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getProductsByCategory/${categoryId}`);
  }

  getSellerProducts(sellerId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/seller/${sellerId}`).pipe(
      tap(products => console.log('Raw product response:', JSON.stringify(products, null, 2))),
      catchError(this.handleError)
    );
  }

  // Consolidate image upload methods
  uploadProductImages(files: FileList): Observable<{imageUrls: string[]}> {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('imageUrls', file);
    });
    return this.http.post<{imageUrls: string[]}>('http://localhost:5000/upload', formData);
  }

  // Keep utility methods
  onProductUpdate(): Observable<Product> {
    return this.productUpdated.asObservable();
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    if (error.status === 400) {
      const errors = error.error?.errors || [];
      const errorMessage = errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
      return throwError(() => new Error(errorMessage || error.error?.message));
    }
    return throwError(() => new Error('An error occurred. Please try again.'));
  }
}