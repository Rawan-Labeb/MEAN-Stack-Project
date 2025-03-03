import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthServiceService } from '../../_services/auth-service.service';

export interface Cashier {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  branch?: {
    _id: string;
    branchName: string;
  };
  contactNo?: string;
  image?: string[];
  isActive: boolean;
  role: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  private apiUrl = 'http://localhost:5000/users';

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) { }

  // Get all cashiers for the branch
  getCashiers(branchId: string): Observable<Cashier[]> {
    // Using the auth interceptor (no need to manually add token)
    return this.http.get<Cashier[]>(`${this.apiUrl}/getUsersBasedOnRole/cashier`)
      .pipe(
        tap(cashiers => {
          // Filter cashiers by branch if needed (could be done on the server side instead)
          return cashiers.filter(cashier => !branchId || cashier.branch?._id === branchId);
        }),
        catchError(this.handleError)
      );
  }

  // Add a new cashier
  addCashier(cashierData: any): Observable<any> {
    // Set role to cashier
    cashierData.role = 'cashier';
    
    // Using the auth interceptor
    return this.http.post<any>(`${this.apiUrl}/register`, cashierData)
      .pipe(catchError(this.handleError));
  }

  // Update an existing cashier
  updateCashier(cashierId: string, cashierData: any): Observable<any> {
    // Using the auth interceptor
    return this.http.put<any>(`${this.apiUrl}/updateUser/${cashierId}`, cashierData)
      .pipe(catchError(this.handleError));
  }

  // Delete a cashier
  deleteCashier(cashierId: string): Observable<any> {
    // Using the auth interceptor
    return this.http.delete<any>(`${this.apiUrl}/deleteUser/${cashierId}`)
      .pipe(catchError(this.handleError));
  }

  // Activate/Deactivate a cashier
  toggleCashierStatus(cashierId: string, activate: boolean): Observable<any> {
    const endpoint = activate ? 'activateUser' : 'deactivateUser';
    // Using the auth interceptor
    return this.http.put<any>(`${this.apiUrl}/${endpoint}/${cashierId}`, {})
      .pipe(catchError(this.handleError));
  }

  // Change cashier role (if ever needed)
  changeCashierRole(cashierId: string, newRole: string): Observable<any> {
    // Using the auth interceptor
    return this.http.put<any>(`${this.apiUrl}/changeUserRole/${cashierId}`, { role: newRole })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      // Server-side error with message
      errorMessage = error.error.message;
    } else if (error.status) {
      // HTTP error
      errorMessage = `Error ${error.status}: ${error.statusText}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}