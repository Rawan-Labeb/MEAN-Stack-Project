import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError, of } from 'rxjs';
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
  private productUpdateSubject = new Subject<void>();

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService,
    private cookieService: CookieService
  ) {}

  private getSellerId(): Observable<string> {
    const token = this.cookieService.get('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return this.authService.decodeToken(token).pipe(
      map(decodedToken => {
        if (!decodedToken) {
          throw new Error('Invalid token');
        }
        return decodedToken.id;
      })
    );
  }

  getSellerIdFromToken(): Observable<string | null> {
    const token = localStorage.getItem('token');
    if (token) {
      return this.authService.decodeToken(token).pipe(
        map(decodedToken => decodedToken ? decodedToken.id : null)
      );
    }
    return of(null);
  }

  private verifyUserStatus(): Observable<boolean> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<any>(`${this.apiUrl}/user/status`, { headers }).pipe(
      tap(response => console.log('User status:', response)),
      map(response => response.isActive === true),
      catchError(error => {
        console.error('Error checking user status:', error);
        return of(false);
      })
    );
  }

  checkUserStatus(): void {
    const token = this.cookieService.get('token');
    console.log('Current token:', token);
    
    this.authService.decodeToken(token).subscribe({
      next: (decoded) => console.log('Decoded token:', decoded),
      error: (err) => console.error('Token decode error:', err)
    });
  
    this.verifyUserStatus().subscribe({
      next: (isActive) => console.log('User is active:', isActive),
      error: (err) => console.error('Status check error:', err)
    });
  }

  // Core CRUD operations
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

  // Create a product with file upload support
  createProduct(productData: ProductFormData, files: File[] = []): Observable<any> {
    console.log('Creating product with data:', productData);
    
    // Ensure we have the token explicitly for this call
    const token = this.cookieService.get('token') || localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available');
      return throwError(() => new Error('Authentication required'));
    }

    // Format token properly for authorization - ensure Bearer has a space after it
    const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const headers = new HttpHeaders().set('Authorization', authToken);
    
    console.log('Token format check:', {
      originalToken: token.substring(0, 20) + '...',
      formattedToken: authToken.substring(0, 20) + '...',
      hasBearer: token.startsWith('Bearer '),
      tokenLength: token.length
    });

    // If we have files to upload, do that first
    if (files && files.length > 0) {
      const formData = new FormData();
      
      // Append all files
      Array.from(files).forEach(file => {
        formData.append('imageUrls', file);
      });
      
      // First upload the images
      return this.http.post<any>(`${this.apiUrl}/upload`, formData, { headers }).pipe(
        catchError(error => {
          console.error('Error uploading product images:', error);
          return throwError(() => error);
        }),
        switchMap(uploadResult => {
          console.log('Image upload result:', uploadResult);
          
          // Once images are uploaded, create the product
          const productToSave = {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            quantity: productData.quantity,
            categoryId: productData.categoryId,
            sellerId: productData.sellerId,
            isActive: productData.isActive !== undefined ? productData.isActive : true,
            images: uploadResult.imageUrls || []
          };
          
          // Create the product with the image URLs
          return this.http.post<any>(
            `${this.apiUrl}/product/createProduct`,
            productToSave,
            { headers }
          ).pipe(
            catchError(error => {
              console.error('Error creating product:', error);
              if (error.status === 401) {
                console.error('Authentication error - token may be invalid or expired:', authToken);
              }
              return throwError(() => error);
            })
          );
        })
      );
    } else {
      // No images to upload, create the product directly
      const productToSave = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        quantity: productData.quantity,
        categoryId: productData.categoryId,
        sellerId: productData.sellerId,
        isActive: productData.isActive !== undefined ? productData.isActive : true,
        images: []
      };
      
      // Log the full request details
      console.log('Sending product creation request:', {
        url: `${this.apiUrl}/product/createProduct`,
        headers: {
          'Authorization': authToken.substring(0, 30) + '...',
          'Content-Type': 'application/json'
        },
        body: productToSave
      });
      
      return this.http.post<any>(
        `${this.apiUrl}/product/createProduct`,
        productToSave,
        { headers }
      ).pipe(
        catchError(error => {
          console.error('Error creating product:', error);
          // Log more details about the error
          console.error('Error response details:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message,
            url: error.url
          });
          
          return throwError(() => error);
        })
      );
    }
  }

  // Update a product with file upload support
  updateProduct(id: string, productData: ProductFormData, files: File[] = []): Observable<Product> {
    const formData = new FormData();
    
    // Append product data
    formData.append('name', productData.name);
    formData.append('price', productData.price.toString());
    formData.append('quantity', productData.quantity.toString());
    formData.append('description', productData.description);
    formData.append('isActive', productData.isActive.toString());
    formData.append('categoryId', productData.categoryId);
    formData.append('sellerId', productData.sellerId);
    
    // First, upload images if any
    if (files.length > 0) {
      return this.uploadProductImages(files).pipe(
        switchMap(response => {
          // Add image URLs to product data
          if (response && response.imageUrls) {
            formData.append('images', JSON.stringify(response.imageUrls));
          }
          
          // Then update the product with image URLs
          return this.http.put<Product>(`${this.apiUrl}/product/updateProduct/${id}`, formData).pipe(
            tap(() => this.notifyProductUpdate()),
            catchError(this.handleError)
          );
        }),
        catchError(this.handleError)
      );
    }
    
    // No images to upload, just update the product
    return this.http.put<Product>(`${this.apiUrl}/product/updateProduct/${id}`, formData).pipe(
      tap(() => this.notifyProductUpdate()),
      catchError(this.handleError)
    );
  }

  // Delete a product
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/product/deleteProduct/${id}`).pipe(
      tap(() => this.notifyProductUpdate()),
      catchError(this.handleError)
    );
  }

  // Activate/deactivate a product
  activateProduct(id: string): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product/activeProduct/${id}`, {}).pipe(
      tap(() => this.notifyProductUpdate()),
      catchError(this.handleError)
    );
  }

  deactivateProduct(id: string): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product/deactiveProduct/${id}`, {}).pipe(
      tap(() => this.notifyProductUpdate()),
      catchError(this.handleError)
    );
  }

  // Get products by category
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getProductsByCategory/${categoryId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get products by seller
  getSellerProducts(sellerId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/seller/${sellerId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Upload product images
  uploadProductImages(files: File[] | FileList): Observable<{imageUrls: string[]}> {
    const formData = new FormData();
    
    if (files instanceof FileList) {
      Array.from(files).forEach(file => {
        formData.append('imageUrls', file);
      });
    } else {
      files.forEach(file => {
        formData.append('imageUrls', file);
      });
    }
    
    return this.http.post<{imageUrls: string[]}>(`${this.apiUrl}/upload`, formData).pipe(
      catchError(this.handleError)
    );
  }

  
  getSellerOwnProducts(): Observable<Product[]> {
    // The auth interceptor will automatically add the token
    return this.authService.decodeToken(this.authService.getToken()).pipe(
      switchMap(decoded => {
        if (!decoded) {
          console.error('Could not decode token');
          return throwError(() => new Error('Authentication failed'));
        }
        
        // Use the id from the decoded token
        const sellerId = decoded.id || decoded._id || decoded.sub;
        
        if (!sellerId) {
          console.error('No seller ID found in token');
          return throwError(() => new Error('No seller ID found'));
        }
        
        // Call the API endpoint with seller ID
        console.log(`Getting products for seller: ${sellerId}`);
        return this.http.get<Product[]>(`${this.apiUrl}/product/getProductBySellerId/${sellerId}`);
      }),
      catchError(error => {
        console.error('Error getting seller products:', error);
        return throwError(() => error);
      })
    );
  }

  // Notification methods
  notifyProductUpdate(): void {
    this.productUpdateSubject.next();
  }

  onProductUpdate(): Observable<void> {
    return this.productUpdateSubject.asObservable();
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    console.error('Error details:', {
      status: error.status,
      message: error.error,
      headers: error.headers.keys(),
      url: error.url
    });
    
    return throwError(() => error);
  }
}