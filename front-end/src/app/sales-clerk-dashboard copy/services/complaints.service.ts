import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Update the interface to match the backend response format
export interface Complaint {
  _id: string;
  user: any; // Might be null
  email: string;
  subject: string;
  description: string;
  status: string; // Backend uses "Pending", "Rejected", not lowercase
  createdAt: string;
  updatedAt: string;
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
    return this.http.get<Complaint[]>(`${this.apiUrl}/complaint/getComplaintsForCustomersAndGuest`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update complaint status
  updateComplaintStatus(complaintId: string, status: string): Observable<any> {
    // Note: Backend expects capitalized status values: "Pending", "In Progress", "Resolved", "Rejected"
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