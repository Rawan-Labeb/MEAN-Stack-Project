import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DistReq } from '../../_models/dist-req.model';

@Injectable({
  providedIn: 'root'
})
export class ClerkDistributionService {
  private apiUrl = 'http://localhost:5000/distReq';

  constructor(private http: HttpClient) { }

  // Get all requests made by this clerk
  getClerkRequests(clerkId: string): Observable<DistReq[]> {
    return this.http.get<DistReq[]>(`${this.apiUrl}/getDistriubtionRequestByClerkId/${clerkId}`)
      .pipe(
        tap(data => console.log('Clerk requests:', data)),
        catchError(this.handleError)
      );
  }

  // Create a new distribution request
  createRequest(requestData: any): Observable<DistReq> {
    return this.http.post<DistReq>(`${this.apiUrl}/createDistReq`, requestData)
      .pipe(
        tap(data => console.log('Created request:', data)),
        catchError(error => {
        
          if (error?.error?.message && 
              typeof error.error.message === 'string' && 
              error.error.message.includes('Insufficient quantity')) {
            return throwError(() => ({
              userFriendly: true,
              message: 'Insufficient quantity in main inventory. Request cannot be fulfilled at this time.'
            }));
          }
          return this.handleError(error);
        })
      );
  }

  // Get request details
  getRequestById(requestId: string): Observable<DistReq> {
    return this.http.get<DistReq>(`${this.apiUrl}/getDistReqById/${requestId}`)
      .pipe(
        tap(data => console.log('Request details:', data)),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('API error:', error);
    
    // If it's already a user-friendly error, pass it through
    if (error.userFriendly) {
      return throwError(() => error);
    }
    
    // Parse error message from backend if available
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error && error.error.message) {
      // This is likely the backend error message in JSON format
      errorMessage = error.error.message;
    } else if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      // HTTP status error
      errorMessage = `Error ${error.status}: ${error.statusText}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}