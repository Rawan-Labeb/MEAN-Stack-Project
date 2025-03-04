import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ProductRequest } from '../models/product-request.model';
import { AuthServiceService } from '../../_services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProductRequestService {
  private apiUrl = 'http://localhost:5000/prodReq';

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {}

  getProductRequestsBySeller(): Observable<ProductRequest[]> {
    console.log('Getting product requests for seller...');

    return this.authService.decodeToken(this.authService.getToken()).pipe(
      map(decoded => {
        if (!decoded) {
          throw new Error('Authentication failed');
        }
        // Check all possible ID fields in the token
        const sellerId = decoded.id || decoded._id || decoded.userId || decoded.sellerId;
        if (!sellerId) {
          throw new Error('No seller ID found in token');
        }
        return sellerId;
      }),
      switchMap(sellerId => {
        console.log('Using seller ID:', sellerId);
        // Let the interceptor handle the auth header
        return this.http.get<ProductRequest[]>(`${this.apiUrl}/getProdReqForSeller/${sellerId}`);
      }),
      tap(requests => console.log('Received requests:', requests)),
      catchError(error => {
        console.error('Error in product requests:', error);
        return throwError(() => error?.message || 'Failed to load product requests');
      })
    );
  }

  updateRequestStatus(id: string, status: string, message: string): Observable<ProductRequest> {
    // Let the interceptor handle the auth header
    return this.http.post<ProductRequest>(
      `${this.apiUrl}/updateProdReqStatusAndMsg/${id}`,
      { status, message }
    ).pipe(
      tap(response => console.log('Status update response:', response)),
      catchError(error => {
        console.error('Update status error:', error);
        return throwError(() => error?.message || 'Failed to update status');
      })
    );
  }
}