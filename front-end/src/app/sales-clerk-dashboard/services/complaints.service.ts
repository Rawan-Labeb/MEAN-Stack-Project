import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

export interface Complaint {
  _id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt?: string;
  userId?: string;
  guestId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {
  private apiUrl = 'http://localhost:5000'; // Base API URL

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  // Get authentication token
  private getAuthToken(): string {
    return this.cookieService.get('token') || localStorage.getItem('token') || '';
  }

  // Set up headers with auth token
  private getHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Get all complaints for customers and guests
  getComplaints(): Observable<Complaint[]> {
    const url = `${this.apiUrl}/complaint/getComplaintsForCustomersAndGuest`;
    return this.http.get<any>(url, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          // Map backend response to our frontend model
          // Assuming the response is an array of complaints
          return response.map((complaint: any) => ({
            _id: complaint._id,
            customerName: complaint.userId?.firstName + ' ' + complaint.userId?.lastName || 'Guest User',
            customerEmail: complaint.userId?.email || complaint.guestEmail || 'Not provided',
            subject: complaint.subject,
            message: complaint.message || complaint.description,
            status: complaint.status.toLowerCase(),
            createdAt: complaint.createdAt,
            updatedAt: complaint.updatedAt,
            userId: complaint.userId?._id,
            guestId: complaint.guestId?._id
          }));
        }),
        catchError(this.handleError)
      );
  }

  // Update complaint status
  updateComplaintStatus(complaintId: string, status: string): Observable<any> {
    const url = `${this.apiUrl}/complaint/status/${complaintId}`;
    return this.http.put(url, { status }, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }
}