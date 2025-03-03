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
        catchError(this.handleError)
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
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      errorMessage = `Error ${error.status}: ${error.statusText}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}