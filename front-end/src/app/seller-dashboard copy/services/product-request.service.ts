import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ProductRequest } from '../models/product-request.model';
import { AuthServiceService } from '../../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProductRequestService {
  private apiUrl = 'http://localhost:5000/prodReq';

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService,
    private cookieService: CookieService
  ) {}

  getProductRequestsBySeller(): Observable<ProductRequest[]> {
    console.log('Getting product requests for seller...');
    const token = this.cookieService.get('token');
    
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    
    // Use the existing auth service to decode the token
    return this.authService.decodeToken(token).pipe(
      tap(decoded => {
        console.log('Decoded token:', decoded);
      }),
      switchMap(decoded => {
        if (!decoded) {
          return throwError(() => new Error('Invalid token format'));
        }
        
        // Try all possible ID fields in token
        const sellerId = decoded.id || decoded._id || decoded.sub || decoded.userId || decoded.sellerId;
        
        if (!sellerId) {
          return throwError(() => new Error('No seller ID found in token'));
        }
        
        console.log('Using seller ID:', sellerId);
        return this.http.get<ProductRequest[]>(`${this.apiUrl}/getProdReqForSeller/${sellerId}`);
      }),
      tap(requests => {
        console.log(`Received ${requests?.length || 0} product requests`);
      }),
      catchError(error => {
        console.error('Error in product requests:', error);
        return throwError(() => error);
      })
    );
  }

  updateRequestStatus(id: string, status: string, message: string): Observable<ProductRequest> {
    return this.http.post<ProductRequest>(
      `${this.apiUrl}/updateProdReqStatusAndMsg/${id}`,
      { status, message }
    ).pipe(
      catchError(error => {
        console.error('Error updating request status:', error);
        return throwError(() => error);
      })
    );
  }
}