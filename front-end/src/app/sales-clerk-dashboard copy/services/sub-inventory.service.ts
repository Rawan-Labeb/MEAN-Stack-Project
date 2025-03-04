import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthServiceService } from '../../_services/auth-service.service';

export interface SubInventoryItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  description?: string;
  category?: string;
  mainInventoryId?: string;
  branchId?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SubInventoryService {
  private apiUrl = 'http://localhost:5000/subInventory';

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {}

  getSubInventoryByBranch(branchId: string): Observable<SubInventoryItem[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getSubInventoryByBranchId/${branchId}`)
      .pipe(
        map(items => items.map(item => ({
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          description: item.description,
          category: item.category,
          mainInventoryId: item.mainInventoryId,
          branchId: item.branchId,
          isActive: item.isActive
        }))),
        catchError(this.handleError)
      );
  }

  getActiveSubInventoriesByBranchId(branchId: string): Observable<SubInventoryItem[]> {
    return this.getSubInventoryByBranch(branchId).pipe(
      map(items => items.filter(item => item.isActive !== false)), // Filter only active items
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}