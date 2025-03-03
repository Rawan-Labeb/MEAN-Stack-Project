import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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
    // Use auth interceptor and token from auth service
    return this.authService.decodeToken(this.authService.getToken()).pipe(
      switchMap(decoded => {
        if (!decoded || !decoded.id) {
          return throwError(() => new Error('Invalid token or missing seller ID'));
        }
        const sellerId = decoded.id;
        
        // Auth interceptor will add the token header automatically
        return this.http.get<ProductRequest[]>(`${this.apiUrl}/getProdReqForSeller/${sellerId}`);
      })
    );
  }

  updateRequestStatus(id: string, status: string, message: string): Observable<ProductRequest> {
    // Auth interceptor will add the token header automatically
    return this.http.post<ProductRequest>(
      `${this.apiUrl}/updateProdReqStatusAndMsg/${id}`, 
      { status, message }
    );
  }
}