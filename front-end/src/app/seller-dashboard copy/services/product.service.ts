import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { Product, ProductFormData } from '../models/product.model';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { AuthServiceService } from '../../_services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000'; 
  private productUpdateSubject = new Subject<void>();
  productUpdates$ = this.productUpdateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {}

  // Core CRUD operations
  getProducts(): Observable<Product[]> {
    return this.authService.decodeToken(this.authService.getToken()).pipe(
      switchMap(decoded => {
        if (!decoded) {
          console.error('Could not decode token');
          return throwError(() => new Error('Authentication failed'));
        }
        
        const sellerId = decoded.id || decoded._id || decoded.sub;
        
        if (!sellerId) {
          console.error('No seller ID found in token');
          return throwError(() => new Error('No seller ID found'));
        }
        
        console.log(`Getting products for seller: ${sellerId}`);
        // Auth interceptor will add the token
        return this.http.get<Product[]>(`${this.apiUrl}/product/getProductBySellerId/${sellerId}`);
      }),
      catchError(error => {
        console.error('Error getting seller products:', error);
        return throwError(() => error);
      })
    );
  }

  getAllProducts(): Observable<Product[]> {
    // Auth interceptor will add the token
    return this.http.get<Product[]>(`${this.apiUrl}/product/getAllProducts`).pipe(
      catchError(this.handleError)
    );
  }

  getActiveProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getActiveProducts`).pipe(
      catchError(this.handleError)
    );
  }

  getDeactivatedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/product/getDeactivatedProducts`).pipe(
      catchError(this.handleError)
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/getProductById/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create product with file upload
  createProduct(productData: ProductFormData, files: File[] = []): Observable<any> {
    console.log('Creating product with data:', productData);
    
    // Get the seller ID from the auth token
    return this.authService.decodeToken(this.authService.getToken()).pipe(
      switchMap(decoded => {
        if (!decoded) {
          console.error('Could not decode token');
          return throwError(() => new Error('Authentication failed'));
        }
        
        const sellerId = decoded.id || decoded._id || decoded.sub;
        
        if (!sellerId) {
          console.error('No seller ID found in token');
          return throwError(() => new Error('No seller ID found'));
        }
        
        console.log('Got seller ID:', sellerId);
        
        // Validate number of images - minimum 3 required
        if (files.length < 3) {
          console.error('At least 3 images are required');
          return throwError(() => new Error('Please upload at least 3 images'));
        }
        
        // Validate maximum number of images
        if (files.length > 8) {
          console.error('Maximum 8 images allowed');
          return throwError(() => new Error('Maximum 8 images are allowed'));
        }
        
        // Prepare form data for file upload
        const formData = new FormData();
        
        // Append all files
        Array.from(files).forEach(file => {
          formData.append('imageUrls', file);
        });
        
        // First upload the images - auth interceptor will handle authentication
        return this.http.post<any>(`${this.apiUrl}/upload`, formData).pipe(
          catchError(error => {
            console.error('Error uploading product images:', error);
            return throwError(() => error);
          }),
          switchMap(uploadResult => {
            console.log('Image upload result:', uploadResult);
            
            // Once images are uploaded, create the product
            // Important: Include the sellerId in the request
            const productToSave = {
              name: productData.name,
              description: productData.description,
              price: Number(productData.price),
              quantity: Number(productData.quantity),
              categoryId: productData.categoryId,
              isActive: productData.isActive !== undefined ? productData.isActive : true,
              images: uploadResult.imageUrls || [],
              sellerId: sellerId  // Add seller ID here
            };
            
            console.log('Sending formatted product data with sellerId:', productToSave);
            
            // Create the product with the image URLs
            return this.http.post<any>(`${this.apiUrl}/product/createProduct`, productToSave).pipe(
              tap(() => this.notifyProductUpdate()),
              catchError(error => {
                console.error('Error creating product:', error);
                console.error('Request body was:', productToSave);
                return throwError(() => error);
              })
            );
          })
        );
      })
    );
  }

  // Update the updateProduct method
  updateProduct(id: string, productData: ProductFormData, files: File[] = []): Observable<any> {
    // Get current number of images
    const currentImagesCount = (productData.images || []).length;
    const newImagesCount = files.length;
    const totalImagesCount = currentImagesCount + newImagesCount;
    
    // Check if removing images would go below minimum (when updating existing product)
    if (newImagesCount === 0 && currentImagesCount < 3) {
      console.error('At least 3 images are required for the product');
      return throwError(() => new Error('Please maintain at least 3 images for the product'));
    }
    
    // Check if adding new images would exceed maximum
    if (totalImagesCount > 8) {
      console.error(`Total images (${totalImagesCount}) exceeds maximum of 8`);
      return throwError(() => new Error(`You can have at most 8 images. Currently selected: ${totalImagesCount}`));
    }
    
    return this.authService.decodeToken(this.authService.getToken()).pipe(
      switchMap(decoded => {
        if (!decoded) {
          console.error('Could not decode token');
          return throwError(() => new Error('Authentication failed'));
        }
        
        const sellerId = decoded.id || decoded._id || decoded.sub;
        
        if (!sellerId) {
          console.error('No seller ID found in token');
          return throwError(() => new Error('No seller ID found'));
        }
        
        console.log('Got seller ID for update:', sellerId);
        
        // If we have new files to upload, do that first
        if (newImagesCount > 0) {
          const formData = new FormData();
          
          // Append all files
          Array.from(files).forEach(file => {
            formData.append('imageUrls', file);
          });
          
          // First upload the images
          return this.http.post<any>(`${this.apiUrl}/upload`, formData).pipe(
            catchError(error => {
              console.error('Error uploading product images:', error);
              return throwError(() => error);
            }),
            switchMap(uploadResult => {
              // Once images are uploaded, update the product
              const productToUpdate = {
                name: productData.name,
                description: productData.description,
                price: Number(productData.price),
                quantity: Number(productData.quantity),
                categoryId: productData.categoryId,
                isActive: productData.isActive,
                images: [
                  ...(productData.images || []),
                  ...(uploadResult.imageUrls || [])
                ],
                sellerId: sellerId  // Add seller ID here
              };
              
              console.log('Sending formatted product update data with sellerId:', productToUpdate);
              
              // Update the product with the image URLs
              return this.http.put<any>(`${this.apiUrl}/product/updateProduct/${id}`, productToUpdate).pipe(
                tap(() => this.notifyProductUpdate()),
                catchError(error => {
                  console.error('Error updating product:', error);
                  console.error('Request body was:', productToUpdate);
                  return throwError(() => error);
                })
              );
            })
          );
        } else {
          // No new images to upload, update the product directly
          const productToUpdate = {
            name: productData.name,
            description: productData.description,
            price: Number(productData.price),
            quantity: Number(productData.quantity),
            categoryId: productData.categoryId,
            isActive: productData.isActive,
            images: productData.images || [],
            sellerId: sellerId  // Add seller ID here
          };
          
          console.log('Sending formatted product update data (no new images) with sellerId:', productToUpdate);
          
          return this.http.put<any>(`${this.apiUrl}/product/updateProduct/${id}`, productToUpdate).pipe(
            tap(() => this.notifyProductUpdate()),
            catchError(error => {
              console.error('Error updating product:', error);
              console.error('Request body was:', productToUpdate);
              return throwError(() => error);
            })
          );
        }
      })
    );
  }

  // Delete a product
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/product/deleteProduct/${productId}`).pipe(
      tap(() => this.notifyProductUpdate()),
      catchError(error => {
        console.error('Error deleting product:', error);
        return throwError(() => error);
      })
    );
  }

  // Activate/deactivate a product
  activateProduct(productId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/product/activeProduct/${productId}`, {}).pipe(
      tap(() => this.notifyProductUpdate()),
      catchError(error => {
        console.error('Error activating product:', error);
        return throwError(() => error);
      })
    );
  }

  deactivateProduct(productId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/product/deactiveProduct/${productId}`, {}).pipe(
      tap(() => this.notifyProductUpdate()),
      catchError(error => {
        console.error('Error deactivating product:', error);
        return throwError(() => error);
      })
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
    return this.http.get<Product[]>(`${this.apiUrl}/product/getProductBySellerId/${sellerId}`).pipe(
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

  // Get seller's own products
  getSellerOwnProducts(): Observable<Product[]> {
    return this.authService.decodeToken(this.authService.getToken()).pipe(
      switchMap(decoded => {
        if (!decoded) {
          console.error('Could not decode token');
          return throwError(() => new Error('Authentication failed'));
        }
        
        const sellerId = decoded.id || decoded._id || decoded.sub;
        
        if (!sellerId) {
          console.error('No seller ID found in token');
          return throwError(() => new Error('No seller ID found'));
        }
        
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

  // Enhanced error handling
  private handleError(error: HttpErrorResponse) {
    console.error('API Error Details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message,
      error: error.error
    });
    
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}, Message: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}