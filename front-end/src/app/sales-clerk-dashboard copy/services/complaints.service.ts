import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

  constructor(private http: HttpClient) { }

  // Get all complaints for customers and guests
  getComplaints(): Observable<Complaint[]> {
    // Using the Auth interceptor (no manual token handling needed)
    return this.http.get<any>(`${this.apiUrl}/complaint/getComplaintsForCustomersAndGuest`)
      .pipe(
        map(response => {
          // Map backend response to our frontend model
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
    // Using the Auth interceptor (no manual token handling needed)
    return this.http.put(`${this.apiUrl}/complaint/status/${complaintId}`, { status })
      .pipe(
        catchError(this.handleError)
      );
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
}