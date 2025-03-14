import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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

  getActiveSubInventoriesByBranchId(branchId: string): Observable<any[]> {
    console.log(`Fetching active sub-inventories for branch: ${branchId}`);
    
    // First try the specific endpoint
    return this.http.get<any[]>(`${this.apiUrl}/getSubInventoriesByBranchId/${branchId}`).pipe(
      tap(data => console.log(`Fetched ${data.length} sub-inventory items for branch ${branchId}`)),
      catchError(error => {
        console.error(`Error fetching branch inventory with specific endpoint: ${error.message}`);
        
        // If the specific endpoint fails, try the general endpoint and filter by branch
        console.log('Falling back to getSubInventories endpoint with client-side filtering');
        return this.http.get<any[]>(`${this.apiUrl}/getSubInventories`).pipe(
          map(items => {
            const filteredItems = items.filter(item => {
              const itemBranchId = typeof item.branchId === 'object' ? 
                item.branchId._id : item.branchId;
              return itemBranchId === branchId;
            });
            console.log(`Filtered ${items.length} items down to ${filteredItems.length} for branch ${branchId}`);
            return filteredItems;
          }),
          catchError(fallbackError => {
            console.error('Fallback method also failed:', fallbackError);
            return throwError(() => new Error('Failed to fetch inventory data'));
          })
        );
      })
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}